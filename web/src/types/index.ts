/**
 * Shared Type Definitions & Data Transfer Objects (DTOs)
 */

export type ModelType = 'wangchanberta' | 'baseline' | 'both';

export type PredictionLabel = 'fake' | 'fact' | 'uncertain';

export interface ProbabilityDistribution {
  fact: number;
  fake: number;
}

export interface PredictionResultDTO {
  label: PredictionLabel;
  confidence: number;
  model: string;
  probabilities: ProbabilityDistribution;
  latency_ms?: number;
}

export interface ModelComparisonDTO {
  wangchanberta: PredictionResultDTO;
  baseline: PredictionResultDTO;
  agreement: boolean;
  latency_ms: number;
}

export interface AnalyzeRequestDTO {
  text: string;
  model_type?: ModelType;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: string[];
}
