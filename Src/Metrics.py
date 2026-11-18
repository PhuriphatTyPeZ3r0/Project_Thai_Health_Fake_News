"""Evaluation Metrics Module (P2: B1)
Contract specified in mini_project_plan.pdf:
compute(y_true, y_pred) -> dict
Returns: accuracy, precision, recall, f1_macro, f1_fake
Saves to Results/Metrics_<model>.json
"""

import json
from pathlib import Path
from typing import Any, Dict, Sequence, Union

import numpy as np
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)

LABELS = [0, 1]  # 0 = fact, 1 = fake


def _to_label_array(values: Sequence[Union[int, str]], name: str) -> np.ndarray:
    try:
        arr = np.asarray(values).astype(int)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{name} must contain only labels 0 or 1") from exc
    if arr.ndim != 1:
        raise ValueError(f"{name} must be one-dimensional")
    if not np.isin(arr, LABELS).all():
        raise ValueError(f"{name} must contain only labels 0 or 1")
    return arr


def compute(
    y_true: Sequence[Union[int, str]],
    y_pred: Sequence[Union[int, str]],
    output_path: Union[str, Path, None] = None,
) -> Dict[str, Any]:
    """Calculate standard evaluation metrics for Fake-News Detection.

    Labels:
        0 = fact
        1 = fake  (positive class for precision / recall / f1_fake)

    Args:
        y_true: Ground truth binary labels (0 or 1)
        y_pred: Predicted binary labels (0 or 1)
        output_path: Optional JSON path to persist metrics

    Returns:
        dict containing accuracy, precision, recall, f1_macro, f1_fake,
        confusion_matrix (always 2x2, rows = true, cols = predicted)
        and classification_report.

    Raises:
        ValueError: on empty input, length mismatch or labels outside {0, 1}.
    """
    y_true_arr = _to_label_array(y_true, "y_true")
    y_pred_arr = _to_label_array(y_pred, "y_pred")
    if y_true_arr.size == 0:
        raise ValueError("y_true and y_pred must not be empty")
    if y_true_arr.shape != y_pred_arr.shape:
        raise ValueError(
            f"y_true and y_pred length mismatch: {y_true_arr.size} vs {y_pred_arr.size}"
        )

    binary = dict(labels=LABELS, average="binary", pos_label=1, zero_division=0)
    metrics = {
        "accuracy": round(float(accuracy_score(y_true_arr, y_pred_arr)), 4),
        "precision": round(float(precision_score(y_true_arr, y_pred_arr, **binary)), 4),
        "recall": round(float(recall_score(y_true_arr, y_pred_arr, **binary)), 4),
        "f1_macro": round(
            float(f1_score(y_true_arr, y_pred_arr, labels=LABELS, average="macro", zero_division=0)), 4
        ),
        "f1_fake": round(float(f1_score(y_true_arr, y_pred_arr, **binary)), 4),
        "confusion_matrix": confusion_matrix(y_true_arr, y_pred_arr, labels=LABELS).tolist(),
        "classification_report": classification_report(
            y_true_arr,
            y_pred_arr,
            labels=LABELS,
            target_names=["fact", "fake"],
            output_dict=True,
            zero_division=0,
        ),
    }

    if output_path:
        out_p = Path(output_path)
        out_p.parent.mkdir(parents=True, exist_ok=True)
        with open(out_p, "w", encoding="utf-8") as f:
            json.dump(metrics, f, indent=2, ensure_ascii=False)

    return metrics


if __name__ == "__main__":
    print(json.dumps(compute([0, 1, 1, 0, 1, 0], [0, 1, 0, 0, 1, 1]), indent=2))
