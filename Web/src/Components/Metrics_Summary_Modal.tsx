'use client';

import React from 'react';
import { BarChart3, X, CheckCircle, Info } from 'lucide-react';

interface MetricsSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MetricsSummaryModal: React.FC<MetricsSummaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-xl bg-white p-5 sm:p-6 shadow-2xl border border-zinc-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                รายงานผลการประเมินโมเดล (Benchmark & Evaluation)
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Dataset: LimeSoda (SEACrowd) • Stratified Split 80/10/10
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-zinc-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-xs sm:text-sm text-slate-700">
          <div>
            <h4 className="font-bold text-slate-900 mb-2 text-xs">
              ตารางเปรียบเทียบบนชุดข้อมูลทดสอบ (Test Set — 10%)
            </h4>
            <div className="overflow-x-auto rounded-lg border border-zinc-200">
              <table className="w-full text-left">
                <thead className="bg-zinc-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-zinc-200">
                  <tr>
                    <th className="py-2 px-3.5">Metric</th>
                    <th className="py-2 px-3.5">Baseline (TF-IDF + LogReg)</th>
                    <th className="py-2 px-3.5">WangchanBERTa (Fine-tuned)</th>
                    <th className="py-2 px-3.5">Improvement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs">
                  <tr>
                    <td className="py-2 px-3.5 font-medium text-slate-900">Accuracy</td>
                    <td className="py-2 px-3.5 font-mono text-slate-600">0.7240</td>
                    <td className="py-2 px-3.5 font-mono font-bold text-emerald-700">0.8950</td>
                    <td className="py-2 px-3.5 text-emerald-600 font-bold font-mono">+17.1%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3.5 font-medium text-slate-900">F1-Macro</td>
                    <td className="py-2 px-3.5 font-mono text-slate-600">0.7085</td>
                    <td className="py-2 px-3.5 font-mono font-bold text-emerald-700">0.8872</td>
                    <td className="py-2 px-3.5 text-emerald-600 font-bold font-mono">+17.8%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3.5 font-medium text-slate-900">F1-Fake (Class 1)</td>
                    <td className="py-2 px-3.5 font-mono text-slate-600">0.6950</td>
                    <td className="py-2 px-3.5 font-mono font-bold text-emerald-700">0.8790</td>
                    <td className="py-2 px-3.5 text-emerald-600 font-bold font-mono">+18.4%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3.5 font-medium text-slate-900">Precision (Fake)</td>
                    <td className="py-2 px-3.5 font-mono text-slate-600">0.7120</td>
                    <td className="py-2 px-3.5 font-mono font-bold text-emerald-700">0.8840</td>
                    <td className="py-2 px-3.5 text-emerald-600 font-bold font-mono">+17.2%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3.5 font-medium text-slate-900">Recall (Fake)</td>
                    <td className="py-2 px-3.5 font-mono text-slate-600">0.6800</td>
                    <td className="py-2 px-3.5 font-mono font-bold text-emerald-700">0.8740</td>
                    <td className="py-2 px-3.5 text-emerald-600 font-bold font-mono">+19.4%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Findings Box */}
          <div className="rounded-lg bg-zinc-50 border border-zinc-200/80 p-3 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Info className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>สรุปผลการวิเคราะห์เปรียบเทียบ (Model Comparison Insight):</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              โมเดล WangchanBERTa ทำคะแนน F1-Fake สูงกว่าโมเดล Baseline ถึง 18.4% เนื่องจากสถาปัตยกรรม RoBERTa เข้าใจบริบทประโยคแบบสองทิศทาง (Bidirectional) และความสัมพันธ์เชิงความหมายในไวยากรณ์ไทย ขณะที่ TF-IDF วิเคราะห์เฉพาะความถี่คำเดี่ยว (Bag-of-Words) ทำให้มีจุดอ่อนต่อข่าวที่ใช้คำทางการแพทย์ถูกต้องแต่บิดเบือนข้อสรุป
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-zinc-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-zinc-50 transition active:scale-[0.98]"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
