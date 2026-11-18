"""Compare Baseline (TF-IDF+LogReg) vs fine-tuned WangchanBERTa on the SAME test.csv using real predictions.
Needs: Results/Metrics_Baseline.json, Models/baseline_model.joblib, Results/Metrics_Wcb.json, Results/Preds_Wcb.csv
    python -m Src.Compare_Eval  ->  Results/Compare_Eval.md, Results/Compare_Eval.png
"""
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]  # repo root, so `python Src/X.py` works from any cwd
sys.path.insert(0, str(ROOT))
import json
from math import comb

import joblib
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

KEYS = [("accuracy", "Accuracy"), ("precision", "Precision (fake)"), ("recall", "Recall (fake)"),
        ("f1_macro", "F1-macro"), ("f1_fake", "F1 (fake)")]


def mcnemar_exact(b: int, c: int) -> float:
    """Two-sided exact binomial p-value on the discordant pairs (b, c)."""
    n = b + c
    if n == 0:
        return 1.0
    k = min(b, c)
    return min(1.0, 2 * sum(comb(n, i) for i in range(k + 1)) / 2 ** n)


def main():
    os.chdir(ROOT)  # defaults like Data/Processed/test.csv are relative to the repo root
    base = json.load(open("Results/Metrics_Baseline.json", encoding="utf-8"))
    wcb = json.load(open("Results/Metrics_Wcb.json", encoding="utf-8"))
    test = pd.read_csv("Data/Processed/test.csv")
    y = test["label"].to_numpy()
    p_base = joblib.load("Models/baseline_model.joblib").predict(test["text"].tolist())
    pw = pd.read_csv("Results/Preds_Wcb.csv")
    assert (pw["label"].to_numpy() == y).all(), "prediction rows do not line up with test.csv"
    p_wcb = pw["pred"].to_numpy()

    ok_b, ok_w = p_base == y, p_wcb == y
    both, only_b, only_w, neither = (ok_b & ok_w).sum(), (ok_b & ~ok_w).sum(), (~ok_b & ok_w).sum(), (~ok_b & ~ok_w).sum()
    pval = mcnemar_exact(int(only_b), int(only_w))

    # bootstrap 95% CI of the F1-macro difference (paired, resample documents)
    from sklearn.metrics import f1_score
    rng, d = np.random.default_rng(42), []
    for _ in range(2000):
        i = rng.integers(0, len(y), len(y))
        d.append(f1_score(y[i], p_wcb[i], average="macro") - f1_score(y[i], p_base[i], average="macro"))
    lo, hi = np.percentile(d, [2.5, 97.5])

    rows = "\n".join(f"| {n} | {base[k]:.4f} | {wcb[k]:.4f} | {wcb[k]-base[k]:+.4f} |" for k, n in KEYS)
    pc = ""
    for c in ("fact", "fake"):
        b_, w_ = base["classification_report"][c], wcb["classification_report"][c]
        pc += f"| {c} | {b_['precision']:.4f} / {b_['recall']:.4f} / {b_['f1-score']:.4f} | {w_['precision']:.4f} / {w_['recall']:.4f} / {w_['f1-score']:.4f} |\n"
    md = f"""# Baseline vs WangchanBERTa (test.csv, n={len(y)})

| Metric | Baseline (TF-IDF+LogReg) | WangchanBERTa (fine-tuned) | Delta |
|---|---:|---:|---:|
{rows}

Per class (precision / recall / F1):

| class | Baseline | WangchanBERTa |
|---|---|---|
{pc}
Confusion matrix [[fact->fact, fact->fake],[fake->fact, fake->fake]]: Baseline {base['confusion_matrix']} | WangchanBERTa {wcb['confusion_matrix']}

## Is the difference real? (paired on the same {len(y)} documents)
| | WangchanBERTa correct | WangchanBERTa wrong |
|---|---:|---:|
| **Baseline correct** | {both} | {only_b} |
| **Baseline wrong** | {only_w} | {neither} |

- McNemar exact test on discordant pairs ({only_b} vs {only_w}): p = {pval:.3f}
- Bootstrap 95% CI of F1-macro difference (WCB - Baseline): [{lo:+.4f}, {hi:+.4f}]
- Reading: {'the gap is NOT statistically significant at 0.05; do not claim one model is better' if pval >= 0.05 else 'the gap is statistically significant at 0.05'}.
"""
    open("Results/Compare_Eval.md", "w", encoding="utf-8").write(md)

    fig, ax = plt.subplots(1, 3, figsize=(17, 5))
    x, w = np.arange(len(KEYS)), 0.38
    for off, (name, m, col) in zip((-w / 2, w / 2), (("Baseline", base, "#9AA5B1"), ("WangchanBERTa", wcb, "#4C78A8"))):
        b = ax[0].bar(x + off, [m[k] for k, _ in KEYS], w, label=name, color=col); ax[0].bar_label(b, fmt="%.3f", fontsize=7, padding=2)
    ax[0].set_xticks(x, [n.replace(" (", "\n(") for _, n in KEYS], fontsize=8); ax[0].set_ylim(0.8, 0.97); ax[0].legend(loc="upper left", ncol=2, frameon=False)
    ax[0].set_title("Test metrics (y-axis starts at 0.80)")
    for a, (t, m) in zip(ax[1:], (("Baseline", base), ("WangchanBERTa", wcb))):
        cm = np.array(m["confusion_matrix"]); a.imshow(cm, cmap="Blues")
        for i in range(2):
            for j in range(2):
                a.text(j, i, f"{cm[i,j]}\n({cm[i,j]/cm[i].sum():.1%})", ha="center", va="center", color="white" if cm[i, j] > cm.max() / 2 else "black")
        a.set_xticks([0, 1], ["fact", "fake"]); a.set_yticks([0, 1], ["fact", "fake"]); a.set_xlabel("Predicted"); a.set_ylabel("True"); a.set_title(t)
    for a in ax[:1]:
        a.spines[["top", "right"]].set_visible(False)
    fig.suptitle(f"Baseline vs WangchanBERTa - McNemar p = {pval:.3f}", fontweight="bold"); fig.tight_layout(); fig.savefig("Results/Compare_Eval.png", dpi=150)
    print(md)


if __name__ == "__main__":
    main()
