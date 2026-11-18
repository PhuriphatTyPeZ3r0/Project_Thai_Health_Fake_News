import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfd] dark:bg-zinc-950 animate-pulse">
      {/* Top Bar Skeleton */}
      <div className="h-16 border-b border-zinc-200/80 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
        <div className="container mx-auto max-w-7xl h-full flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-1.5">
              <div className="h-4 w-44 rounded-md bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-2.5 w-28 rounded-md bg-zinc-100 dark:bg-zinc-800/60" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </div>

      {/* Main Workspace Skeleton */}
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column Skeleton */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <div className="h-6 w-64 rounded-md bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-8 w-80 rounded-md bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-full max-w-md rounded-md bg-zinc-100 dark:bg-zinc-800/60" />
            </div>

            {/* Presets Skeleton */}
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-9 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
              ))}
            </div>

            {/* Textarea Skeleton */}
            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4">
              <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-32 rounded-lg bg-zinc-100 dark:bg-zinc-800/50" />
              <div className="h-10 w-36 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-5 space-y-3">
            <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
              <div className="h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800/50" />
              <div className="h-28 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-24 rounded-lg bg-zinc-100 dark:bg-zinc-800/50" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
