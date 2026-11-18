'use client';

import React, { useState } from 'react';
import { Navbar } from '@/Components/Nav_Bar';
import { DisclaimerBanner } from '@/Components/Disclaimer_Banner';
import { SampleNewsPresets } from '@/Components/Sample_News_Presets';
import { ModelComparisonCard } from '@/Components/Model_Comparison_Card';
import { MetricsSummaryModal } from '@/Components/Metrics_Summary_Modal';
import { ModelComparisonDTO } from '@/Types/Index';
import { Search, Loader2, BarChart2, RefreshCw, AlertCircle } from 'lucide-react';

export default function HomePage() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
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
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      <main className="container mx-auto max-w-5xl px-4 py-8 flex-1 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/70 px-3 py-1 text-xs font-semibold text-emerald-800">
            ระบบตรวจสอบข่าวปลอมด้านสุขภาพด้วย NLP และ Transformer
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            ตรวจจับข่าวสุขภาพปลอมภาษาไทย
          </h2>
          <p className="text-sm text-slate-600">
            วิเคราะห์ความน่าเชื่อถือด้วยสถาปัตยกรรม <strong>WangchanBERTa Fine-tuned</strong> เปรียบเทียบกับ <strong>TF-IDF Baseline</strong> แบบเรียลไทม์
          </p>
        </div>

        {/* Input Card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="news-input" className="text-sm font-bold text-slate-800">
                วางข้อความข่าวสารหรือข้อความที่ต้องการตรวจสอบ
              </label>
              <span className={`text-xs font-mono ${inputText.length > 1500 ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>
                {inputText.length} / 2,000 ตัวอักษร
              </span>
            </div>

            <textarea
              id="news-input"
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="ตัวอย่าง: กระทรวงสาธารณสุขเตือน ดื่มน้ำมะนาวผสมโซดาไม่สามารถรักษามะเร็งได้..."
              className="w-full rounded-xl border border-slate-200 p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-hidden transition"
              disabled={loading}
            />

            {/* Validation Alerts */}
            {validationErrors.length > 0 && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>โปรดตรวจสอบข้อผิดพลาด:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 pl-5">
                  {validationErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {errorMsg && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>กำลังวิเคราะห์...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      <span>ตรวจสอบข่าว</span>
                    </>
                  )}
                </button>

                {inputText && (
                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={loading}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>ล้างข้อมูล</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowMetricsModal(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                <BarChart2 className="h-4 w-4 text-emerald-600" />
                <span>ดูตารางผลประเมินโมเดล (Metrics)</span>
              </button>
            </div>
          </form>

          {/* Sample presets */}
          <div className="pt-3 border-t border-slate-100">
            <SampleNewsPresets onSelect={handlePresetSelect} disabled={loading} />
          </div>
        </section>

        {/* Comparison Result Section */}
        {comparisonResult && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">
                ผลการวิเคราะห์และเปรียบเทียบโมเดล (Analysis & Comparison Results)
              </h3>
            </div>
            <ModelComparisonCard comparison={comparisonResult} />
          </section>
        )}

        {/* Disclaimer */}
        <DisclaimerBanner />
      </main>

      {/* Metrics Modal */}
      <MetricsSummaryModal
        isOpen={showMetricsModal}
        onClose={() => setShowMetricsModal(false)}
      />

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>1323404 Natural Language Processing • Mini Project • Computer Engineering & AI (CAI), PIM</p>
        <p className="mt-1">WangchanBERTa + Next.js MVC/OOP Architecture • Deployed on Vercel & Modal</p>
      </footer>
    </div>
  );
}
