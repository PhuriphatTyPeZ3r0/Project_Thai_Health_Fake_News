"""P3 F1 check: GPU + load WangchanBERTa tokenizer/model + one forward pass.
Usage (repo root): python -m Src.Check_Model
Exit code 0 = OK, 1 = failed.
"""
import sys
from pathlib import Path

MODEL = "airesearch/wangchanberta-base-att-spm-uncased"
SAMPLE = "วัคซีนทำให้เป็นหมัน"


def download() -> str:
    """Fetch files BEFORE importing torch: on some Windows setups a network error with
    torch loaded kills the process silently (access violation in getaddrinfo)."""
    from huggingface_hub import snapshot_download

    for attempt in range(1, 4):
        try:
            path = snapshot_download(MODEL, allow_patterns=["*.json", "*.model", "*.safetensors", "*.txt"])
            if not (list(Path(path).glob("*.safetensors")) and list(Path(path).glob("*.model"))):
                raise OSError("incomplete download (weights/tokenizer missing)")
            return path
        except Exception as e:
            print(f"download attempt {attempt}/3 failed: {type(e).__name__}")
    raise RuntimeError("cannot reach huggingface.co; check network/VPN/proxy, or run on Colab")


def main() -> int:
    path = download()
    import torch
    from transformers import AutoModel, AutoTokenizer

    print(f"torch {torch.__version__} | cuda available: {torch.cuda.is_available()}")
    if torch.cuda.is_available():
        print("GPU:", torch.cuda.get_device_name(0))
    tok = AutoTokenizer.from_pretrained(path)
    model = AutoModel.from_pretrained(path).eval()
    enc = tok(SAMPLE, return_tensors="pt", truncation=True, max_length=416)
    print("tokens:", tok.convert_ids_to_tokens(enc["input_ids"][0]))
    with torch.no_grad():
        out = model(**enc)
    shape = tuple(out.last_hidden_state.shape)
    assert shape[-1] == model.config.hidden_size, shape
    print(f"OK: hidden state {shape}, params {sum(p.numel() for p in model.parameters()):,}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:  # report any load failure as a clean non-zero exit
        print(f"FAILED: {type(e).__name__}: {e}")
        sys.exit(1)
