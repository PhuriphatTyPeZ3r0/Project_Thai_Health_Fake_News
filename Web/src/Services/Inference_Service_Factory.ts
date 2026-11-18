import { IInferenceEngine } from './I_Inference_Engine';
import { ModalFastApiInferenceEngine } from './Modal_Fast_Api_Inference_Engine';
import { MockInferenceEngine } from './Mock_Inference_Engine';

/**
 * Service Factory Pattern: InferenceServiceFactory
 * Instantiates the appropriate inference service based on environment and availability.
 */
export class InferenceServiceFactory {
  private static instance: IInferenceEngine | null = null;

  public static getEngine(): IInferenceEngine {
    if (!this.instance) {
      const modalUrl = process.env.MODAL_API_URL || process.env.NEXT_PUBLIC_MODAL_API_URL || 'http://localhost:8000';
      this.instance = new ModalFastApiInferenceEngine(modalUrl);
    }
    return this.instance;
  }

  public static createEngine(type: 'modal' | 'mock', url?: string): IInferenceEngine {
    if (type === 'modal') {
      return new ModalFastApiInferenceEngine(url);
    }
    return new MockInferenceEngine();
  }
}
