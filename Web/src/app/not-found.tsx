import React from 'react';
import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfdfd] dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 text-center shadow-xl space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 mx-auto">
          <FileQuestion className="h-6 w-6" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
            404 Not Found
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            ไม่พบหน้าที่คุณต้องการ
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            หน้าที่คุณกำลังค้นหาอาจถูกย้าย ลบออก หรือที่อยู่ URL ไม่ถูกต้อง
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 active:scale-[0.98] transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>กลับสู่ห้องตรวจสอบหลัก</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
