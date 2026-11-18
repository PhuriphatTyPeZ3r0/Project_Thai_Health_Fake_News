"""FastAPI Inference Service (P5: Phuriphat Fullstack)
Service 2 in the Monorepo:
Handles real-time inference for Thai Health Fake-News Detection.
Exposes RESTful endpoints for the Next.js MVC WebApp.
"""

import sys
from contextlib import asynccontextmanager
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))  # repo root, so `python Services/Inference/App.py` works

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
import time

from Services.Inference.Rate_Limit import RateLimitMiddleware
from Src.Predict import ModelUnavailableError, predict, _baseline_predictor, _wcb_predictor

@asynccontextmanager
async def lifespan(_app: FastAPI):
    """Load the fine-tuned model at startup (not on the first user request). A failure is not fatal:
    endpoints then answer 503 until it loads (retried every 60 s)."""
    try:
        _wcb_predictor.lazy_load()
    except ModelUnavailableError as e:
        print(f"[startup] {e}")
    yield


app = FastAPI(
    lifespan=lifespan,
    title="Thai Health Fake-News Inference API",
    description="High-performance NLP inference service using WangchanBERTa and TF-IDF Baseline",
    version="1.0.0",
)

# Rate limit + overload protection (added first so CORS stays outermost and 429/503 carry CORS headers)
app.add_middleware(RateLimitMiddleware)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NewsInferenceRequest(BaseModel):
    text: str = Field(..., min_length=3, max_length=2000, description="Thai health news or claim text")
    model_type: Optional[str] = Field("wangchanberta", description="'wangchanberta', 'baseline', or 'both'")


class PredictionDetail(BaseModel):
    label: str
    confidence: float
    model: str
    probabilities: Dict[str, float]


class DualComparisonResponse(BaseModel):
    wangchanberta: PredictionDetail
    baseline: PredictionDetail
    agreement: bool
    latency_ms: float


@app.get("/health")
def health_check():
    """Healthy only when the fine-tuned WangchanBERTa is actually loaded (loads it on first call)."""
    try:
        _wcb_predictor.lazy_load()
    except ModelUnavailableError as e:
        raise HTTPException(status_code=503, detail=str(e))
    return {
        "status": "healthy",
        "service": "thai-health-fakenews-inference",
        "wangchanberta": _wcb_predictor.status(),
        "baseline": _baseline_predictor.status(),
    }


@app.post("/predict", response_model=Dict[str, Any])
def predict_endpoint(req: NewsInferenceRequest):
    start_t = time.time()
    cleaned = req.text.strip()
    if not cleaned:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    try:
        result = predict(cleaned, model_type=req.model_type)
    except ModelUnavailableError as e:
        raise HTTPException(status_code=503, detail=str(e))
    elapsed = round((time.time() - start_t) * 1000, 2)
    return {
        "success": True,
        "data": result,
        "latency_ms": elapsed,
    }


@app.post("/compare", response_model=DualComparisonResponse)
def compare_endpoint(req: NewsInferenceRequest):
    start_t = time.time()
    cleaned = req.text.strip()
    if not cleaned:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    try:
        wcb_res = _wcb_predictor.predict(cleaned)
        base_res = _baseline_predictor.predict(cleaned)
    except ModelUnavailableError as e:
        raise HTTPException(status_code=503, detail=str(e))

    agreement = wcb_res.get("label") == base_res.get("label")
    elapsed = round((time.time() - start_t) * 1000, 2)

    return DualComparisonResponse(
        wangchanberta=PredictionDetail(**wcb_res),
        baseline=PredictionDetail(**base_res),
        agreement=agreement,
        latency_ms=elapsed,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
