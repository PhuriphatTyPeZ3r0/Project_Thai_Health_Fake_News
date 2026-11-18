"""Model Prediction Interface (P3: Kitkhachon & P5: Phuriphat)
Interface contract specified in mini_project_plan.pdf:
predict(text: str) -> {"label": "fake"|"fact", "confidence": float}

Dual-model (WangchanBERTa fine-tuned + TF-IDF baseline). No fake fallback: if a model cannot be
loaded, ModelUnavailableError is raised (the API turns it into HTTP 503) instead of returning
made-up predictions.

Config (env):
    WANGCHANBERTA_MODEL     Hub id or local dir     default Kitkhachon/wcb-limesoda-fakenews
    WANGCHANBERTA_REVISION  commit sha/tag to pin   default latest
    BASELINE_MODEL_PATH     joblib file             default Models/baseline_model.joblib (repo-root relative)
"""

import os
import threading
import time
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any, Dict, Optional

import numpy as np

from Src.Windowing import doc_probs, make_chunks

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_WCB_MODEL = "Kitkhachon/wcb-limesoda-fakenews"
BASE_CHECKPOINT = "airesearch/wangchanberta-base-att-spm-uncased"
RETRY_AFTER_S = 60  # after a failed load, wait before trying again (avoid reloading on every request)
BATCH_SIZE = 8


def _fetch(model_id: str, revision: Optional[str], weights: bool, attempts: int = 3) -> str:
    """Resolve a Hub id (or local dir) to a local folder without importing torch."""
    if os.path.isdir(model_id):
        return model_id
    from huggingface_hub import snapshot_download

    patterns = ["*.json", "*.model", "*.txt"] + (["*.safetensors"] if weights else [])
    last: Optional[Exception] = None
    for i in range(attempts):
        try:
            return snapshot_download(model_id, revision=revision, allow_patterns=patterns)
        except Exception as e:  # network reset, repo not found, ...
            last = e
            print(f"[WangchanBERTa] download of {model_id} failed ({i + 1}/{attempts}): {type(e).__name__}")
    raise OSError(f"cannot download {model_id}: {type(last).__name__}: {last}")


class ModelUnavailableError(RuntimeError):
    """A model could not be loaded; callers should answer 503, not guess."""


class BasePredictor(ABC):
    """Abstract Base Class for NLP Prediction Engines."""

    @abstractmethod
    def predict(self, text: str) -> Dict[str, Any]:
        """Predict whether Thai health news text is fake or fact."""

    @abstractmethod
    def status(self) -> Dict[str, Any]:
        """Cheap readiness info for /health."""


def _result(fact_prob: float, fake_prob: float, model: str, **extra) -> Dict[str, Any]:
    label = "fake" if fake_prob >= 0.5 else "fact"
    return {
        "label": label,
        "confidence": round(fake_prob if label == "fake" else fact_prob, 4),
        "model": model,
        "probabilities": {"fact": round(fact_prob, 4), "fake": round(fake_prob, 4)},
        **extra,
    }


class BaselinePredictor(BasePredictor):
    """TF-IDF + Logistic Regression predictor."""

    def __init__(self, model_path: Optional[str] = None):
        p = Path(model_path or os.getenv("BASELINE_MODEL_PATH", "Models/baseline_model.joblib"))
        self.model_path = p if p.is_absolute() else ROOT / p
        self.pipeline = None
        self._lock = threading.Lock()

    def _load(self):
        with self._lock:
            if self.pipeline is None:
                if not self.model_path.exists():
                    raise ModelUnavailableError(
                        f"baseline model file not found: {self.model_path} "
                        "(train it with Src.Baseline and ship the .joblib)"
                    )
                import joblib
                self.pipeline = joblib.load(self.model_path)

    def status(self) -> Dict[str, Any]:
        return {"available": self.model_path.exists(), "loaded": self.pipeline is not None}

    def predict(self, text: str) -> Dict[str, Any]:
        if not text or not text.strip():
            return {"error": "Input text cannot be empty", "label": "unknown", "confidence": 0.0}
        if self.pipeline is None:
            self._load()
        fact_prob, fake_prob = (float(x) for x in self.pipeline.predict_proba([text])[0])
        return _result(fact_prob, fake_prob, "baseline_tfidf_logreg")


