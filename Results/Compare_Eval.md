# Baseline vs WangchanBERTa (test.csv, n=321)

| Metric | Baseline (TF-IDF+LogReg) | WangchanBERTa (fine-tuned) | Delta |
|---|---:|---:|---:|
| Accuracy | 0.8972 | 0.9128 | +0.0156 |
| Precision (fake) | 0.9212 | 0.9091 | -0.0121 |
| Recall (fake) | 0.8837 | 0.9302 | +0.0465 |
| F1-macro | 0.8969 | 0.9122 | +0.0153 |
| F1 (fake) | 0.9021 | 0.9195 | +0.0174 |

Per class (precision / recall / F1):

| class | Baseline | WangchanBERTa |
|---|---|---|
| fact | 0.8718 / 0.9128 / 0.8918 | 0.9172 / 0.8926 / 0.9048 |
| fake | 0.9212 / 0.8837 / 0.9021 | 0.9091 / 0.9302 / 0.9195 |

Confusion matrix [[fact->fact, fact->fake],[fake->fact, fake->fake]]: Baseline [[136, 13], [20, 152]] | WangchanBERTa [[133, 16], [12, 160]]

## Is the difference real? (paired on the same 321 documents)
| | WangchanBERTa correct | WangchanBERTa wrong |
|---|---:|---:|
| **Baseline correct** | 279 | 9 |
| **Baseline wrong** | 14 | 19 |

- McNemar exact test on discordant pairs (9 vs 14): p = 0.405
- Bootstrap 95% CI of F1-macro difference (WCB - Baseline): [-0.0154, +0.0436]
- Reading: the gap is NOT statistically significant at 0.05; do not claim one model is better.
