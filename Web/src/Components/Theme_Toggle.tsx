'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-8 w-8 rounded-lg border border-zinc-200/80 bg-white/50 dark:border-zinc-800 dark:bg-zinc-900/50" />
    );
  }

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getLabel = () => {
    if (theme === 'light') return 'โหมดสว่าง';
    if (theme === 'dark') return 'โหมดมืด';
    return 'ตามระบบ';
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      title={`สลับธีม: ${getLabel()}`}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200/90 bg-white text-zinc-600 shadow-2xs hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white transition-all active:scale-[0.95]"
      aria-label="Toggle theme"
    >
      {theme === 'light' && <Sun className="h-4 w-4 text-amber-500" />}
      {theme === 'dark' && <Moon className="h-4 w-4 text-indigo-400" />}
      {theme === 'system' && <Laptop className="h-4 w-4 text-slate-400" />}
    </button>
  );
};
