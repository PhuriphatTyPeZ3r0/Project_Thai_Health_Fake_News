'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface SampleNewsPresetsProps {
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export const SAMPLE_PRESETS = [
  {
    title: 'ข่าวปลอม: มะนาวโซดารักษามะเร็ง',
    text: 'แชร์ด่วน! ดื่มน้ำมะนาวผสมโซดาทุกเช้าก่อนอาหาร ช่วยฆ่าเซลล์มะเร็งได้ผล 100% ดีกว่าคีโมถึงหมื่นเท่า ไม่ต้องหาหมออีกต่อไป',
    type: 'fake',
  },
  {
    title: 'ข่าวจริง: สธ. เตือนไข้หวัดใหญ่ระบาด',
    text: 'กรมควบคุมโรค กระทรวงสาธารณสุข เตือนประชาชนระวังการแพร่ระบาดของโรคไข้หวัดใหญ่ในช่วงเปลี่ยนฤดู แนะนำกลุ่มเสี่ยงฉีดวัคซีนป้องกัน',
    type: 'fact',
  },
  {
    title: 'ข่าวปลอม: กระเทียมสดรักษาโควิด',
    text: 'สูตรลับโบราณ! กินกระเทียมสดวันละ 5 หัวพร้อมต้มน้ำขิง ช่วยทำลายไวรัสโควิดและล้างพิษในปอดให้สะอาดหมดจดภายใน 3 วัน',
    type: 'fake',
  },
  {
    title: 'ข่าวจริง: ผลวิจัยการออกกำลังกาย',
    text: 'คณะแพทยศาสตร์ศิริราชพยาบาล เผยแพร่ผลการศึกษาพบว่าการเดินเร็ววันละ 30 นาทีช่วยลดความดันโลหิตและลดความเสี่ยงภาวะหลอดเลือดหัวใจตีบ',
    type: 'fact',
  },
];

export const SampleNewsPresets: React.FC<SampleNewsPresetsProps> = ({ onSelect, disabled }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
        <span>ตัวอย่างข้อความทดสอบ (Click to Test)</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {SAMPLE_PRESETS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(sample.text)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/50 hover:text-emerald-800 transition disabled:opacity-50"
          >
            {sample.title}
          </button>
        ))}
      </div>
    </div>
  );
};
