import { IInferenceEngine } from './I_Inference_Engine';
import { ModelComparisonDTO, ModelType, PredictionResultDTO } from '../Types/Index';

/**
 * Concrete OOP Service: ModalFastApiInferenceEngine
 * Direct client for the live Python FastAPI NLP inference service deployed on Modal Serverless.
 * Communicates with WangchanBERTa fine-tuned model and TF-IDF Baseline without mock fallback.
 */
export class ModalFastApiInferenceEngine implements IInferenceEngine {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(
    baseUrl?: string,
    timeoutMs: number = 25000
  ) {
    this.baseUrl = (
      baseUrl ||
      process.env.MODAL_API_URL ||
      process.env.NEXT_PUBLIC_MODAL_API_URL ||
      'https://kitkhachon-xx--thai-health-fakenews-inference-fastapi-app.us-east.modal.run'
    ).replace(/\/+$/, '');
    this.timeoutMs = timeoutMs;
  }

  public async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  public async predict(text: string, modelType: ModelType = 'wangchanberta'): Promise<PredictionResultDTO> {
    const res = await fetch(`${this.baseUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, model_type: modelType }),
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      throw new Error(`Modal Inference API error (${res.status}): ${errorText || res.statusText}`);
    }

    const payload = await res.json();
    return {
      ...payload.data,
      latency_ms: payload.latency_ms,
    };
  }

  public async compare(text: string): Promise<ModelComparisonDTO> {
    const res = await fetch(`${this.baseUrl}/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      throw new Error(`Modal Inference comparison error (${res.status}): ${errorText || res.statusText}`);
    }

    return await res.json();
  }
}
