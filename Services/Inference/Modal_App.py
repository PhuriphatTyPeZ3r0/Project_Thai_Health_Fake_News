"""Modal Serverless Deployment (P5: Phuriphat Fullstack, deploy-ready by P3)
Serves Services/Inference/App.py (FastAPI) with the fine-tuned WangchanBERTa on a Modal T4 GPU.

Deploy (from the repo root, after `pip install modal` and `modal setup`):
    modal deploy Services/Inference/Modal_App.py
The printed URL (https://<workspace>--thai-health-fakenews-inference-fastapi-app.modal.run) goes into
the Next.js env as the inference base URL. Check it with: GET <url>/health  (503 = model not loaded).

Everything the service needs is baked into the image at build time, so a cold start only loads the model
from local disk:
  * the fine-tuned model, pinned to the exact Hub revision below (no surprises if the repo is overwritten)
  * the baseline TF-IDF+LogReg, trained from Data/Processed/train.csv inside the image (no binary shipped,
    scikit-learn version always matches)
"""

from pathlib import Path

import modal

# --- config -----------------------------------------------------------------------------------------
MODEL_ID = "Kitkhachon/wcb-limesoda-fakenews"
# Pin the evaluated model. Update this after re-training/pushing, then re-run the evaluation.
MODEL_REVISION = "9566917aec217d3ed01120d13c49d51b786387e3"
BASE_CHECKPOINT = "airesearch/wangchanberta-base-att-spm-uncased"

REMOTE_ROOT = "/root"
HF_HOME = "/root/hf_cache"
BASELINE_PATH = "/root/Models/baseline_model.joblib"

ROOT = Path(__file__).resolve().parents[2] if modal.is_local() else Path(REMOTE_ROOT)

app = modal.App("thai-health-fakenews-inference")


def download_models():
    """Build step: fetch model files into the image (runs once at build, with network)."""
    from Src.Predict import _fetch

    _fetch(MODEL_ID, MODEL_REVISION, weights=True)
    _fetch(BASE_CHECKPOINT, None, weights=False)  # tokenizer fallback


def train_baseline():
    """Build step: train the TF-IDF+LogReg baseline from the repo's processed data."""
    from Src.Baseline import train_and_evaluate

    Path(BASELINE_PATH).parent.mkdir(parents=True, exist_ok=True)
    metrics, _ = train_and_evaluate(
        train_csv=f"{REMOTE_ROOT}/Data/Processed/train.csv",
        test_csv=f"{REMOTE_ROOT}/Data/Processed/test.csv",
        metrics_output="/tmp/metrics_baseline.json",
        model_output=BASELINE_PATH,
    )
    print("baseline test F1-macro:", metrics["f1_macro"])


image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        # versions match the ones the model was evaluated with
        "torch==2.14.1",
        "transformers==4.57.6",
        "tokenizers==0.22.2",
        "sentencepiece==0.2.2",
        "scikit-learn==1.9.0",
        "pythainlp==5.3.4",
        "joblib>=1.3.0",
        "numpy>=1.26.0",
        "pandas>=2.2.0",
        "huggingface_hub>=0.30.0",
        "fastapi>=0.115.0",
        "uvicorn>=0.30.0",
        "pydantic>=2.8.0",
    )
    .env(
        {
            "PYTHONPATH": REMOTE_ROOT,  # so `import Src...` / `import Services...` work
            "HF_HOME": HF_HOME,
            "WANGCHANBERTA_MODEL": MODEL_ID,
            "WANGCHANBERTA_REVISION": MODEL_REVISION,
            "BASELINE_MODEL_PATH": BASELINE_PATH,
            "TOKENIZERS_PARALLELISM": "false",
        }
    )
    .add_local_dir(ROOT / "Src", f"{REMOTE_ROOT}/Src", copy=True, ignore=["__pycache__", "*.pyc"])
    .add_local_dir(ROOT / "Data" / "Processed", f"{REMOTE_ROOT}/Data/Processed", copy=True)
    .run_function(download_models)
    .run_function(train_baseline)
    .env({"HF_HUB_OFFLINE": "1"})  # serve from the baked cache only; no network calls at runtime
    .add_local_dir(ROOT / "Services", f"{REMOTE_ROOT}/Services", ignore=["__pycache__", "*.pyc"])
)


@app.function(
    image=image,
    gpu="T4",
    scaledown_window=300,  # keep warm 5 min, then scale to zero
    timeout=600,
)
@modal.asgi_app()
def fastapi_app():
    """Wrap the FastAPI application for Modal serverless ASGI serving."""
    from Services.Inference.App import app as api_app

    return api_app
