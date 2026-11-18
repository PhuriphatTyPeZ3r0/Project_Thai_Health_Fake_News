"""Baseline Model Module (P2: Mittrapak)
Task B1-B3:
- TF-IDF Vectorizer with PyThaiNLP word tokenization
- Logistic Regression Classifier
- Train on Data/Processed/train.csv
- Evaluate on Data/Processed/test.csv using Src.Metrics.compute
- Output: Results/Metrics_Baseline.json, Models/Baseline_Model.joblib
"""

import os
from pathlib import Path
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

from Src.Metrics import compute


def thai_tokenizer(text: str):
    """Tokenize Thai text using PyThaiNLP if available, fallback to char/whitespace."""
    try:
        from pythainlp.tokenize import word_tokenize
        return word_tokenize(text, engine="newmm")
    except ImportError:
        return text.split()


def build_baseline_pipeline() -> Pipeline:
    """Construct TF-IDF + Logistic Regression pipeline."""
    return Pipeline([
        ("tfidf", TfidfVectorizer(tokenizer=thai_tokenizer, min_df=1, ngram_range=(1, 2))),
        ("clf", LogisticRegression(max_iter=1000, random_state=42, class_weight="balanced")),
    ])


def train_and_evaluate(
    train_csv: str = "Data/Processed/train.csv",
    test_csv: str = "Data/Processed/test.csv",
    metrics_output: str = "Results/Metrics_Baseline.json",
    model_output: str = "Models/Baseline_Model.joblib",
):
    train_path = Path(train_csv)
    test_path = Path(test_csv)

    if not train_path.exists() or not test_path.exists():
        raise FileNotFoundError(f"Processed datasets not found at {train_path} / {test_path}. Run Src.Data_Pipeline first.")

    train_df = pd.read_csv(train_path)
    test_df = pd.read_csv(test_path)

    X_train, y_train = train_df["text"].tolist(), train_df["label"].tolist()
    X_test, y_test = test_df["text"].tolist(), test_df["label"].tolist()

    print(f"[Baseline] Training TF-IDF + Logistic Regression on {len(X_train)} samples...")
    pipeline = build_baseline_pipeline()
    pipeline.fit(X_train, y_train)

    # Evaluate
    y_pred = pipeline.predict(X_test)
    metrics = compute(y_test, y_pred, output_path=metrics_output)

    # Save trained model
    out_m = Path(model_output)
    out_m.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, out_m)

    print(f"[Baseline] Saved model to {out_m}")
    print(f"[Baseline] Evaluation Metrics: {metrics}")
    return metrics, pipeline


if __name__ == "__main__":
    train_and_evaluate()
