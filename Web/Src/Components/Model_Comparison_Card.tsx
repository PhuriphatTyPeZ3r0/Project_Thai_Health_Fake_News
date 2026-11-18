'use client';

import React from 'react';
import { ModelComparisonDTO, PredictionResultDTO } from '../Types/Index';
import { CheckCircle2, XCircle, Zap, Cpu, Check, AlertCircle } from 'lucide-react';

interface ModelComparisonCardProps {
  comparison: ModelComparisonDTO;
}

const SingleModelView: React.FC<{
  title: string;
  badge: string;
  icon: React.ReactNode;
  result: PredictionResultDTO;
  isMain?: boolean;
}> = ({ title, badge, icon, result, isMain }) => {
  const isFake = result.label === 'fake';
  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <div
      className={`rounded-2xl border p-5 transition-all ${
        isMain
          ? 'border-emerald-300 bg-gradient-to-b from-emerald-50/40 to-white shadow-sm ring-1 ring-emerald-200'
          : 'border-slate-200 bg-white shadow-xs'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">{icon}</div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">{title}</h3>
            <p className="text-xs text-slate-500 font-mono">{result.model}</p>
          </div>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            isMain ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
          }`}
        >
          {badge}
        </span>
      </div>

      {/* Decision Tag */}
      <div className="my-3 flex items-center justify-between rounded-xl bg-slate-50 p-3">
        <div className="flex items-center gap-2">
          {isFake ? (
            <XCircle className="h-6 w-6 text-rose-600" />
          ) : (
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          )}
          <div>
            <span
              className={`text-lg font-black tracking-tight ${
                isFake ? 'text-rose-700' : 'text-emerald-700'
              }`}
            >
              {isFake ? 'ข่าวปลอม (FAKE)' : 'ข่าวจริง (FACT)'}
            </span>
            <p className="text-xs text-slate-500">
              {isFake ? 'ตรวจพบลักษณะข้อมูลเท็จ/บิดเบือน' : 'ข้อมูลมีลักษณะน่าเชื่อถือและถูกต้อง'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-extrabold text-slate-800">{confidencePercent}%</span>
          <p className="text-[10px] text-slate-400 font-medium">ความเชื่อมั่น</p>
        </div>
      </div>

      {/* Probability Bar */}
      <div className="space-y-1.5 mt-4">
        <div className="flex justify-between text-xs text-slate-600 font-medium">
          <span>ความน่าจะเป็นจริง (Fact): {(result.probabilities.fact * 100).toFixed(1)}%</span>
          <span>ความน่าจะเป็นเท็จ (Fake): {(result.probabilities.fake * 100).toFixed(1)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 flex">
          <div
            className="bg-emerald-500 transition-all duration-500"
            style={{ width: `${result.probabilities.fact * 100}%` }}
          />
          <div
            className="bg-rose-500 transition-all duration-500"
            style={{ width: `${result.probabilities.fake * 100}%` }}
          />
        </div>
      </div>

      {result.latency_ms !== undefined && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
          <span>Inference Latency:</span>
          <span className="font-mono font-medium text-slate-600">{result.latency_ms} ms</span>
        </div>
      )}
    </div>
  );
};

export const ModelComparisonCard: React.FC<ModelComparisonCardProps> = ({ comparison }) => {
  return (
    <div className="space-y-4">
      {/* Agreement Alert */}
      <div
        className={`flex items-center justify-between rounded-xl p-3.5 text-xs sm:text-sm font-medium border ${
          comparison.agreement
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-amber-50 text-amber-800 border-amber-200'
        }`}
      >
        <div className="flex items-center gap-2">
          {comparison.agreement ? (
            <Check className="h-4 w-4 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-amber-600" />
          )}
          <span>
            {comparison.agreement
              ? 'ทั้งสองโมเดลมีความเห็นตรงกัน (High Consensus)'
              : 'ทั้งสองโมเดลมีความเห็นต่างกัน (Model Disagreement — แนะนำให้ตรวจสอบเพิ่มเติม)'}
          </span>
        </div>
        <span className="text-xs opacity-75 font-mono">
          Total Latency: {comparison.latency_ms}ms
        </span>
      </div>

      {/* Side by Side Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SingleModelView
          title="WangchanBERTa (Fine-tuned)"
          badge="Main Transformer"
          icon={<Cpu className="h-5 w-5 text-emerald-600" />}
          result={comparison.wangchanberta}
          isMain={true}
        />
        <SingleModelView
          title="TF-IDF + Logistic Regression"
          badge="Baseline Model"
          icon={<Zap className="h-5 w-5 text-indigo-600" />}
          result={comparison.baseline}
          isMain={false}
        />
      </div>
    </div>
  );
};
