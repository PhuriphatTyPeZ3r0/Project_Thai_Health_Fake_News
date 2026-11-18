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
          ? 'border-emerald-200/90 bg-white dark:border-emerald-900/60 dark:bg-zinc-900 shadow-xs ring-1 ring-emerald-500/10'
          : 'border-zinc-200/90 bg-white/90 dark:border-zinc-800 dark:bg-zinc-900/90 shadow-2xs'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg ${
              isPrimary
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
            }`}
          >
            {icon}
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100 leading-tight">
              {title}
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">{result.model}</p>
          </div>
        </div>
        <span
          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold font-mono tracking-wide ${
            isPrimary
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/70 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60'
              : 'bg-zinc-100 text-zinc-600 border border-zinc-200/60 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
          }`}
        >
          {badge}
        </span>
      </div>

      {/* Primary Verdict Banner */}
      <div
        className={`flex items-center justify-between rounded-lg p-3 ${
          isFake
            ? 'bg-rose-50/70 border border-rose-100 dark:bg-rose-950/30 dark:border-rose-900/40'
            : 'bg-emerald-50/60 border border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/40'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {isFake ? (
            <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          )}
          <div>
            <span
              className={`text-sm sm:text-base font-extrabold tracking-tight ${
                isFake ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'
              }`}
            >
              {isFake ? 'ข่าวปลอม (FAKE)' : 'ข่าวจริง (FACT)'}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-tight">
              {isFake ? 'ตรวจพบลักษณะข้อมูลเท็จ/ชวนเชื่อ' : 'ข้อมูลน่าเชื่อถือสอดคล้องกับข้อเท็จจริง'}
            </p>
          </div>
        </div>
        <div className="text-right pl-2">
          <span className="text-lg sm:text-xl font-mono font-black text-slate-900 dark:text-white">
            {confidencePercent}%
          </span>
          <p className="text-[9px] text-slate-400 dark:text-zinc-500 font-medium uppercase tracking-wider">
            ความเชื่อมั่น
          </p>
        </div>
      </div>

      {/* Probability Gauge */}
      <div className="space-y-1.5 mt-3.5">
        <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            จริง {(result.probabilities.fact * 100).toFixed(1)}%
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            เท็จ {(result.probabilities.fake * 100).toFixed(1)}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800 flex">
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
        <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
          <span>Processing Time</span>
          <span className="text-slate-600 dark:text-zinc-300 font-medium">{result.latency_ms} ms</span>
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
            ? 'bg-emerald-50/70 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
            : 'bg-amber-50/70 text-amber-800 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
        }`}
      >
        <div className="flex items-center gap-2">
          {comparison.agreement ? (
            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
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

      {/* Stacked Cards */}
      <div className="space-y-3">
        <ModelVerdictCard
          title="WangchanBERTa (Fine-tuned)"
          badge="Primary Transformer"
          icon={<Cpu className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
          result={comparison.wangchanberta}
          isPrimary={true}
        />
        <ModelVerdictCard
          title="TF-IDF + Logistic Regression"
          badge="Baseline Model"
          icon={<Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
          result={comparison.baseline}
          isPrimary={false}
        />
      </div>
    </div>
  );
};

export const ShimmerComparisonCard: React.FC = () => {
  return (
    <div className="space-y-3.5 animate-pulse">
      <div className="h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="space-y-3">
        <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
          <div className="flex justify-between">
            <div className="h-4 w-44 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="h-14 rounded-lg bg-zinc-100 dark:bg-zinc-800/60" />
          <div className="h-2 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
          <div className="flex justify-between">
            <div className="h-4 w-44 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="h-14 rounded-lg bg-zinc-100 dark:bg-zinc-800/60" />
          <div className="h-2 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
};
