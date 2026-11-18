'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/Components/Nav_Bar';
import { HeroTeaserCard } from '@/Components/Landing/Hero_Teaser_Card';
import { DisclaimerBanner } from '@/Components/Disclaimer_Banner';
import { MetricsSummaryModal } from '@/Components/Metrics_Summary_Modal';
import {
  Sparkles,
  ArrowRight,
  Github,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  BarChart2,
  AlertTriangle,
  Zap,
  Layers,
  HeartPulse,
  Users,
  Award,
} from 'lucide-react';

export default function LandingPage() {
  const [showMetricsModal, setShowMetricsModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfd] dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 selection:bg-emerald-100 dark:selection:bg-emerald-950 selection:text-emerald-900 dark:selection:text-emerald-200 transition-colors duration-200">
      <Navbar mode="landing" onOpenMetrics={() => setShowMetricsModal(true)} />

      <main className="flex-1 space-y-16 sm:space-y-24 pb-16">
        
        {/* ========================================================= */}
        {/* SECTION 1: HERO SECTION (One screen aware at 1440x900)    */}
        {/* ========================================================= */}
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headline, Copy & CTAs (Span 7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Anti-Slop Headline */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                  ตรวจจับข่าวสุขภาพปลอม <br className="hidden sm:inline" />
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ด้วยปัญญาประดิษฐ์ภาษาไทย
                  </span>
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-zinc-300 max-w-xl font-normal leading-relaxed">
                  สถาปัตยกรรมโมเดลคู่ <strong>WangchanBERTa Fine-tuned</strong> ควบคู่กับ <strong>TF-IDF Baseline</strong> เพื่อการตรวจสอบข้อความสุขภาพและคำกล่าวอ้างเกินจริงแบบเรียลไทม์
                </p>
              </div>

              {/* Dual CTA Group */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/studio"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.98] transition-all group"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>เปิดห้องทดสอบ (Launch Studio)</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="https://github.com/PhuriphatTyPeZ3r0/thai-health-fakenews"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-3.5 text-sm font-semibold text-slate-700 dark:text-zinc-200 shadow-2xs hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white active:scale-[0.98] transition-all"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub Repository</span>
                </a>
              </div>

            </div>

            {/* Right Column: Hero Interactive Teaser Card (Span 5) */}
            <div className="lg:col-span-5">
              <HeroTeaserCard />
            </div>

          </div>
        </section>


        {/* ========================================================= */}
        {/* SECTION 2: WHY NLP & THE CHALLENGE                        */}
        {/* ========================================================= */}
        <section id="problem" className="container mx-auto max-w-7xl px-4 sm:px-6 pt-6">
          <div className="border-t border-zinc-200/80 dark:border-zinc-800/80 pt-14 space-y-8">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <HeartPulse className="h-4 w-4" />
                <span>The Challenge & Motivation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                ทำไมข่าวปลอมด้านสุขภาพจึงต้องใช้ NLP เข้ามาช่วยคัดกรอง?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                ข่าวปลอมและข้อมูลบิดเบือนด้านการแพทย์สร้างความเสียหายต่อชีวิตโดยตรง หากปล่อยให้การตรวจสอบพึ่งพาผู้เชี่ยวชาญเพียงอย่างเดียวจะไม่ทันต่ออัตราการแพร่กระจาย
              </p>
            </div>

            {/* 3 Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1 */}
              <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 space-y-3 shadow-2xs hover:-translate-y-0.5 transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  อันตรายถึงชีวิตจากการหยุดยา
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  ข่าวปลอมมักจูงใจให้ผู้ป่วยโรคเรื้อรัง (เช่น เบาหวาน มะเร็ง ไต) หยุดการรักษาแผนปัจจุบันไปรับประทานสมุนไพรที่ไม่ผ่านการรับรอง ส่งผลให้อาการทรุดหนัก
                </p>
              </div>

              {/* Card 2 */}
              <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 space-y-3 shadow-2xs hover:-translate-y-0.5 transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  โครงสร้างภาษาไทยที่ไร้ช่องไฟ
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  ข้อความภาษาไทยไม่มีการเว้นวรรคคำและมีคำกำกวมสูง ระบบแบบจับคำค้นหา (Keyword Matching) จึงเกิดข้อผิดพลาดได้ง่าย การใช้ Transformer ช่วยทำความเข้าใจบริบททั้งประโยค
                </p>
              </div>

              {/* Card 3 */}
              <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 space-y-3 shadow-2xs hover:-translate-y-0.5 transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  ความเร็วในการแพร่กระจายสูง
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  ข่าวสารในกลุ่มแชตและโซเชียลมียอดแชร์ต่อวันนับหมื่นข้อความ AI Inference Service ช่วยตรวจคัดกรองเบื้องต้นได้ทันทีในเวลาไม่ถึง 0.1 วินาที
                </p>
              </div>

            </div>
          </div>
        </section>


        {/* ========================================================= */}
        {/* SECTION 3: DUAL-MODEL ARCHITECTURE                        */}
        {/* ========================================================= */}
        <section id="models" className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="border-t border-zinc-200/80 dark:border-zinc-800/80 pt-14 space-y-8">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <Cpu className="h-4 w-4" />
                <span>Architecture & Innovation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                สถาปัตยกรรมโมเดลคู่ (Dual-Model Architecture)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                การนำโมเดล Deep Learning Transformer มาประเมินร่วมกับ Classical Machine Learning ช่วยเพิ่มความน่าเชื่อถือผ่านการ Cross-validate มติของโมเดล
              </p>
            </div>

            {/* Model Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Model 1: WangchanBERTa */}
              <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 bg-white dark:bg-zinc-900/80 p-6 space-y-4 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 rounded-bl-xl bg-emerald-600 text-white px-3 py-1 text-[10px] font-mono font-bold">
                  Main Model
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      WangchanBERTa Fine-tuned
                    </h3>
                    <p className="text-xs font-mono text-emerald-700 dark:text-emerald-400">
                      RoBERTa-based Thai Language Model
                    </p>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Pretrained:</strong> พัฒนาโดย VISTEC มีความเชี่ยวชาญไวยากรณ์และบริบทภาษาไทยขั้นสูง</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Tokenizer:</strong> SentencePiece (Unigram) ตัดคำและจัดการคำที่ไม่เคยพบ (OOV) ได้ยอดเยี่ยม</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Self-Attention:</strong> จับความเชื่อมโยงระยะไกลระหว่าง "ชื่อโรค" และ "คำอวดอ้างสรรพคุณเกินจริง"</span>
                  </li>
                </ul>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Macro F1: <strong className="text-emerald-600 dark:text-emerald-400">0.909</strong></span>
                  <span className="text-zinc-500">Fake F1: <strong className="text-emerald-600 dark:text-emerald-400">0.925</strong></span>
                  <span className="text-zinc-500">Accuracy: <strong className="text-emerald-600 dark:text-emerald-400">91.4%</strong></span>
                </div>
              </div>

              {/* Model 2: TF-IDF Baseline */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 space-y-4 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 rounded-bl-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1 text-[10px] font-mono font-bold">
                  Baseline
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    <BarChart2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      TF-IDF + Logistic Regression
                    </h3>
                    <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                      Classical Statistical Baseline
                    </p>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-zinc-500 dark:text-zinc-400 shrink-0 mt-0.5" />
                    <span><strong>N-gram Representation:</strong> แปลงข้อความเป็นเวกเตอร์ความถี่คำ (Term Frequency-Inverse Document Frequency)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-zinc-500 dark:text-zinc-400 shrink-0 mt-0.5" />
                    <span><strong>Linear Decision Boundary:</strong> จำแนกด้วย Logistic Regression น้ำหนักคำโปร่งใส ตรวจสอบง่าย</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-zinc-500 dark:text-zinc-400 shrink-0 mt-0.5" />
                    <span><strong>Ultra-low Latency:</strong> ใช้ทรัพยากรประมวลผลต่ำมาก (&lt;15ms) ทำหน้าที่เป็น Safety Guardrail</span>
                  </li>
                </ul>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Macro F1: <strong>0.812</strong></span>
                  <span className="text-zinc-500">Fake F1: <strong>0.830</strong></span>
                  <span className="text-zinc-500">Accuracy: <strong>82.5%</strong></span>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ========================================================= */}
        {/* SECTION 4: BENCHMARKS & EVALUATION                        */}
        {/* ========================================================= */}
        <section id="benchmark" className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="border-t border-zinc-200/80 dark:border-zinc-800/80 pt-14 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  <Award className="h-4 w-4" />
                  <span>Evaluation & Benchmark</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  ตารางเปรียบเทียบประสิทธิภาพบน LimeSoda Dataset
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                  วัดผลบนชุดทดสอบ (Test Set) ด้วย Stratified Split 80/10/10 พร้อมทดสอบจริงผ่าน 20 System Cases
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/40 px-3.5 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>20/20 Test Cases Pass (100%)</span>
              </div>
            </div>

            {/* Benchmark Table */}
            <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-2xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/50 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">เกณฑ์ประเมิน (Evaluation Metric)</th>
                    <th className="py-3.5 px-4 sm:px-6">TF-IDF Baseline</th>
                    <th className="py-3.5 px-4 sm:px-6 text-emerald-600 dark:text-emerald-400">
                      WangchanBERTa (Fine-tuned)
                    </th>
                    <th className="py-3.5 px-4 sm:px-6">ผลลัพธ์ที่ดีขึ้น (Delta)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80 font-mono">
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                    <td className="py-3 px-4 sm:px-6 font-sans font-semibold text-slate-900 dark:text-white">
                      Accuracy (ความถูกต้องโดยรวม)
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-slate-600 dark:text-zinc-400">82.5%</td>
                    <td className="py-3 px-4 sm:px-6 font-bold text-emerald-600 dark:text-emerald-400">91.4%</td>
                    <td className="py-3 px-4 sm:px-6 text-emerald-600 dark:text-emerald-400">+8.9%</td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                    <td className="py-3 px-4 sm:px-6 font-sans font-semibold text-slate-900 dark:text-white">
                      Precision (ความแม่นยำ)
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-slate-600 dark:text-zinc-400">81.2%</td>
                    <td className="py-3 px-4 sm:px-6 font-bold text-emerald-600 dark:text-emerald-400">90.8%</td>
                    <td className="py-3 px-4 sm:px-6 text-emerald-600 dark:text-emerald-400">+9.6%</td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                    <td className="py-3 px-4 sm:px-6 font-sans font-semibold text-slate-900 dark:text-white">
                      Recall (ความครอบคลุม)
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-slate-600 dark:text-zinc-400">80.4%</td>
                    <td className="py-3 px-4 sm:px-6 font-bold text-emerald-600 dark:text-emerald-400">91.0%</td>
                    <td className="py-3 px-4 sm:px-6 text-emerald-600 dark:text-emerald-400">+10.6%</td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                    <td className="py-3 px-4 sm:px-6 font-sans font-semibold text-slate-900 dark:text-white">
                      Macro F1-Score
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-slate-600 dark:text-zinc-400">0.812</td>
                    <td className="py-3 px-4 sm:px-6 font-bold text-emerald-600 dark:text-emerald-400">0.909</td>
                    <td className="py-3 px-4 sm:px-6 text-emerald-600 dark:text-emerald-400">+0.097</td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                    <td className="py-3 px-4 sm:px-6 font-sans font-semibold text-slate-900 dark:text-white">
                      Fake F1-Score (เน้นจับข่าวปลอม)
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-slate-600 dark:text-zinc-400">0.830</td>
                    <td className="py-3 px-4 sm:px-6 font-bold text-emerald-600 dark:text-emerald-400">0.925</td>
                    <td className="py-3 px-4 sm:px-6 text-emerald-600 dark:text-emerald-400">+0.095</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>


        {/* ========================================================= */}
        {/* SECTION 5: TEAM ROSTER (P1-P6)                            */}
        {/* ========================================================= */}
        <section id="team" className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="border-t border-zinc-200/80 dark:border-zinc-800/80 pt-14 space-y-8">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <Users className="h-4 w-4" />
                <span>Team Roster & Contributions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                ทีมงานผู้พัฒนาโครงงาน (NLP Mini Project)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                หลักสูตรปัญญาประดิษฐ์ประยุกต์ (CAI) คณะวิศวกรรมศาสตร์และเทคโนโลยี สถาบันการจัดการปัญญาภิวัฒน์
              </p>
            </div>

            {/* 6 Members Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* P1 */}
              <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-300">
                    P1 • Data Engineer
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">6752300135</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">ชลธร หรั่งศิริ</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  รับผิดชอบ LimeSoda Data Pipeline, Deduplication, และ Stratified Split (80/10/10)
                </p>
              </div>

              {/* P2 */}
              <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-300">
                    P2 • Baseline Engineer
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">6752300488</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">มิตรภักดิ์ กล่อมใจ</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  รับผิดชอบ Metrics Module (F1, Accuracy, Precision, Recall) และ TF-IDF Baseline Model
                </p>
              </div>

              {/* P3 */}
              <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300">
                    P3 • AI Engineer
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">6752300216</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">กฤษขจร จิรวงศ์รุ่งเรือง</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  รับผิดชอบ Fine-tuning WangchanBERTa บน Colab GPU และประเมินผล Main Model
                </p>
              </div>

              {/* P4 */}
              <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-300">
                    P4 • QA & Error Analyst
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">6752300607</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">ปรัชญา ชอบมะรัง</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  รับผิดชอบ System Testing 20 Test Cases, Model Comparison และ Error Analysis ≥20 เคส
                </p>
              </div>

              {/* P5 */}
              <div className="rounded-xl border border-emerald-200/90 dark:border-emerald-900/80 bg-emerald-50/30 dark:bg-emerald-950/20 p-4 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-mono font-bold">
                    P5 • Full Stack Engineer
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">6752300313</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">ภูริพัฒน์ เหมกุล</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  รับผิดชอบ Next.js 14 MVC/OOP WebApp, Dual-Model UI, Taste Skill Design, และ Modal GPU Service
                </p>
              </div>

              {/* P6 */}
              <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-300">
                    P6 • Project Lead & Doc
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">6752300968</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">เมธีรา ภูภักดี</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  รับผิดชอบ Repository Setup, README 4 หัวข้อหลัก, สไลด์นำเสนอ, และ Live Demo Rehearsal
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>

      <DisclaimerBanner />

      <MetricsSummaryModal
        isOpen={showMetricsModal}
        onClose={() => setShowMetricsModal(false)}
      />
    </div>
  );
}
