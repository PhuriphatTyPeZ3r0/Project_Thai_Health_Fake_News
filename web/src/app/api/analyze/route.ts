import { NextRequest, NextResponse } from 'next/server';
import { NewsAnalysisController } from '@/controllers/NewsAnalysisController';
import { ModelType } from '@/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const text = json.text ?? '';
    const modelType = (json.model_type as ModelType) ?? 'both';

    const controller = new NewsAnalysisController();

    if (modelType === 'both') {
      const response = await controller.handleCompare(text);
      return NextResponse.json(response.body, { status: response.status });
    } else {
      const response = await controller.handleAnalyze(text, modelType);
      return NextResponse.json(response.body, { status: response.status });
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'เกิดข้อผิดพลาดภายในระบบ',
      },
      { status: 500 }
    );
  }
}
