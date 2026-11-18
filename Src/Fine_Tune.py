"""WangchanBERTa Fine-Tuning Module (P3: Kitkhachon)
Task F1-F3:
- Load WangchanBERTa pre-trained model (airesearch/wangchanberta-base-att-spm-uncased)
- Tokenize and encode Thai health news datasets
- Train with Hugging Face Trainer (Colab GPU)
- Evaluate on test.csv using src.metrics.compute
- Output: results/metrics_wcb.json, push to Hugging Face Hub (<user>/wcb-limesoda-fakenews)
"""

import os
from pathlib import Path
import numpy as np
import pandas as pd
import torch
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    Trainer,
    TrainingArguments,
    DataCollatorWithPadding,
)
from datasets import Dataset

from Src.Metrics import compute


MODEL_CHECKPOINT = "airesearch/wangchanberta-base-att-spm-uncased"
OUTPUT_DIR = "Models/WangchanBerta_Finetuned"
MAX_LENGTH = 416


def compute_metrics_eval(eval_pred):
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=-1)
    res = compute(labels, preds)
    return {
        "accuracy": res["accuracy"],
        "f1_macro": res["f1_macro"],
        "f1_fake": res["f1_fake"],
        "precision": res["precision"],
        "recall": res["recall"],
    }


def train_model(
    train_path: str = "data/processed/train.csv",
    val_path: str = "data/processed/val.csv",
    test_path: str = "data/processed/test.csv",
    num_epochs: int = 3,
    batch_size: int = 16,
    learning_rate: float = 3e-5,
    metrics_output: str = "results/metrics_wcb.json",
):
    print(f"[WangchanBERTa Fine-tune] Loading dataset from {train_path}...")
    train_df = pd.read_csv(train_path)
    val_df = pd.read_csv(val_path)
    test_df = pd.read_csv(test_path)

    train_ds = Dataset.from_pandas(train_df[["text", "label"]])
    val_ds = Dataset.from_pandas(val_df[["text", "label"]])
    test_ds = Dataset.from_pandas(test_df[["text", "label"]])

    tokenizer = AutoTokenizer.from_pretrained(MODEL_CHECKPOINT)

    def preprocess_function(examples):
        return tokenizer(examples["text"], truncation=True, max_length=MAX_LENGTH)

    print("[WangchanBERTa Fine-tune] Tokenizing datasets...")
    tokenized_train = train_ds.map(preprocess_function, batched=True)
    tokenized_val = val_ds.map(preprocess_function, batched=True)
    tokenized_test = test_ds.map(preprocess_function, batched=True)

    model = AutoModelForSequenceClassification.from_pretrained(
        MODEL_CHECKPOINT,
        num_labels=2,
        id2label={0: "fact", 1: "fake"},
        label2id={"fact": 0, "fake": 1},
    )

    training_args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        learning_rate=learning_rate,
        per_device_train_batch_size=batch_size,
        per_device_eval_batch_size=batch_size,
        num_train_epochs=num_epochs,
        weight_decay=0.01,
        evaluation_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
        metric_for_best_model="f1_macro",
        greater_is_better=True,
        logging_dir="./logs",
        fp16=torch.cuda.is_available(),
        report_to="none",
    )

    data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_train,
        eval_dataset=tokenized_val,
        tokenizer=tokenizer,
        data_collator=data_collator,
        compute_metrics=compute_metrics_eval,
    )

    print("[WangchanBERTa Fine-tune] Starting training...")
    trainer.train()

    print("[WangchanBERTa Fine-tune] Evaluating on test set...")
    predictions = trainer.predict(tokenized_test)
    preds = np.argmax(predictions.predictions, axis=-1)

    metrics = compute(test_df["label"].tolist(), preds.tolist(), output_path=metrics_output)
    print(f"[WangchanBERTa Fine-tune] Test Results saved to {metrics_output}: {metrics}")

    trainer.save_model(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)
    print(f"[WangchanBERTa Fine-tune] Model saved to {OUTPUT_DIR}")
    return metrics


if __name__ == "__main__":
    train_model()
