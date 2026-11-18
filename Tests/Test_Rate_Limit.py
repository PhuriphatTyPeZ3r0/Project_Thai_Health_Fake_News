"""Rate limit / overload protection tests (no model, no network)."""
import asyncio

import httpx
from fastapi import FastAPI
from fastapi.testclient import TestClient

from Services.Inference.Rate_Limit import RateLimitMiddleware


class Clock:
    def __init__(self):
        self.t = 1000.0

    def __call__(self):
        return self.t


def make_app(limit=3, max_concurrent=4, clock=None):
    app = FastAPI()

    @app.get("/health")
    def health():
        return {"ok": True}

    @app.post("/predict")
    def predict():
        return {"ok": True}

    @app.get("/slow")
    async def slow():
        await asyncio.sleep(0.2)
        return {"ok": True}

    app.add_middleware(RateLimitMiddleware, limit_per_min=limit, max_concurrent=max_concurrent,
                       clock=clock or Clock())
    return app


def test_429_after_limit_with_retry_after_and_health_exempt():
    c = TestClient(make_app(limit=3))
    assert [c.post("/predict").status_code for _ in range(3)] == [200, 200, 200]
    r = c.post("/predict")
    assert r.status_code == 429 and int(r.headers["Retry-After"]) >= 1
    assert all(c.get("/health").status_code == 200 for _ in range(10))  # monitoring is never limited


def test_window_resets_and_clients_are_independent():
    clock = Clock()
    c = TestClient(make_app(limit=2, clock=clock))
    a, b = {"X-Forwarded-For": "1.1.1.1"}, {"X-Forwarded-For": "2.2.2.2"}
    assert [c.post("/predict", headers=a).status_code for _ in range(3)] == [200, 200, 429]
    assert c.post("/predict", headers=b).status_code == 200  # another client is unaffected
    clock.t += 61
    assert c.post("/predict", headers=a).status_code == 200  # window passed


def test_client_cannot_dodge_limit_by_forging_forwarded_for():
    # a trusted proxy appends the real address LAST; forged leading entries must not create new buckets
    c = TestClient(make_app(limit=2))
    codes = [c.post("/predict", headers={"X-Forwarded-For": f"{i}.{i}.{i}.{i}, 9.9.9.9"}).status_code for i in range(4)]
    assert codes == [200, 200, 429, 429]


def test_global_concurrency_cap_returns_503():
    app = make_app(limit=100, max_concurrent=2)

    async def run():
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://t") as c:
            return sorted(r.status_code for r in await asyncio.gather(*[c.get("/slow") for _ in range(4)]))

    assert asyncio.run(run()) == [200, 200, 503, 503]
