import { NewsEvaluation } from '../Models/News_Evaluation';
import { IInferenceEngine } from '../Services/I_Inference_Engine';
import { InferenceServiceFactory } from '../Services/Inference_Service_Factory';
import { ApiResponse, ModelComparisonDTO, ModelType, PredictionResultDTO } from '../Types/Index';

/**
 * OOP Controller: NewsAnalysisController
 * Orchestrates request validation via NewsEvaluation domain model and dispatches directly to IInferenceEngine.
 * Operates against live remote inference without automatic mock fallback.
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
      return {
        status: 502,
        body: {
          success: false,
          error: 'ไม่สามารถติดต่อบริการประมวลผลโมเดล Modal ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง หรือตรวจสอบสถานะเซิร์ฟเวอร์',
        },
      };
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
      return {
        status: 502,
        body: {
          success: false,
          error: 'ไม่สามารถติดต่อบริการประมวลผลโมเดล Modal ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง หรือตรวจสอบสถานะเซิร์ฟเวอร์',
        },
      };
    }
  }
}
