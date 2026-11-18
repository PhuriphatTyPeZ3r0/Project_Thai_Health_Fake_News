import { IInferenceEngine } from './I_Inference_Engine';
import { ModelComparisonDTO, ModelType, PredictionResultDTO } from '../Types/Index';
import { MockInferenceEngine } from './Mock_Inference_Engine';

/**
 * Concrete OOP Service: ModalFastApiInferenceEngine
 * Communicates with the remote Python FastAPI NLP engine running on Modal or Localhost.
 * Features Smart Fallback: automatically falls back to MockInferenceEngine if the backend is unreachable.
 */
export class ModalFastApiInferenceEngine implements IInferenceEngine {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly fallbackEngine: IInferenceEngine;

  constructor(baseUrl?: string, timeoutMs: number = 8000, fallbackEngine?: IInferenceEngine) {
    this.baseUrl = baseUrl || process.env.MODAL_API_URL || 'http://localhost:8000';
    this.timeoutMs = timeoutMs;
    this.fallbackEngine = fallbackEngine || new MockInferenceEngine();
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
    try {
      const res = await fetch(`${this.baseUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, model_type: modelType }),
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      if (!res.ok) {
        throw new Error(`Inference engine HTTP error (${res.status})`);
      }

      const payload = await res.json();
      return {
        ...payload.data,
        latency_ms: payload.latency_ms,
      };
    } catch (err) {
      console.warn(`[InferenceEngine] Remote server ${this.baseUrl} unreachable, falling back to mock:`, err);
      return this.fallbackEngine.predict(text, modelType);
    }
  }

  public async compare(text: string): Promise<ModelComparisonDTO> {
    try {
      const res = await fetch(`${this.baseUrl}/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      if (!res.ok) {
        throw new Error(`Inference comparison HTTP error (${res.status})`);
      }

      return await res.json();
    } catch (err) {
      console.warn(`[InferenceEngine] Remote server ${this.baseUrl} unreachable, falling back to mock:`, err);
      return this.fallbackEngine.compare(text);
    }
  }
}
