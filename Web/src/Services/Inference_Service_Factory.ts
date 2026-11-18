import { IInferenceEngine } from './I_Inference_Engine';
import { ModalFastApiInferenceEngine } from './Modal_Fast_Api_Inference_Engine';
import { MockInferenceEngine } from './Mock_Inference_Engine';

/**
 * Service Factory Pattern: InferenceServiceFactory
 * Instantiates the production ModalFastApiInferenceEngine or testing MockInferenceEngine.
 */
export class InferenceServiceFactory {
  private static instance: IInferenceEngine | null = null;

  public static getEngine(): IInferenceEngine {
    if (!this.instance) {
      const modalUrl =
        process.env.MODAL_API_URL ||
        process.env.NEXT_PUBLIC_MODAL_API_URL ||
        'https://kitkhachon-xx--thai-health-fakenews-inference-fastapi-app.us-east.modal.run';
      this.instance = new ModalFastApiInferenceEngine(modalUrl);
    }
    return this.instance;
  }

  public static createEngine(type: 'modal' | 'mock', url?: string): IInferenceEngine {
    if (type === 'modal') {
      return new ModalFastApiInferenceEngine(url);
    }
    // Reserved for offline automated testing (Verify_System_Cases)
    return new MockInferenceEngine();
  }
}
