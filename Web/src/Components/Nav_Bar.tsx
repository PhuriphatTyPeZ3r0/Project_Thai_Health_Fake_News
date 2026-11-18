'use client';

import React from 'react';
import { ShieldCheck, Github, BarChart2 } from 'lucide-react';

interface NavbarProps {
  onOpenMetrics?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMetrics }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/85 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand & Project Info */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Thai Health Fake-News Detector
              </h1>
              <span className="hidden md:inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-mono text-zinc-600 border border-zinc-200">
                v1.0 • MVC/OOP
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              1323404 NLP Mini Project • CAI PIM (Term 1/2569)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {onOpenMetrics && (
            <button
              type="button"
              onClick={onOpenMetrics}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-800 transition-all active:scale-[0.98]"
            >
              <BarChart2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>เกณฑ์ประเมิน (Metrics)</span>
            </button>
          )}

          <a
            href="https://github.com/PhuriphatTyPeZ3r0/thai-health-fakenews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50/80 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-white hover:text-slate-900 hover:border-zinc-300 transition-all active:scale-[0.98]"
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
