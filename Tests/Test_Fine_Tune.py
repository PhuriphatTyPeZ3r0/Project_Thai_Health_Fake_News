"""Offline checks for the long-text windowing in Src/Fine_Tune.py (no training, no network)."""
import numpy as np

from Src.Fine_Tune import MAX_CHUNKS, MAX_LENGTH, aggregate_by_doc, make_chunks


class FakeTok:
    """Emulates a fast tokenizer's overflow output: every text is N tokens, windows of MAX_LENGTH."""
    def __init__(self, lengths):
        self.lengths = lengths

    def __call__(self, texts, **kw):
        ids, mapping = [], []
        for doc, n in enumerate(self.lengths):
            for _ in range(max(1, -(-n // (MAX_LENGTH - 64)))):
                ids.append([5] * min(n, MAX_LENGTH)); mapping.append(doc)
        return {"input_ids": ids, "attention_mask": [[1] * len(x) for x in ids],
                "overflow_to_sample_mapping": mapping}


def test_short_doc_is_one_window_and_long_doc_is_capped():
    feats, doc_ids = make_chunks(FakeTok([100, 99999]), ["a", "b"], [0, 1])
    assert doc_ids.count(0) == 1
    assert doc_ids.count(1) == MAX_CHUNKS
    assert len(feats["labels"]) == len(doc_ids)
    assert set(feats["labels"][i] for i, d in enumerate(doc_ids) if d == 1) == {1}


def test_aggregate_averages_probabilities_per_doc():
    # doc0: windows lean fake (class 1); doc1: windows lean fact (class 0)
    logits = [[0, 3], [0, 3], [3, 0], [3, 0], [3, 0]]
    assert aggregate_by_doc(logits, [0, 0, 1, 1, 1], 2).tolist() == [1, 0]
    # one very confident window outweighs two weakly opposite ones
    assert aggregate_by_doc([[0, 9], [1, 0], [1, 0]], [0, 0, 0], 1).tolist() == [1]
