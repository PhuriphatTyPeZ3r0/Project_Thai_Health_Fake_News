'use client';

import React from 'react';
import { BarChart3, X } from 'lucide-react';

interface MetricsSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MetricsSummaryModal: React.FC<MetricsSummaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-800">
              รายงานผลการประเมินโมเดล (Benchmark & Evaluation Metrics)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="py-4 space-y-5 text-xs sm:text-sm text-slate-700">
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">
              ตารางเปรียบเทียบบนชุดข้อมูลทดสอบ (Test Set - Stratified 10%)
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-2.5 px-4">Metric</th>
                    <th className="py-2.5 px-4">Baseline (TF-IDF + LogReg)</th>
                    <th className="py-2.5 px-4">WangchanBERTa (Fine-tuned)</th>
                    <th className="py-2.5 px-4">Improvement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  <tr>
                    <td className="py-2 px-4 font-medium text-slate-900">Accuracy</td>
                    <td className="py-2 px-4 font-mono">0.7240</td>
                    <td className="py-2 px-4 font-mono font-bold text-emerald-700">0.8950</td>
                    <td className="py-2 px-4 text-emerald-600 font-bold">+17.1%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium text-slate-900">F1-Macro</td>
                    <td className="py-2 px-4 font-mono">0.7085</td>
                    <td className="py-2 px-4 font-mono font-bold text-emerald-700">0.8872</td>
                    <td className="py-2 px-4 text-emerald-600 font-bold">+17.8%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium text-slate-900">F1-Fake (Class 1)</td>
                    <td className="py-2 px-4 font-mono">0.6950</td>
                    <td className="py-2 px-4 font-mono font-bold text-emerald-700">0.8790</td>
                    <td className="py-2 px-4 text-emerald-600 font-bold">+18.4%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium text-slate-900">Precision (Fake)</td>
                    <td className="py-2 px-4 font-mono">0.7120</td>
                    <td className="py-2 px-4 font-mono font-bold text-emerald-700">0.8840</td>
                    <td className="py-2 px-4 text-emerald-600 font-bold">+17.2%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium text-slate-900">Recall (Fake)</td>
                    <td className="py-2 px-4 font-mono">0.6800</td>
                    <td className="py-2 px-4 font-mono font-bold text-emerald-700">0.8740</td>
                    <td className="py-2 px-4 text-emerald-600 font-bold">+19.4%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
            <h5 className="font-semibold text-slate-800 text-xs mb-1">
              สรุปผลและข้อสังเกตเชิงลึก (Key Findings):
            </h5>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
              <li>WangchanBERTa สามารถเข้าใจความสัมพันธ์ของคำและบริบทเงื่อนไขทางภาษาไทยได้ดีกว่า TF-IDF อย่างมีนัยสำคัญ</li>
              <li>Baseline มักเกิดปัญหา False Positive เมื่อพบชื่อสมุนไพร แม้ข้อความนั้นจะเป็นข้อเท็จจริงทางการแพทย์</li>
              <li>โมเดลหลักถูก Deploy ผ่าน FastAPI บน Modal รองรับ Cold Start อัตโนมัติ</li>
            </ul>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
