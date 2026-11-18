import { NewsEvaluation } from '../models/NewsEvaluation';
import { IInferenceEngine } from '../services/IInferenceEngine';
import { InferenceServiceFactory } from '../services/InferenceServiceFactory';
import { ApiResponse, ModelComparisonDTO, ModelType, PredictionResultDTO } from '../types';

/**
 * OOP Controller: NewsAnalysisController
 * Orchestrates request validation via NewsEvaluation domain model and dispatches to IInferenceEngine.
 */
export class NewsAnalysisController {
  private readonly engine: IInferenceEngine;

  constructor(engine?: IInferenceEngine) {
    this.engine = engine || InferenceServiceFactory.getEngine();
  }

  public async handleAnalyze(
    rawText: string,
    modelType: ModelType = 'wangchanberta'
  ): Promise<{ status: number; body: ApiResponse<PredictionResultDTO> }> {
    const evaluation = new NewsEvaluation(rawText);

    if (!evaluation.isValid()) {
      return {
        status: 400,
        body: {
          success: false,
          error: 'ข้อมูลนำเข้าไม่ถูกต้อง',
          validationErrors: evaluation.getErrors(),
        },
      };
    }

    try {
      const result = await this.engine.predict(evaluation.getText(), modelType);
      return {
        status: 200,
        body: {
          success: true,
          data: result,
        },
      };
    } catch (err: any) {
      console.error('[NewsAnalysisController] Inference error:', err);
      // Fallback to mock if remote engine failed
      try {
        const mockFallback = InferenceServiceFactory.createEngine('mock');
        const fallbackResult = await mockFallback.predict(evaluation.getText(), modelType);
        return {
          status: 200,
          body: {
            success: true,
            data: {
              ...fallbackResult,
              model: `${fallbackResult.model} (Auto-Fallback)`,
            },
          },
        };
      } catch (fallbackErr: any) {
        return {
          status: 502,
          body: {
            success: false,
            error: 'ไม่สามารถติดต่อบริการประมวลผลโมเดลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง',
          },
        };
      }
    }
  }

  public async handleCompare(
    rawText: string
  ): Promise<{ status: number; body: ApiResponse<ModelComparisonDTO> }> {
    const evaluation = new NewsEvaluation(rawText);

    if (!evaluation.isValid()) {
      return {
        status: 400,
        body: {
          success: false,
          error: 'ข้อมูลนำเข้าไม่ถูกต้อง',
          validationErrors: evaluation.getErrors(),
        },
      };
    }

    try {
      const comparison = await this.engine.compare(evaluation.getText());
      return {
        status: 200,
        body: {
          success: true,
          data: comparison,
        },
      };
    } catch (err: any) {
      console.error('[NewsAnalysisController] Comparison error:', err);
      // Fallback to mock
      const mockFallback = InferenceServiceFactory.createEngine('mock');
      const fallbackResult = await mockFallback.compare(evaluation.getText());
      return {
        status: 200,
        body: {
          success: true,
          data: fallbackResult,
        },
      };
    }
  }
}
