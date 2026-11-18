# P3 Plan (Kitkhachon-xx) — branch `feat/6752300216-finetune-wcb`

| Issue | Task | Done when |
|---|---|---|
| #4 F1 | Colab T4/V100, load WangchanBERTa tokenizer+model, `Src/Fine_Tune.py` | notebook cell 4 runs |
| #9 F2 | Train 3 ep, LR 3e-5, bs 16, max_len 416; best-F1-macro ckpt to Drive | ckpt in `/content/drive/MyDrive/wcb_ckpt` |
| #12 F3 | Eval on Test.csv -> `Results/Metrics_Wcb.json`; push `Kitkhachon/wcb-limesoda-fakenews`; send Model ID to P5 | metrics file committed, Hub repo public |

Blocked on: P1 `Data/Processed/{Train,Val,Test}.csv` (#2, #7, PR #17). Needs `Src/Metrics.py` (P2, present).
Run: open `Notebooks/P3_Finetune.ipynb` in Colab.
