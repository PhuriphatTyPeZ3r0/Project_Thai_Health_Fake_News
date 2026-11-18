import { ModelComparisonDTO, ModelType, PredictionResultDTO } from '../Types/Index';

/**
 * OOP Interface: IInferenceEngine
 * Abstract contract for NLP Inference Services (Modal FastAPI or Mock fallback)
 */
export interface IInferenceEngine {
  predict(text: string, modelType?: ModelType): Promise<PredictionResultDTO>;
  compare(text: string): Promise<ModelComparisonDTO>;
  checkHealth(): Promise<boolean>;
}
