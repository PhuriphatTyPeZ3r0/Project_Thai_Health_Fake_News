"""Evaluate a fine-tuned WangchanBERTa from the Hugging Face Hub (or a local dir) on test.csv.
Same sliding-window + per-document averaging as Src/Fine_Tune.py, so numbers are comparable.

    python -m Src.Evaluate --model-id Kitkhachon/wcb-limesoda-fakenews --output Results/Metrics_Wcb.json
"""
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]  # repo root, so `python Src/X.py` works from any cwd
sys.path.insert(0, str(ROOT))
import argparse
import json
import sys


def download(model_id: str) -> str:
    # fetch before importing torch (see Check_Model.py: network errors can kill torch processes on Windows)
    import os
    if os.path.isdir(model_id):
        return model_id
    from huggingface_hub import snapshot_download

    for attempt in range(1, 4):
        try:
            return snapshot_download(model_id)
        except Exception as e:
            print(f"download attempt {attempt}/3 failed: {type(e).__name__}")
    raise RuntimeError(f"cannot download {model_id} from huggingface.co")


def main() -> int:
    os.chdir(ROOT)  # defaults like Data/Processed/test.csv are relative to the repo root
    ap = argparse.ArgumentParser()
    ap.add_argument("--model-id", default="Kitkhachon/wcb-limesoda-fakenews")
    ap.add_argument("--test-path", default="Data/Processed/test.csv")
    ap.add_argument("--output", default="Results/Metrics_Wcb.json")
    ap.add_argument("--preds-output", default="Results/Preds_Wcb.csv")
    ap.add_argument("--batch-size", type=int, default=16)
    a = ap.parse_args()

    path = download(a.model_id)
    import numpy as np
    import pandas as pd
    import torch
    from transformers import AutoModelForSequenceClassification, AutoTokenizer, DataCollatorWithPadding

    from Src.Fine_Tune import MODEL_CHECKPOINT, aggregate_by_doc, make_chunks
    from Src.Metrics import compute

    dev = "cuda" if torch.cuda.is_available() else "cpu"
    try:
        tok = AutoTokenizer.from_pretrained(path)
    except Exception as e:  # tokenizer_config saved by a newer transformers may not load on an older one
        print(f"tokenizer in {a.model_id} not loadable here ({type(e).__name__}); using base {MODEL_CHECKPOINT} (fine-tuning does not change it)")
        tok = AutoTokenizer.from_pretrained(MODEL_CHECKPOINT)
    model = AutoModelForSequenceClassification.from_pretrained(path).to(dev).eval()
    print("labels:", model.config.id2label, "| device:", dev)

    df = pd.read_csv(a.test_path)
    feats, doc_ids = make_chunks(tok, df["text"].tolist(), df["label"].tolist())
    rows = [{k: feats[k][i] for k in ("input_ids", "attention_mask")} for i in range(len(doc_ids))]
    collate = DataCollatorWithPadding(tok)
    logits = []
    with torch.no_grad():
        for i in range(0, len(rows), a.batch_size):
            b = {k: v.to(dev) for k, v in collate(rows[i:i + a.batch_size]).items()}
            logits.append(model(**b).logits.float().cpu().numpy())
    preds = aggregate_by_doc(np.concatenate(logits), doc_ids, len(df))
    pd.DataFrame({"row": range(len(df)), "label": df["label"], "pred": preds}).to_csv(a.preds_output, index=False)
    m = compute(df["label"].tolist(), preds.tolist(), output_path=a.output)
    m["model_id"] = a.model_id
    json.dump(m, open(a.output, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print(f"{len(df)} docs / {len(doc_ids)} windows -> {a.output}")
    print({k: m[k] for k in ("accuracy", "precision", "recall", "f1_macro", "f1_fake")}, m["confusion_matrix"])
    return 0


if __name__ == "__main__":
    sys.exit(main())
