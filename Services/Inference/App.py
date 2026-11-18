"""FastAPI Inference Service (P5: Phuriphat Fullstack)
Service 2 in the Monorepo:
Handles real-time inference for Thai Health Fake-News Detection.
Exposes RESTful endpoints for the Next.js MVC WebApp.
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
import time

from Src.Predict import predict, _baseline_predictor, _wcb_predictor

app = FastAPI(
    title="Thai Health Fake-News Inference API",
    description="High-performance NLP inference service using WangchanBERTa and TF-IDF Baseline",
    version="1.0.0",
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NewsInferenceRequest(BaseModel):
    text: str = Field(..., min_length=3, max_length=1500, description="Thai health news or claim text")
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


@app.get("/health", status_code=status.HTTP_200_OK)
def health_check():
    return {
        "status": "healthy",
        "service": "thai-health-fakenews-inference",
        "models_available": ["wangchanberta", "baseline_tfidf_logreg"],
    }


@app.post("/predict", response_model=Dict[str, Any])
def predict_endpoint(req: NewsInferenceRequest):
    start_t = time.time()
    cleaned = req.text.strip()
    if not cleaned:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    result = predict(cleaned, model_type=req.model_type)
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

    wcb_res = _wcb_predictor.predict(cleaned)
    base_res = _baseline_predictor.predict(cleaned)

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