class WangchanBertaPredictor(BasePredictor):
    """Fine-tuned WangchanBERTa. Long texts use the same sliding window as training/evaluation."""

    def __init__(self, model_name_or_path: Optional[str] = None):
        self.model_name = model_name_or_path or os.getenv("WANGCHANBERTA_MODEL", DEFAULT_WCB_MODEL)
        self.revision = os.getenv("WANGCHANBERTA_REVISION") or None
        self.tokenizer = None
        self.model = None
        self.device = "cpu"
        self._lock = threading.Lock()
        self._error: Optional[str] = None
        self._failed_at = 0.0

    @property
    def loaded(self) -> bool:
        return self.model is not None

    def lazy_load(self):
        """Load once. Raises ModelUnavailableError (no stub) and backs off after a failure."""
        if self.loaded:
            return
        with self._lock:
            if self.loaded:
                return
            if self._error and time.time() - self._failed_at < RETRY_AFTER_S:
                raise ModelUnavailableError(self._error)
            try:
                # 1) Download BEFORE importing torch. On some Windows setups any network call made after
                #    torch/CUDA is loaded kills the process (access violation in getaddrinfo), so the
                #    server dies silently at "Loading ...". Files come from the local cache afterwards.
                model_dir = _fetch(self.model_name, self.revision, weights=True)
                base_dir = _fetch(BASE_CHECKPOINT, None, weights=False)  # tokenizer files only

                import torch
                from transformers import AutoModelForSequenceClassification, AutoTokenizer

                self.device = "cuda" if torch.cuda.is_available() else "cpu"
                print(f"[WangchanBERTa] Loading {self.model_name} on {self.device}...")
                model = AutoModelForSequenceClassification.from_pretrained(model_dir)
                # A tokenizer saved by a newer transformers may not load on an older one; fine-tuning
                # does not change the tokenizer, so fall back to the base checkpoint's.
                try:
                    tok = AutoTokenizer.from_pretrained(model_dir)
                except Exception as e:
                    print(f"[WangchanBERTa] tokenizer of {self.model_name} not loadable ({type(e).__name__}); "
                          f"using {BASE_CHECKPOINT}")
                    tok = AutoTokenizer.from_pretrained(base_dir)
                if not getattr(tok, "is_fast", False):
                    raise RuntimeError("a fast tokenizer is required for sliding windows")
                # Guard against serving a model that was never fine-tuned (random classification head).
                if dict(model.config.id2label) != {0: "fact", 1: "fake"}:
                    raise RuntimeError(
                        f"{self.model_name} has labels {dict(model.config.id2label)}, expected "
                        "{0: 'fact', 1: 'fake'} - is this the fine-tuned model?"
                    )
                self.model = model.to(self.device).eval()
                self.tokenizer = tok
                self._error = None
            except Exception as e:
                self._error = f"cannot load WangchanBERTa '{self.model_name}': {type(e).__name__}: {e}"
                self._failed_at = time.time()
                print(f"[WangchanBERTa] {self._error}")
                raise ModelUnavailableError(self._error) from e

    def status(self) -> Dict[str, Any]:
        return {"model": self.model_name, "revision": self.revision, "loaded": self.loaded, "error": self._error}

    def predict(self, text: str) -> Dict[str, Any]:
        if not text or not text.strip():
            return {"error": "Input text cannot be empty", "label": "unknown", "confidence": 0.0}
        self.lazy_load()

        import torch
        from transformers import DataCollatorWithPadding

        feats, doc_ids = make_chunks(self.tokenizer, [text], [0])
        rows = [{"input_ids": feats["input_ids"][i], "attention_mask": feats["attention_mask"][i]}
                for i in range(len(doc_ids))]
        collate = DataCollatorWithPadding(self.tokenizer)
        logits = []
        with torch.no_grad():
            for i in range(0, len(rows), BATCH_SIZE):
                b = {k: v.to(self.device) for k, v in collate(rows[i:i + BATCH_SIZE]).items()}
                logits.append(self.model(**b).logits.float().cpu().numpy())
        fact_prob, fake_prob = doc_probs(np.concatenate(logits), doc_ids, 1)[0]
        return _result(float(fact_prob), float(fake_prob), "wangchanberta_finetuned", windows=len(rows))


# Global singleton instances (models load lazily on first use)
_baseline_predictor = BaselinePredictor()
_wcb_predictor = WangchanBertaPredictor()


def predict(text: str, model_type: str = "wangchanberta") -> Dict[str, Any]:
    """Default function interface specified in mini_project_plan.pdf.

    Args:
        text: Input Thai news text
        model_type: 'wangchanberta' | 'baseline' | 'both'
    Raises:
        ModelUnavailableError: the requested model could not be loaded
    """
    if model_type == "baseline":
        return _baseline_predictor.predict(text)
    if model_type == "both":
        return {
            "wangchanberta": _wcb_predictor.predict(text),
            "baseline": _baseline_predictor.predict(text),
        }
    return _wcb_predictor.predict(text)


if __name__ == "__main__":
    sample = "สูตรเด็ดสมุนไพรรักษาโรคเบาหวานให้หายขาดใน 7 วัน"
    print("Baseline:", predict(sample, model_type="baseline"))
    print("WangchanBERTa:", predict(sample, model_type="wangchanberta"))
