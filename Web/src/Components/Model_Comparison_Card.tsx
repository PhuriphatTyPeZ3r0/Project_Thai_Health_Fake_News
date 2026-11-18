'use client';

import React from 'react';
import { ModelComparisonDTO, PredictionResultDTO } from '../Types/Index';
import { CheckCircle2, XCircle, Cpu, Zap, Check, AlertTriangle } from 'lucide-react';

interface ModelComparisonCardProps {
  comparison: ModelComparisonDTO;
}

const ModelVerdictCard: React.FC<{
  title: string;
  badge: string;
  icon: React.ReactNode;
  result: PredictionResultDTO;
  isPrimary?: boolean;
}> = ({ title, badge, icon, result, isPrimary }) => {
  const isFake = result.label === 'fake';
  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <div
      className={`rounded-xl border p-4 sm:p-5 transition-all ${
        isPrimary
          ? 'border-emerald-200/90 bg-white shadow-xs ring-1 ring-emerald-500/10'
          : 'border-zinc-200/90 bg-white/90 shadow-2xs'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg ${
              isPrimary ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-600'
            }`}
          >
            {icon}
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">{title}</h4>
            <p className="text-[10px] text-slate-400 font-mono">{result.model}</p>
          </div>
        </div>
        <span
          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold font-mono tracking-wide ${
            isPrimary
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/70'
              : 'bg-zinc-100 text-zinc-600 border border-zinc-200/60'
          }`}
        >
          {badge}
        </span>
      </div>

      {/* Primary Verdict Banner */}
      <div
        className={`flex items-center justify-between rounded-lg p-3 ${
          isFake ? 'bg-rose-50/70 border border-rose-100' : 'bg-emerald-50/60 border border-emerald-100'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {isFake ? (
            <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          )}
          <div>
            <span
              className={`text-sm sm:text-base font-extrabold tracking-tight ${
                isFake ? 'text-rose-700' : 'text-emerald-700'
              }`}
            >
              {isFake ? 'ข่าวปลอม (FAKE)' : 'ข่าวจริง (FACT)'}
            </span>
            <p className="text-[11px] text-slate-500 leading-tight">
              {isFake ? 'ตรวจพบลักษณะข้อมูลเท็จ/ชวนเชื่อ' : 'ข้อมูลน่าเชื่อถือสอดคล้องกับข้อเท็จจริง'}
            </p>
          </div>
        </div>
        <div className="text-right pl-2">
          <span className="text-lg sm:text-xl font-mono font-black text-slate-900">
            {confidencePercent}%
          </span>
          <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">ความเชื่อมั่น</p>
        </div>
      </div>

      {/* Probability Gauge */}
      <div className="space-y-1.5 mt-3.5">
        <div className="flex justify-between text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            จริง {(result.probabilities.fact * 100).toFixed(1)}%
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            เท็จ {(result.probabilities.fake * 100).toFixed(1)}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 flex">
          <div
            className="bg-emerald-500 transition-all duration-700 ease-out"
            style={{ width: `${result.probabilities.fact * 100}%` }}
          />
          <div
            className="bg-rose-500 transition-all duration-700 ease-out"
            style={{ width: `${result.probabilities.fake * 100}%` }}
          />
        </div>
      </div>

      {/* Latency Footer */}
      {result.latency_ms !== undefined && (
        <div className="mt-3 pt-2.5 border-t border-zinc-100 flex justify-between items-center text-[10px] text-slate-400 font-mono">
          <span>Processing Time</span>
          <span className="text-slate-600 font-medium">{result.latency_ms} ms</span>
        </div>
      )}
    </div>
  );
};

export const ModelComparisonCard: React.FC<ModelComparisonCardProps> = ({ comparison }) => {
  return (
    <div className="space-y-3.5">
      {/* Consensus Alert Pill */}
      <div
        className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium border ${
          comparison.agreement
            ? 'bg-emerald-50/70 text-emerald-800 border-emerald-200/80'
            : 'bg-amber-50/70 text-amber-800 border-amber-200/80'
        }`}
      >
        <div className="flex items-center gap-2">
          {comparison.agreement ? (
            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          )}
          <span>
            {comparison.agreement
              ? 'ผลการวิเคราะห์สอดคล้องกัน (High Model Consensus)'
              : 'ผลการวิเคราะห์มีความเห็นต่างกัน (Model Disagreement — แนะนำตรวจสอบเพิ่มเติม)'}
          </span>
        </div>
        <span className="text-[11px] font-mono opacity-80 shrink-0">
          Total: {comparison.latency_ms}ms
        </span>
      </div>

      {/* Stacked / Side-by-side Cards */}
      <div className="space-y-3">
        <ModelVerdictCard
          title="WangchanBERTa (Fine-tuned)"
          badge="Primary Transformer"
          icon={<Cpu className="h-4 w-4 text-emerald-600" />}
          result={comparison.wangchanberta}
          isPrimary={true}
        />
        <ModelVerdictCard
          title="TF-IDF + Logistic Regression"
          badge="Baseline Model"
          icon={<Zap className="h-4 w-4 text-indigo-600" />}
          result={comparison.baseline}
          isPrimary={false}
        />
      </div>
    </div>
  );
};
