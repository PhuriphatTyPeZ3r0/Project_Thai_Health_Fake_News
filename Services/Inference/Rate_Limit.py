"""Rate limiting + overload protection for the inference API (no extra dependency).

* per-client sliding window:   RATE_LIMIT_PER_MIN requests per 60 s   -> HTTP 429 + Retry-After
* global in-flight cap:        MAX_CONCURRENT inference requests      -> HTTP 503 + Retry-After
  (keeps a flood from queueing behind the GPU model until the container times out)

Limits are kept in memory, so they are per container. On Modal combine with `max_containers` so the
effective limit is bounded (limit x containers). /health and the docs are never limited.
"""
import asyncio
import os
import time
from collections import deque
from typing import Callable, Deque, Dict

from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.types import ASGIApp, Receive, Scope, Send

EXEMPT_PATHS = {"/health", "/docs", "/openapi.json", "/redoc"}
MAX_TRACKED_CLIENTS = 10_000  # bound memory if someone rotates source addresses


def client_key(request: Request) -> str:
    """Client address. Behind Modal's proxy use the LAST X-Forwarded-For entry (the one the trusted
    proxy appended); a client cannot forge that one. Falls back to the socket peer."""
    xff = request.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[-1].strip()
    return request.client.host if request.client else "unknown"


class RateLimitMiddleware:
    def __init__(
        self,
        app: ASGIApp,
        limit_per_min: int = int(os.getenv("RATE_LIMIT_PER_MIN", "500")),
        max_concurrent: int = int(os.getenv("MAX_CONCURRENT", "20")),
        window_s: float = 60.0,
        clock: Callable[[], float] = time.monotonic,
    ):
        self.app, self.limit, self.max_concurrent, self.window, self.clock = app, limit_per_min, max_concurrent, window_s, clock
        self.hits: Dict[str, Deque[float]] = {}
        self.in_flight = 0

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope["type"] != "http" or scope["method"] == "OPTIONS" or scope["path"] in EXEMPT_PATHS:
            return await self.app(scope, receive, send)

        request = Request(scope)
        now, key = self.clock(), client_key(request)
        q = self.hits.setdefault(key, deque())
        while q and now - q[0] >= self.window:
            q.popleft()
        if len(q) >= self.limit:
            retry = max(1, int(self.window - (now - q[0])) + 1)
            return await self._reject(scope, receive, send, 429, f"Rate limit exceeded ({self.limit} requests/min). Try again later.", retry)
        if self.in_flight >= self.max_concurrent:
            return await self._reject(scope, receive, send, 503, "Server is busy. Try again shortly.", 2)

        q.append(now)
        if len(self.hits) > MAX_TRACKED_CLIENTS:  # drop idle clients
            for k in [k for k, v in self.hits.items() if not v or now - v[-1] >= self.window]:
                del self.hits[k]
        self.in_flight += 1
        try:
            await self.app(scope, receive, send)
        finally:
            self.in_flight -= 1

    @staticmethod
    async def _reject(scope, receive, send, status: int, detail: str, retry_after: int):
        resp = JSONResponse({"detail": detail}, status_code=status, headers={"Retry-After": str(retry_after)})
        await resp(scope, receive, send)
