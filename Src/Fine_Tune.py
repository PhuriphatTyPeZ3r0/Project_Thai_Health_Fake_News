"""WangchanBERTa Fine-Tuning Module (P3: Kitkhachon)
Task F1-F3:
- Load airesearch/wangchanberta-base-att-spm-uncased
- Fine-tune on Data/Processed/train.csv, select best epoch by F1-macro on val.csv
- Evaluate on test.csv via Src.Metrics.compute -> Results/Metrics_Wcb.json
- Optionally push to Hugging Face Hub (default Kitkhachon/wcb-limesoda-fakenews)

Run from repo root (Colab: %cd into the cloned repo):
    python -m Src.Fine_Tune --output-dir /content/drive/MyDrive/wcb_ckpt --push-to-hub
"""

import argparse
import numpy as np
import pandas as pd
import torch
from datasets import Dataset
from transformers import (
    AutoModelForSequenceClassification,
    AutoTokenizer,
    DataCollatorWithPadding,
    Trainer,
    TrainingArguments,
)

from Src.Metrics import compute

MODEL_CHECKPOINT = "airesearch/wangchanberta-base-att-spm-uncased"
HUB_MODEL_ID = "Kitkhachon/wcb-limesoda-fakenews"
MAX_LENGTH = 416


def compute_metrics_eval(eval_pred):
    logits, labels = eval_pred
    res = compute(labels, np.argmax(logits, axis=-1))
    return {k: res[k] for k in ("accuracy", "f1_macro", "f1_fake", "precision", "recall")}


def train_model(
    train_path="Data/Processed/train.csv",
    val_path="Data/Processed/val.csv",
    test_path="Data/Processed/test.csv",
    output_dir="Models/WangchanBerta_Finetuned",  # on Colab point this at Google Drive
    metrics_output="Results/Metrics_Wcb.json",
    num_epochs=3,
    batch_size=16,
    learning_rate=3e-5,
    push_to_hub=False,
    hub_model_id=HUB_MODEL_ID,
):
    train_df, val_df, test_df = (pd.read_csv(p) for p in (train_path, val_path, test_path))
    tokenizer = AutoTokenizer.from_pretrained(MODEL_CHECKPOINT)

    def tokenize(batch):
        return tokenizer(batch["text"], truncation=True, max_length=MAX_LENGTH)

    def to_ds(df):
        return Dataset.from_pandas(df[["text", "label"]]).map(tokenize, batched=True)

    tok_train, tok_val, tok_test = to_ds(train_df), to_ds(val_df), to_ds(test_df)

    model = AutoModelForSequenceClassification.from_pretrained(
        MODEL_CHECKPOINT,
        num_labels=2,
        id2label={0: "fact", 1: "fake"},
        label2id={"fact": 0, "fake": 1},
    )

    args = TrainingArguments(
        output_dir=output_dir,
        learning_rate=learning_rate,
        per_device_train_batch_size=batch_size,
        per_device_eval_batch_size=batch_size,
        num_train_epochs=num_epochs,
        weight_decay=0.01,
        eval_strategy="epoch",
        save_strategy="epoch",
        save_total_limit=2,
        load_best_model_at_end=True,
        metric_for_best_model="f1_macro",
        greater_is_better=True,
        fp16=torch.cuda.is_available(),
        report_to="none",
    )

    trainer = Trainer(
        model=model,
        args=args,
        train_dataset=tok_train,
        eval_dataset=tok_val,
        processing_class=tokenizer,
        data_collator=DataCollatorWithPadding(tokenizer=tokenizer),
        compute_metrics=compute_metrics_eval,
    )
    trainer.train()

    preds = np.argmax(trainer.predict(tok_test).predictions, axis=-1)
    metrics = compute(test_df["label"].tolist(), preds.tolist(), output_path=metrics_output)
    print(f"Test metrics saved to {metrics_output}: {metrics}")

    trainer.save_model(output_dir)  # best epoch (load_best_model_at_end)
    tokenizer.save_pretrained(output_dir)

    if push_to_hub:  # needs `huggingface-cli login` / HF_TOKEN first
        model.push_to_hub(hub_model_id)
        tokenizer.push_to_hub(hub_model_id)
        print(f"Pushed to https://huggingface.co/{hub_model_id}")
    return metrics


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--output-dir", default="Models/WangchanBerta_Finetuned")
    p.add_argument("--epochs", type=int, default=3)
    p.add_argument("--push-to-hub", action="store_true")
    p.add_argument("--hub-model-id", default=HUB_MODEL_ID)
    a = p.parse_args()
    train_model(output_dir=a.output_dir, num_epochs=a.epochs,
                push_to_hub=a.push_to_hub, hub_model_id=a.hub_model_id)
