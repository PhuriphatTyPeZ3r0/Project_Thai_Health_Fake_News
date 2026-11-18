"""Evaluation Metrics Module
Contract specified in mini_project_plan.pdf:
compute(y_true, y_pred) -> dict
Returns: accuracy, precision, recall, f1_macro, f1_fake
Saves to results/metrics_<model>.json
"""

import json
from pathlib import Path
from typing import Dict, Any, Sequence, Union
import numpy as np
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
)


def compute(
    y_true: Sequence[Union[int, str]],
    y_pred: Sequence[Union[int, str]],
    output_path: Union[str, Path, None] = None,
) -> Dict[str, Any]:
    """Calculate standard evaluation metrics for Fake-News Detection.

    Labels:
        0 = fact
        1 = fake

    Args:
        y_true: Ground truth binary labels (0 or 1)
        y_pred: Predicted binary labels (0 or 1)
        output_path: Optional JSON path to persist metrics

    Returns:
        dict containing accuracy, precision, recall, f1_macro, f1_fake, confusion_matrix
    """
    y_true_arr = np.array(y_true, dtype=int)
    y_pred_arr = np.array(y_pred, dtype=int)

    acc = float(accuracy_score(y_true_arr, y_pred_arr))
    prec = float(precision_score(y_true_arr, y_pred_arr, average="binary", pos_label=1, zero_division=0))
    rec = float(recall_score(y_true_arr, y_pred_arr, average="binary", pos_label=1, zero_division=0))
    f1_macro = float(f1_score(y_true_arr, y_pred_arr, average="macro", zero_division=0))
    f1_fake = float(f1_score(y_true_arr, y_pred_arr, average="binary", pos_label=1, zero_division=0))
    cm = confusion_matrix(y_true_arr, y_pred_arr).tolist()

    report = classification_report(
        y_true_arr,
        y_pred_arr,
        target_names=["fact", "fake"],
        output_dict=True,
        zero_division=0,
    )

    metrics = {
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_macro": round(f1_macro, 4),
        "f1_fake": round(f1_fake, 4),
        "confusion_matrix": cm,
        "classification_report": report,
    }

    if output_path:
        out_p = Path(output_path)
        out_p.parent.mkdir(parents=True, exist_ok=True)
        with open(out_p, "w", encoding="utf-8") as f:
            json.dump(metrics, f, indent=2, ensure_ascii=False)

    return metrics


if __name__ == "__main__":
    # Self-test
    y_t = [0, 1, 1, 0, 1, 0]
    y_p = [0, 1, 0, 0, 1, 1]
    res = compute(y_t, y_p)
    print("Metrics test:", json.dumps(res, indent=2))
