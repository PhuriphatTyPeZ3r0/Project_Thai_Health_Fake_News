"""Model Prediction Interface (P3: Kitkhachon & P5: Phuriphat)
Interface contract specified in mini_project_plan.pdf:
predict(text: str) -> {"label": "fake"|"fact", "confidence": float}

Extended with OOP architecture to support Dual-Model toggle (WangchanBERTa & Baseline)
"""

from abc import ABC, abstractmethod
from pathlib import Path
from typing import Dict, Any, Optional
import os


class BasePredictor(ABC):
    """Abstract Base Class for NLP Prediction Engines."""

    @abstractmethod
    def predict(self, text: str) -> Dict[str, Any]:
        """Predict whether Thai health news text is fake or fact."""
        pass


class BaselinePredictor(BasePredictor):
    """TF-IDF + Logistic Regression predictor."""

    def __init__(self, model_path: str = "models/baseline_model.joblib"):
        self.model_path = Path(model_path)
        self.pipeline = None
        self._load_model()

    def _load_model(self):
        if self.model_path.exists():
            import joblib
            self.pipeline = joblib.load(self.model_path)
        else:
            self.pipeline = None

    def predict(self, text: str) -> Dict[str, Any]:
        if not text or not text.strip():
            return {"error": "Input text cannot be empty", "label": "unknown", "confidence": 0.0}

        if self.pipeline is None:
            # Fallback heuristic stub for development before training
            is_suspicious = any(word in text for word in ["หายขาด", "สลายไขมัน", "100%", "แชร์สนั่น", "สูตรเด็ด"])
            conf = 0.88 if is_suspicious else 0.75
            lbl = "fake" if is_suspicious else "fact"
            return {
                "label": lbl,
                "confidence": conf,
                "model": "baseline_tfidf_heuristic",
                "probabilities": {"fact": 1.0 - conf if lbl == "fake" else conf, "fake": conf if lbl == "fake" else 1.0 - conf},
            }

        probs = self.pipeline.predict_proba([text])[0]
        fake_prob = float(probs[1])
        fact_prob = float(probs[0])

        if fake_prob >= 0.5:
            label = "fake"
            confidence = round(fake_prob, 4)
        else:
            label = "fact"
            confidence = round(fact_prob, 4)

        return {
            "label": label,
            "confidence": confidence,
            "model": "baseline_tfidf_logreg",
            "probabilities": {
                "fact": round(fact_prob, 4),
                "fake": round(fake_prob, 4),
            },
        }


class WangchanBertaPredictor(BasePredictor):
    """Fine-tuned WangchanBERTa transformer predictor."""

    def __init__(self, model_name_or_path: Optional[str] = None):
        self.model_name = model_name_or_path or os.getenv(
            "WANGCHANBERTA_MODEL",
            "airesearch/wangchanberta-base-att-spm-uncased"
        )
        self.tokenizer = None
        self.model = None
        self.device = "cpu"
        self._initialized = False

    def lazy_load(self):
        """Load model onto device when invoked."""
        if self._initialized:
            return
        try:
            import torch
            from transformers import AutoTokenizer, AutoModelForSequenceClassification

            self.device = "cuda" if torch.cuda.is_available() else "cpu"
            print(f"[WangchanBERTa] Loading {self.model_name} on {self.device}...")
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = AutoModelForSequenceClassification.from_pretrained(self.model_name, num_labels=2)
            self.model.to(self.device)
            self.model.eval()
            self._initialized = True
        except Exception as e:
            print(f"[WangchanBERTa] Warning: Failed to load transformer model: {e}")
            self._initialized = False

    def predict(self, text: str) -> Dict[str, Any]:
        if not text or not text.strip():
            return {"error": "Input text cannot be empty", "label": "unknown", "confidence": 0.0}

        self.lazy_load()

        if not self._initialized:
            # Fallback stub for dev / mock
            is_fake = any(w in text for w in ["หายขาด", "สลายไขมัน", "100%", "มะนาวโซดา", "กระเทียมสด"])
            conf = 0.94 if is_fake else 0.89
            lbl = "fake" if is_fake else "fact"
            return {
                "label": lbl,
                "confidence": conf,
                "model": "wangchanberta_stub",
                "probabilities": {
                    "fact": round(1.0 - conf if lbl == "fake" else conf, 4),
                    "fake": round(conf if lbl == "fake" else 1.0 - conf, 4),
                },
            }

        import torch
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=416,
            padding="max_length",
        ).to(self.device)

        with torch.no_grad():
            outputs = self.model(**inputs)
            probs = torch.softmax(outputs.logits, dim=-1).squeeze().tolist()

        fact_prob = float(probs[0])
        fake_prob = float(probs[1])

        label = "fake" if fake_prob >= 0.5 else "fact"
        confidence = fake_prob if label == "fake" else fact_prob

        return {
            "label": label,
            "confidence": round(confidence, 4),
            "model": "wangchanberta_finetuned",
            "probabilities": {
                "fact": round(fact_prob, 4),
                "fake": round(fake_prob, 4),
            },
        }


# Global singleton instances
_baseline_predictor = BaselinePredictor()
_wcb_predictor = WangchanBertaPredictor()


def predict(text: str, model_type: str = "wangchanberta") -> Dict[str, Any]:
    """Default function interface specified in mini_project_plan.pdf.

    Args:
        text: Input Thai news text
        model_type: 'wangchanberta' | 'baseline' | 'both'
    """
    if model_type == "baseline":
        return _baseline_predictor.predict(text)
    elif model_type == "both":
        return {
            "wangchanberta": _wcb_predictor.predict(text),
            "baseline": _baseline_predictor.predict(text),
        }
    else:
        return _wcb_predictor.predict(text)


if __name__ == "__main__":
    sample = "สูตรเด็ดสมุนไพรรักษาโรคเบาหวานให้หายขาดใน 7 วัน"
    print("Baseline:", predict(sample, model_type="baseline"))
    print("WangchanBERTa:", predict(sample, model_type="wangchanberta"))
    print("Both:", predict(sample, model_type="both"))
