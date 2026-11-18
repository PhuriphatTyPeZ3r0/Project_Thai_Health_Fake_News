import { IInferenceEngine } from './I_Inference_Engine';
import { ModelComparisonDTO, ModelType, PredictionResultDTO } from '../Types/Index';

/**
 * Concrete OOP Service: ModalFastApiInferenceEngine
 * Communicates with the remote Python FastAPI NLP engine running on Modal.
 */
export class ModalFastApiInferenceEngine implements IInferenceEngine {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(baseUrl?: string, timeoutMs: number = 8000) {
    this.baseUrl = baseUrl || process.env.MODAL_API_URL || 'http://localhost:8000';
    this.timeoutMs = timeoutMs;
  }

  public async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
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
      const errorText = await res.text();
      throw new Error(`Inference engine HTTP error (${res.status}): ${errorText}`);
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
      const errorText = await res.text();
      throw new Error(`Inference comparison HTTP error (${res.status}): ${errorText}`);
    }

    return await res.json();
  }
}
