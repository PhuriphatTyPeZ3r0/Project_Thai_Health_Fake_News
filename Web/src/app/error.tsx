'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[AppRouter ErrorBoundary]:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfdfd] dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 text-center shadow-xl space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 mx-auto">
          <AlertCircle className="h-6 w-6" />
        </div>

        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            เกิดข้อผิดพลาดในการโหลดระบบ
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            {error.message || 'ระบบไม่สามารถประมวลผลคำขอได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง'}
          </p>
        </div>

        {error.digest && (
          <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
            Error Digest: {error.digest}
          </p>
        )}

        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 active:scale-[0.98] transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>ลองใหม่อีกครั้ง</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 px-4 py-2 text-xs font-medium text-slate-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all"
          >
            <Home className="h-3.5 w-3.5" />
            <span>หน้าหลัก</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
