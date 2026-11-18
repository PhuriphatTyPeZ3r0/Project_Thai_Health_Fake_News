'use client';

import React from 'react';
import { Search, Loader2, RefreshCw } from 'lucide-react';

interface MobileActionBarProps {
  onAnalyze: () => void;
  onClear: () => void;
  loading: boolean;
  hasInput: boolean;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({
  onAnalyze,
  onClear,
  loading,
  hasInput,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-200/90 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-4 py-2.5 shadow-lg safe-bottom">
      <div className="flex items-center gap-2">
        {hasInput && (
          <button
            type="button"
            onClick={onClear}
            disabled={loading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 active:scale-[0.95] transition-all"
            title="ล้างข้อมูล"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}

        <button
          type="button"
          onClick={onAnalyze}
          disabled={loading || !hasInput}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>กำลังวิเคราะห์...</span>
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              <span>เริ่มการวิเคราะห์โมเดลคู่</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
