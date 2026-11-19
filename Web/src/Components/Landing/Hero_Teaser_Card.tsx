'use client';

import React, { useState } from 'react';
import { Activity, Cpu, BarChart } from 'lucide-react';

interface TeaserPreset {
  id: string;
  category: string;
  text: string;
  verdict: 'FAKE' | 'FACT';
  wcbConfidence: number;
  baselineConfidence: number;
  reason: string;
}

const PRESETS: TeaserPreset[] = [
  {
    id: 'lemon',
    category: 'สูตรสมุนไพรผิดกฎหมาย',
    text: 'ดื่มน้ำมะนาวผสมโซดาเป็นประจำทุกเช้า ช่วยฆ่าเซลล์มะเร็งได้ดีกว่าเคโมบำบัด 10,000 เท่าโดยไม่ต้องพึ่งยาโรงพยาบาล',
    verdict: 'FAKE',
    wcbConfidence: 95.8,
    baselineConfidence: 88.4,
    reason: 'ตรวจพบคำกล่าวอ้างเกินจริง (Exaggerated Medical Claim) และไม่มีงานวิจัยรองรับ',
  },
  {
    id: 'fda',
    category: 'ประกาศทางการ',
    text: 'อย. แจ้งเตือนประชาชนอย่าหลงเชื่อโฆษณาผลิตภัณฑ์เสริมอาหารอวดอ้างสรรพคุณรักษาโรคไตวายเรื้อรัง อาจเสี่ยงไตวายเฉียบพลัน',
    verdict: 'FACT',
    wcbConfidence: 89.2,
    baselineConfidence: 82.6,
    reason: 'สอดคล้องกับโครงสร้างคำเตือนและคำศัพท์ทางการของสำนักงานคณะกรรมการอาหารและยา',
  },
  {
    id: 'diabetes',
    category: 'แอบอ้างการรักษา',
    text: 'แชร์ด่วน! ใบหม่อนต้มผสมน้ำมะพร้าวอ่อน ดื่ม 3 วันน้ำตาลลดฮวบ รักษาเบาหวานหายขาดถาวรโดยไม่ต้องฉีดอินซูลิน',
    verdict: 'FAKE',
    wcbConfidence: 96.4,
    baselineConfidence: 91.2,
    reason: 'ตรวจพบการแนะนำให้หยุดยาแผนปัจจุบัน ซึ่งขัดแย้งกับหลักเวชปฏิบัติสากล',
  },
];

export const HeroTeaserCard: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('lemon');
  const active = PRESETS.find((p) => p.id === selectedId) || PRESETS[0];

  return (
    <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/90 p-5 sm:p-6 shadow-xl shadow-zinc-200/40 dark:shadow-none backdrop-blur-md transition-all">
      {/* Top Header */}
      <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-3 mb-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
          <Activity className="h-3.5 w-3.5" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200">
          ตัวอย่างการวิเคราะห์โมเดลคู่
        </span>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-1.5 mb-4">
        <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
          คลิกเลือกตัวอย่างข่าวเพื่อทดสอบ:
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {PRESETS.map((preset) => {
            const isSelected = preset.id === selectedId;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedId(preset.id)}
                className={`truncate rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all text-left ${
                  isSelected
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold shadow-xs scale-[1.01]'
                    : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200/70 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-800'
                }`}
              >
                {preset.category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sample Text Box */}
      <div className="rounded-xl border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/70 dark:bg-zinc-950/50 p-3.5 mb-4">
        <div className="text-[10px] font-mono uppercase text-slate-400 dark:text-zinc-500 mb-1">
          ข้อความจำลอง:
        </div>
        <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-zinc-200 leading-relaxed italic">
          "{active.text}"
        </p>
      </div>

      {/* Dual-Model Score Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Model 1: WangchanBERTa */}
        <div className="rounded-xl border border-emerald-200/70 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-900 dark:text-emerald-300">
              <Cpu className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span>WangchanBERTa</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
              Fine-tuned
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span
              className={`text-xs font-black ${
                active.verdict === 'FAKE'
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {active.verdict}
            </span>
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-zinc-300">
              {active.wcbConfidence.toFixed(1)}%
            </span>
          </div>
          {/* Progress Bar */}
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                active.verdict === 'FAKE' ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${active.wcbConfidence}%` }}
            />
          </div>
        </div>

        {/* Model 2: TF-IDF Baseline */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-800 dark:text-zinc-200">
              <BarChart className="h-3 w-3 text-slate-500 dark:text-zinc-400" />
              <span>TF-IDF + LogReg</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
              Baseline
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span
              className={`text-xs font-black ${
                active.verdict === 'FAKE'
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {active.verdict}
            </span>
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-zinc-300">
              {active.baselineConfidence.toFixed(1)}%
            </span>
          </div>
          {/* Progress Bar */}
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                active.verdict === 'FAKE' ? 'bg-rose-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${active.baselineConfidence}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
