"""Sliding-window helpers shared by training (Fine_Tune), evaluation and the inference API.
Light on purpose: numpy only, so the API does not import datasets/Trainer.
"""
import numpy as np

MAX_LENGTH = 416
STRIDE = 64        # token overlap between consecutive windows
MAX_CHUNKS = 8     # cap windows per doc (bounds compute on very long docs; max doc ~9k tokens)


def make_chunks(tokenizer, texts, labels):
    """Split each text into overlapping windows. Returns (features dict, doc_ids list)."""
    enc = tokenizer(
        list(texts),
        truncation=True,
        max_length=MAX_LENGTH,
        stride=STRIDE,
        return_overflowing_tokens=True,
    )
    feats = {"input_ids": [], "attention_mask": [], "labels": []}
    doc_ids, seen = [], {}
    for i, doc in enumerate(enc["overflow_to_sample_mapping"]):
        if seen.get(doc, 0) >= MAX_CHUNKS:
            continue
        seen[doc] = seen.get(doc, 0) + 1
        feats["input_ids"].append(enc["input_ids"][i])
        feats["attention_mask"].append(enc["attention_mask"][i])
        feats["labels"].append(int(labels[doc]))
        doc_ids.append(doc)
    return feats, doc_ids


def doc_probs(logits, doc_ids, n_docs):
    """Mean of softmax probabilities over each doc's windows -> (n_docs, n_classes)."""
    logits = np.asarray(logits, dtype=np.float64)
    probs = np.exp(logits - logits.max(axis=-1, keepdims=True))
    probs /= probs.sum(axis=-1, keepdims=True)
    doc_ids = np.asarray(doc_ids)
    out = np.zeros((n_docs, probs.shape[1]))
    np.add.at(out, doc_ids, probs)
    return out / np.bincount(doc_ids, minlength=n_docs)[:, None]


def aggregate_by_doc(logits, doc_ids, n_docs):
    """Predicted label per doc from the averaged window probabilities."""
    return doc_probs(logits, doc_ids, n_docs).argmax(axis=-1)
