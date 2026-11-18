"""Unit Tests for Thai Health Fake-News NLP Engine"""

import pytest
from src.metrics import compute
from src.predict import predict, _baseline_predictor, _wcb_predictor


def test_metrics_computation():
    y_true = [0, 1, 1, 0, 1]
    y_pred = [0, 1, 0, 0, 1]
    res = compute(y_true, y_pred)

    assert "accuracy" in res
    assert "precision" in res
    assert "recall" in res
    assert "f1_macro" in res
    assert "f1_fake" in res
    assert 0.0 <= res["accuracy"] <= 1.0
    assert 0.0 <= res["f1_macro"] <= 1.0


def test_predict_empty_text():
    res = predict("")
    assert "error" in res or res.get("confidence") == 0.0


def test_predict_baseline():
    res = predict("ดื่มน้ำมะนาวผสมโซดารักษามะเร็งหายขาด 100%", model_type="baseline")
    assert "label" in res
    assert "confidence" in res
    assert res["label"] in ["fake", "fact"]


def test_predict_wangchanberta():
    res = predict("อย. ย้ำเตือน อย่าหลงเชื่อผลิตภัณฑ์เสริมอาหารอวดอ้างสรรพคุณเกินจริง", model_type="wangchanberta")
    assert "label" in res
    assert "confidence" in res
    assert res["label"] in ["fake", "fact"]


def test_predict_both_comparison():
    res = predict("สมุนไพรต้มน้ำรักษาโรคเบาหวาน", model_type="both")
    assert "wangchanberta" in res
    assert "baseline" in res
