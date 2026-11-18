"""Unit tests ของ Metrics module (P2 / B1)"""

import json

import numpy as np
import pytest

from Src.Metrics import compute

KEYS = {"accuracy", "precision", "recall", "f1_macro", "f1_fake"}
Y_TRUE = [0, 1, 1, 0, 1, 0]
Y_PRED = [0, 1, 0, 0, 1, 1]


def test_contract_keys_present():
    assert KEYS <= set(compute(Y_TRUE, Y_PRED))


def test_known_example():
    m = compute(Y_TRUE, Y_PRED)
    # TP=2, FP=1, FN=1, TN=2 -> every metric is 2/3
    assert m["accuracy"] == pytest.approx(0.6667, abs=1e-4)
    assert m["precision"] == pytest.approx(0.6667, abs=1e-4)
    assert m["recall"] == pytest.approx(0.6667, abs=1e-4)
    assert m["f1_fake"] == pytest.approx(0.6667, abs=1e-4)
    assert m["f1_macro"] == pytest.approx(0.6667, abs=1e-4)
    assert m["confusion_matrix"] == [[2, 1], [1, 2]]


def test_perfect_and_all_wrong():
    perfect = compute(Y_TRUE, Y_TRUE)
    assert all(perfect[k] == 1.0 for k in KEYS)
    wrong = compute([0, 1, 0, 1], [1, 0, 1, 0])
    assert all(wrong[k] == 0.0 for k in KEYS)


def test_imbalanced_fake_metrics():
    # model predicts everything "fact": fake recall/precision 0, accuracy 0.75
    m = compute([0, 0, 0, 1], [0, 0, 0, 0])
    assert m["accuracy"] == 0.75
    assert m["precision"] == 0.0 and m["recall"] == 0.0 and m["f1_fake"] == 0.0


def test_single_class_no_crash_and_2x2_matrix():
    m = compute([1, 1, 1], [1, 1, 1])
    assert m["confusion_matrix"] == [[0, 0], [0, 3]]
    assert m["accuracy"] == 1.0
    assert not any(np.isnan(m[k]) for k in KEYS)


def test_accepts_numpy_and_string_digits():
    a = compute(np.array(Y_TRUE), np.array(Y_PRED))
    b = compute([str(x) for x in Y_TRUE], [str(x) for x in Y_PRED])
    assert a == compute(Y_TRUE, Y_PRED) == b


def test_writes_json_and_creates_parent_dirs(tmp_path):
    out = tmp_path / "nested" / "Metrics_Test.json"
    m = compute(Y_TRUE, Y_PRED, output_path=out)
    assert json.loads(out.read_text(encoding="utf-8")) == m


@pytest.mark.parametrize(
    "y_true, y_pred",
    [
        ([], []),
        ([0, 1], [0]),
        ([0, 2], [0, 1]),
        ([0, 1], [0, -1]),
        (["a", "b"], [0, 1]),
        ([[0, 1]], [[0, 1]]),
    ],
)
def test_invalid_input_raises(y_true, y_pred):
    with pytest.raises(ValueError):
        compute(y_true, y_pred)
