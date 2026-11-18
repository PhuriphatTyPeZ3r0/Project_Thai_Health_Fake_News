import { NextResponse } from 'next/server';
import { InferenceServiceFactory } from '@/services/InferenceServiceFactory';

export async function GET() {
  const engine = InferenceServiceFactory.getEngine();
  const remoteHealthy = await engine.checkHealth();

  return NextResponse.json({
    status: 'ok',
    app: 'thai-health-fakenews-web',
    framework: 'Next.js 14 App Router (MVC + OOP)',
    remote_inference_healthy: remoteHealthy,
    timestamp: new Date().toISOString(),
  });
}
