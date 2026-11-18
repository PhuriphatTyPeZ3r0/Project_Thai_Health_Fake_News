"""Modal Serverless Deployment Configuration (P5: Phuriphat Fullstack)
Deploys the FastAPI NLP Inference Service on Modal (modal.com) serverless cloud.
Supports GPU acceleration (T4/A10G) and instant cold start.
"""

import modal

# Define Modal App
app = modal.App("thai-health-fakenews-inference")

# Define Container Image with PyTorch & Hugging Face Transformers
image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "fastapi[standard]>=0.115.0",
        "uvicorn>=0.30.0",
        "pydantic>=2.8.0",
        "torch>=2.2.0",
        "transformers>=4.40.0",
        "sentencepiece>=0.2.0",
        "pythainlp>=5.0.0",
        "scikit-learn>=1.4.0",
        "joblib>=1.3.0",
        "numpy>=1.26.0",
        "pandas>=2.2.0"
    )
)


@app.function(
    image=image,
    gpu="T4",               # Optional: omit or set to None for CPU serverless
    scaledown_window=300,   # Keep warm for 5 minutes
    secrets=[modal.Secret.from_name("huggingface-token", required=False)],
)
@modal.asgi_app()
def fastapi_app():
    """Wrap the FastAPI application for Modal serverless ASGI serving."""
    import sys
    from pathlib import Path
    
    # Add root to sys.path so src.* modules can be resolved
    root_dir = Path(__file__).resolve().parent.parent.parent
    if str(root_dir) not in sys.path:
        sys.path.insert(0, str(root_dir))

    from services.inference.app import app as api_app
    return api_app
