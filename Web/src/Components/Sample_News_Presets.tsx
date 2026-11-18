'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface SampleNewsPresetsProps {
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export const SAMPLE_PRESETS = [
  {
    title: 'มะนาวโซดารักษามะเร็ง',
    text: 'แชร์ด่วน! ดื่มน้ำมะนาวผสมโซดาทุกเช้าก่อนอาหาร ช่วยฆ่าเซลล์มะเร็งได้ผล 100% ดีกว่าคีโมถึงหมื่นเท่า ไม่ต้องหาหมออีกต่อไป',
    type: 'fake',
  },
  {
    title: 'สธ. เตือนไข้หวัดใหญ่ระบาด',
    text: 'กรมควบคุมโรค กระทรวงสาธารณสุข เตือนประชาชนระวังการแพร่ระบาดของโรคไข้หวัดใหญ่ในช่วงเปลี่ยนฤดู แนะนำกลุ่มเสี่ยงฉีดวัคซีนป้องกัน',
    type: 'fact',
  },
  {
    title: 'กระเทียมสดรักษาโควิด',
    text: 'สูตรลับโบราณ! กินกระเทียมสดวันละ 5 หัวพร้อมต้มน้ำขิง ช่วยทำลายไวรัสโควิดและล้างพิษในปอดให้สะอาดหมดจดภายใน 3 วัน',
    type: 'fake',
  },
  {
    title: 'ผลวิจัยการออกกำลังกาย',
    text: 'คณะแพทยศาสตร์ศิริราชพยาบาล เผยแพร่ผลการศึกษาพบว่าการเดินเร็ววันละ 30 นาทีช่วยลดความดันโลหิตและลดความเสี่ยงภาวะหลอดเลือดหัวใจตีบ',
    type: 'fact',
  },
];

export const SampleNewsPresets: React.FC<SampleNewsPresetsProps> = ({ onSelect, disabled }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
          <Sparkles className="h-3 w-3 text-emerald-600" />
          <span>ข้อความตัวอย่างสำหรับทดสอบ</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">1-Click Test</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {SAMPLE_PRESETS.map((sample, idx) => {
          const isFake = sample.type === 'fake';
          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(sample.text)}
              className="group flex items-center justify-between rounded-lg border border-zinc-200/90 bg-white px-2.5 py-2 text-left text-xs font-medium text-slate-700 shadow-2xs hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50/60 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                    isFake ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                />
                <span className="truncate group-hover:text-slate-900">{sample.title}</span>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-zinc-400 uppercase ml-1">
                {isFake ? 'Fake' : 'Fact'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
