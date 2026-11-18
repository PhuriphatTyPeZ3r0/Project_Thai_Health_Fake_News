'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Github, BarChart2, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { ThemeToggle } from './Theme_Toggle';

interface NavbarProps {
  mode?: 'landing' | 'studio';
  onOpenMetrics?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ mode = 'landing', onOpenMetrics }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/85 dark:border-zinc-800 dark:bg-zinc-950/85 backdrop-blur-md transition-colors duration-200">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand & Project Info */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs group-hover:bg-emerald-500 transition-colors">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100 tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Thai Health Fake-News Detector
              </h1>
              <span className="hidden md:inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                v1.0 • NLP
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
              1323404 Mini Project • CAI PIM (Term 1/2569)
            </p>
          </div>
        </Link>

        {/* Center Nav Links (Landing Mode Only) */}
        {mode === 'landing' && (
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-zinc-300">
            <a href="#problem" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              ทำไมต้อง NLP
            </a>
            <a href="#models" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              สถาปัตยกรรมโมเดลคู่
            </a>
            <a href="#benchmark" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              เกณฑ์ประเมิน (Benchmark)
            </a>
            <a href="#team" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              ทีมงาน P1–P6
            </a>
          </nav>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {mode === 'landing' ? (
            <Link
              href="/studio"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 active:scale-[0.98] transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>เปิดห้องทดสอบ</span>
              <ArrowRight className="h-3 w-3 opacity-80" />
            </Link>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition shadow-2xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">หน้าแรก</span>
            </Link>
          )}

          {onOpenMetrics && (
            <button
              type="button"
              onClick={onOpenMetrics}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 hover:text-emerald-800 dark:hover:text-emerald-400 transition-all active:scale-[0.98]"
            >
              <BarChart2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Metrics</span>
            </button>
          )}

          <ThemeToggle />

          <a
            href="https://github.com/PhuriphatTyPeZ3r0/thai-health-fakenews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-all active:scale-[0.98]"
            title="ดูซอร์สโค้ดบน GitHub"
          >
            <Github className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};
