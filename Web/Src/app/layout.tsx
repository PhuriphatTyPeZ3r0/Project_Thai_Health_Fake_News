import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Thai Health Fake-News Detector | 1323404 NLP Mini Project',
  description: 'Thai Health Fake-News Detection using fine-tuned WangchanBERTa and TF-IDF Baseline with Next.js MVC OOP architecture.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="antialiased min-h-screen bg-slate-50">{children}</body>
    </html>
  );
}
