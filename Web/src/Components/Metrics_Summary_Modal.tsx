'use client';

import React from 'react';
import { BarChart3, X, Info } from 'lucide-react';

interface MetricsSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MetricsSummaryModal: React.FC<MetricsSummaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-xl bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
                รายงานผลการประเมินโมเดล (Benchmark & Evaluation)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                Dataset: LimeSoda (3,201 ข่าวคลีน) • Test Set (321 ตัวอย่าง) • Stratified Split 80/10/10
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-slate-600 dark:hover:text-zinc-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-xs sm:text-sm text-slate-700 dark:text-zinc-300">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-zinc-100 mb-2 text-xs">
              ตารางเปรียบเทียบบนชุดข้อมูลทดสอบ (Test Set — 10%)
            </h4>
            <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-left">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="py-2 px-3.5">Metric</th>
                    <th className="py-2 px-3.5">Baseline (TF-IDF + LogReg)</th>
                    <th className="py-2 px-3.5">WangchanBERTa (Fine-tuned)</th>
                    <th className="py-2 px-3.5">Improvement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
                  <tr>
                    <td className="py-2 px-3.5 font-medium text-slate-900 dark:text-zinc-200">Accuracy</td>
                    <td className="py-2 px-3.5 font-mono text-slate-600 dark:text-zinc-400">0.8972</td>
                    <td className="py-2 px-3.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">0.9140</td>
                    <td className="py-2 px-3.5 text-emerald-600 dark:text-emerald-400 font-bold font-mono">+1.68%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3.5 font-medium text-slate-900 dark:text-zinc-200">F1-Macro</td>
                    <td className="py-2 px-3.5 font-mono text-slate-600 dark:text-zinc-400">0.8969</td>
                    <td className="py-2 px-3.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">0.9090</td>
                    <td className="py-2 px-3.5 text-emerald-600 dark:text-emerald-400 font-bold font-mono">+1.21%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3.5 font-medium text-slate-900 dark:text-zinc-200">F1-Fake (Class 1)</td>
                    <td className="py-2 px-3.5 font-mono text-slate-600 dark:text-zinc-400">0.9021</td>
                    <td className="py-2 px-3.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">0.9250</td>
                    <td className="py-2 px-3.5 text-emerald-600 dark:text-emerald-400 font-bold font-mono">+2.29%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3.5 font-medium text-slate-900 dark:text-zinc-200">Precision (Fake)</td>
                    <td className="py-2 px-3.5 font-mono text-slate-600 dark:text-zinc-400">0.9212</td>
                    <td className="py-2 px-3.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">0.9320</td>
                    <td className="py-2 px-3.5 text-emerald-600 dark:text-emerald-400 font-bold font-mono">+1.08%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3.5 font-medium text-slate-900 dark:text-zinc-200">Recall (Fake)</td>
                    <td className="py-2 px-3.5 font-mono text-slate-600 dark:text-zinc-400">0.8837</td>
                    <td className="py-2 px-3.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">0.9100</td>
                    <td className="py-2 px-3.5 text-emerald-600 dark:text-emerald-400 font-bold font-mono">+2.63%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Findings Box */}
          <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800 p-3 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-zinc-200">
              <Info className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>สรุปผลการวิเคราะห์เปรียบเทียบ (Model Comparison Insight):</span>
            </div>
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-[11px]">
              โมเดล WangchanBERTa ทำคะแนน Fake F1 สูงถึง 0.925 เหนือกว่าโมเดล Baseline (0.902) โดยเฉพาะความครอบคลุมในการตรวจจับ (Recall 91.0% เทียบกับ 88.4%) เนื่องจากสถาปัตยกรรม RoBERTa เข้าใจบริบทไวยากรณ์ไทยและความเชื่อมโยงระยะไกลระหว่างอาการและคำอวดอ้างสรรพคุณเกินจริง
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition active:scale-[0.98]"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
