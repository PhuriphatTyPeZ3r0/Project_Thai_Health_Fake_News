"""Plot Results/Metrics_*.json: overall metrics, per-class precision/recall/F1, confusion matrix.
    python -m Src.Visualize --metrics Results/Metrics_Wcb.json --output Results/Metrics_Wcb.png
"""
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]  # repo root, so `python Src/X.py` works from any cwd
sys.path.insert(0, str(ROOT))
import argparse
import json

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

CLASSES = ["fact", "fake"]


def plot(m: dict, out: str, title: str) -> None:
    rep, cm = m["classification_report"], np.array(m["confusion_matrix"])
    fig, ax = plt.subplots(1, 3, figsize=(17, 5))
    fig.suptitle(title, fontsize=14, fontweight="bold")

    # 1) overall metrics
    names = ["accuracy", "precision", "recall", "f1_macro", "f1_fake"]
    vals = [m[k] for k in names]
    b = ax[0].bar(["Accuracy", "Precision\n(fake)", "Recall\n(fake)", "F1-macro", "F1\n(fake)"], vals, color="#4C78A8")
    ax[0].set_ylim(0, 1.08); ax[0].set_title("Overall")
    ax[0].bar_label(b, fmt="%.3f", padding=2)

    # 2) per-class precision / recall / f1
    x, w = np.arange(len(CLASSES)), 0.26
    for i, (k, c) in enumerate([("precision", "#4C78A8"), ("recall", "#F58518"), ("f1-score", "#54A24B")]):
        bars = ax[1].bar(x + (i - 1) * w, [rep[c_][k] for c_ in CLASSES], w, label=k.replace("-score", ""), color=c)
        ax[1].bar_label(bars, fmt="%.3f", padding=2, fontsize=8)
    ax[1].set_xticks(x, [f"{c}\n(n={int(rep[c]['support'])})" for c in CLASSES])
    ax[1].set_ylim(0, 1.2); ax[1].set_title("Per class"); ax[1].legend(loc="upper center", ncol=3, frameon=False)

    # 3) confusion matrix (counts + row-normalised %)
    im = ax[2].imshow(cm, cmap="Blues")
    for i in range(2):
        for j in range(2):
            ax[2].text(j, i, f"{cm[i, j]}\n({cm[i, j] / cm[i].sum():.1%})", ha="center", va="center",
                       color="white" if cm[i, j] > cm.max() / 2 else "black", fontsize=12)
    ax[2].set_xticks([0, 1], CLASSES); ax[2].set_yticks([0, 1], CLASSES)
    ax[2].set_xlabel("Predicted"); ax[2].set_ylabel("True"); ax[2].set_title("Confusion matrix (row % = recall)")
    fig.colorbar(im, ax=ax[2], fraction=0.046)

    for a in ax[:2]:
        a.spines[["top", "right"]].set_visible(False); a.grid(axis="y", alpha=0.3)
    fig.tight_layout()
    fig.savefig(out, dpi=150)


if __name__ == "__main__":
    os.chdir(ROOT)  # defaults like Data/Processed/test.csv are relative to the repo root
    p = argparse.ArgumentParser()
    p.add_argument("--metrics", default="Results/Metrics_Wcb.json")
    p.add_argument("--output", default="Results/Metrics_Wcb.png")
    p.add_argument("--title", default="WangchanBERTa fine-tuned (Kitkhachon/wcb-limesoda-fakenews) - test set")
    a = p.parse_args()
    plot(json.load(open(a.metrics, encoding="utf-8")), a.output, a.title)
    print("saved", a.output)
