'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-zinc-200/80 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-950/80 py-3 px-4 text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mb-14 md:mb-0">
      <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-500 shrink-0" />
          <p className="leading-relaxed">
            <strong className="text-zinc-700 dark:text-zinc-300 font-semibold">ข้อจำกัดความรับผิดชอบ:</strong> ผลการวิเคราะห์จากโมเดล NLP มิใช่การวินิจฉัยทางการแพทย์ โปรดตรวจสอบกับแพทย์หรือหน่วยงานสาธารณสุข
          </p>
        </div>
        <span className="shrink-0 font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
          CAI • PIM Term 1/2569
        </span>
      </div>
    </footer>
  );
};
