import { IInferenceEngine } from './I_Inference_Engine';
import { ModelComparisonDTO, ModelType, PredictionResultDTO } from '../Types/Index';

/**
 * Concrete OOP Service: MockInferenceEngine
 * In-memory fallback and stub engine for local development and test scenarios.
 */
export class MockInferenceEngine implements IInferenceEngine {
  private readonly fakeKeywords = [
    'หายขาด',
    'สลายไขมัน',
    'สลายเบาหวาน',
    '100%',
    '99.99%',
    'มะนาวโซดา',
    'กระเทียมสด',
    'กระเทียมดิบ',
    'สูตรลับ',
    'สูตรเด็ด',
    'ห้ามกินเด็ดขาด',
    'สารหนู',
    'มหัศจรรย์',
    'ไมโครชิป',
    'ฝังชิป',
    'สารแม่เหล็ก',
    'ไม่ต้องฟอกไต',
    'ตายคาที่',
    'ควอนตัม',
    'สารพัดโรค',
    'กดแชร์ช่วยชีวิต',
  ];

  public async checkHealth(): Promise<boolean> {
    return true;
  }

  public async predict(text: string, modelType: ModelType = 'wangchanberta'): Promise<PredictionResultDTO> {
    const isFake = this.fakeKeywords.some((kw) => text.includes(kw));
    const confidence = isFake ? 0.94 : 0.88;
    const label = isFake ? 'fake' : 'fact';

    return {
      label,
      confidence,
      model: modelType === 'baseline' ? 'baseline_tfidf_mock' : 'wangchanberta_mock',
      probabilities: {
        fact: Number((label === 'fact' ? confidence : 1 - confidence).toFixed(4)),
        fake: Number((label === 'fake' ? confidence : 1 - confidence).toFixed(4)),
      },
      latency_ms: modelType === 'baseline' ? 12 : 65,
    };
  }

  public async compare(text: string): Promise<ModelComparisonDTO> {
    const isFake = this.fakeKeywords.some((kw) => text.includes(kw));
    
    // Baseline slightly less confident or slightly prone to false positive
    const wcbLabel = isFake ? 'fake' : 'fact';
    const baseLabel = isFake ? 'fake' : text.includes('สมุนไพร') ? 'fake' : 'fact';

    return {
      wangchanberta: {
        label: wcbLabel,
        confidence: isFake ? 0.945 : 0.892,
        model: 'wangchanberta_finetuned (Mock)',
        probabilities: {
          fact: isFake ? 0.055 : 0.892,
          fake: isFake ? 0.945 : 0.108,
        },
        latency_ms: 68,
      },
      baseline: {
        label: baseLabel,
        confidence: isFake ? 0.781 : 0.724,
        model: 'tfidf_logreg_baseline (Mock)',
        probabilities: {
          fact: baseLabel === 'fact' ? 0.724 : 0.276,
          fake: baseLabel === 'fake' ? 0.781 : 0.219,
        },
        latency_ms: 14,
      },
      agreement: wcbLabel === baseLabel,
      latency_ms: 82,
    };
  }
}
