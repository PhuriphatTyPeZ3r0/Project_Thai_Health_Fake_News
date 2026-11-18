'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-zinc-200/80 bg-zinc-50/70 py-4 px-4 text-xs text-zinc-500">
      <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-600/90 shrink-0" />
          <p className="leading-relaxed">
            <strong className="text-zinc-700 font-semibold">ข้อจำกัดความรับผิดชอบ (Medical Disclaimer):</strong> ระบบนี้พัฒนาขึ้นเพื่อการวิเคราะห์ทางภาษาศาสตร์คอมพิวเตอร์ (NLP) ในรายวิชา 1323404 ผลลัพธ์มิใช่การวินิจฉัยทางการแพทย์ โปรดตรวจสอบกับกระทรวงสาธารณสุขหรือแพทย์ผู้เชี่ยวชาญ
          </p>
        </div>
        <span className="shrink-0 text-[11px] font-mono text-zinc-400">
          CAI • PIM Term 1/2569
        </span>
      </div>
    </footer>
  );
};
