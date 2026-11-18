'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/Components/Nav_Bar';
import { DisclaimerBanner } from '@/Components/Disclaimer_Banner';
import { SampleNewsPresets } from '@/Components/Sample_News_Presets';
import { ModelComparisonCard, ShimmerComparisonCard } from '@/Components/Model_Comparison_Card';
import { MetricsSummaryModal } from '@/Components/Metrics_Summary_Modal';
import { MobileActionBar } from '@/Components/Mobile_Action_Bar';
import { ModelComparisonDTO } from '@/Types/Index';
import { Search, Loader2, RefreshCw, AlertCircle, Activity, ArrowRight, ArrowLeft } from 'lucide-react';

export default function StudioPage() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSlowLoading, setIsSlowLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [comparisonResult, setComparisonResult] = useState<ModelComparisonDTO | null>(null);
  const [showMetricsModal, setShowMetricsModal] = useState(false);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setValidationErrors([]);

    if (!inputText.trim()) {
      setValidationErrors(['กรุณาระบุข้อความข่าวสารสุขภาพที่ต้องการตรวจสอบ']);
      return;
    }

    setLoading(true);
    setIsSlowLoading(false);
    const slowTimer = setTimeout(() => {
      setIsSlowLoading(true);
    }, 2500);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, model_type: 'both' }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        if (json.validationErrors) {
          setValidationErrors(json.validationErrors);
        } else {
          setErrorMsg(json.error || 'เกิดข้อผิดพลาดในการวิเคราะห์ข้อความ');
        }
        setComparisonResult(null);
      } else {
        setComparisonResult(json.data);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      clearTimeout(slowTimer);
      setIsSlowLoading(false);
      setLoading(false);
    }
  };

  const handlePresetSelect = (text: string) => {
    setInputText(text);
    setErrorMsg(null);
    setValidationErrors([]);
  };

  const handleClear = () => {
    setInputText('');
    setComparisonResult(null);
    setErrorMsg(null);
    setValidationErrors([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfd] dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 selection:bg-emerald-100 dark:selection:bg-emerald-950 selection:text-emerald-900 dark:selection:text-emerald-200 transition-colors duration-200">
      <Navbar mode="studio" onOpenMetrics={() => setShowMetricsModal(true)} />

      <main className="container mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 flex-1">
        {/* Top Breadcrumb & Studio Header */}
        <div className="mb-6 flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 dark:border-emerald-800 transition shadow-2xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>กลับหน้าหลัก</span>
            </Link>
          </div>
        </div>

        {/* Split-Screen Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Input & Controls (Span 7) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Minimalist Hero Heading */}
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                ห้องทดสอบและวิเคราะห์โมเดลคู่
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-xl leading-relaxed">
                เปรียบเทียบผลลัพธ์ระหว่างโมเดลโครงข่ายภาษา <strong>WangchanBERTa Fine-tuned</strong> และ <strong>TF-IDF Baseline</strong> แบบเรียลไทม์เพื่อตรวจจับข้อมูลบิดเบือน
              </p>
            </div>

            {/* Presets */}
            <SampleNewsPresets onSelect={handlePresetSelect} disabled={loading} />

            {/* Main Input Form */}
            <form onSubmit={handleAnalyze} className="rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="news-input" className="text-xs font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wider">
                  ข้อความที่ต้องการวิเคราะห์
                </label>
                <span
                  className={`text-[11px] font-mono ${
                    inputText.length > 1500 ? 'text-rose-500 font-bold' : 'text-slate-400 dark:text-zinc-500'
                  }`}
                >
                  {inputText.length} / 2,000 ตัวอักษร
                </span>
              </div>

              <textarea
                id="news-input"
                rows={5}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="วางข้อความพาดหัวข่าว หรือข้อความคำกล่าวอ้างทางสุขภาพที่ต้องการตรวจสอบที่นี่..."
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent p-3.5 text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-hidden transition"
                disabled={loading}
              />

              {/* Validation Alerts */}
              {validationErrors.length > 0 && (
                <div className="rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 p-3 text-xs text-rose-800 dark:text-rose-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>โปรดตรวจสอบข้อผิดพลาด:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pl-4 text-[11px]">
                    {validationErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {errorMsg && (
                <div className="rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 p-3 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Desktop Buttons */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>กำลังประมวลผล...</span>
                      </>
                    ) : (
                      <>
                        <Search className="h-3.5 w-3.5" />
                        <span>เริ่มการวิเคราะห์โมเดลคู่</span>
                        <ArrowRight className="h-3 w-3 opacity-70" />
                      </>
                    )}
                  </button>

                  {inputText && (
                    <button
                      type="button"
                      onClick={handleClear}
                      disabled={loading}
                      className="flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-xs font-medium text-slate-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:text-slate-900 dark:hover:text-white active:scale-[0.98] transition-all"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>ล้างข้อมูล</span>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Dual-Model Verdict & Comparison (Span 5) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wider">
              <Activity className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>ผลการวิเคราะห์โมเดล (Dual-Model Verdict)</span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {isSlowLoading && (
                  <div className="flex items-center gap-2 rounded-xl border border-amber-200/90 bg-amber-50/80 p-3 text-xs font-medium text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300 animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin text-amber-600 dark:text-amber-400 shrink-0" />
                    <p className="leading-relaxed">
                      กำลังเชื่อมต่อคลาวด์ GPU (Modal Serverless) การประมวลผลครั้งแรกอาจใช้เวลาสักครู่...
                    </p>
                  </div>
                )}
                <ShimmerComparisonCard />
              </div>
            ) : comparisonResult ? (
              <ModelComparisonCard comparison={comparisonResult} />
            ) : (
              /* Idle Empty State */
              <div className="rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-8 text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 shadow-2xs mx-auto text-zinc-400 dark:text-zinc-500">
                  <Activity className="h-6 w-6" />
                </div>
                <div className="space-y-1 max-w-xs mx-auto">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">ระบบพร้อมรับข้อความ</h4>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                    วางข้อความข่าวสารทางสุขภาพในช่องด้านซ้าย หรือเลือกตัวอย่างเพื่อเปรียบเทียบผลลัพธ์ของโมเดลคู่แบบทันที
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      <DisclaimerBanner />

      {/* Mobile Bottom Action Bar */}
      <MobileActionBar
        onAnalyze={() => handleAnalyze()}
        onClear={handleClear}
        loading={loading}
        hasInput={inputText.trim().length > 0}
      />

      <MetricsSummaryModal
        isOpen={showMetricsModal}
        onClose={() => setShowMetricsModal(false)}
      />
    </div>
  );
}
