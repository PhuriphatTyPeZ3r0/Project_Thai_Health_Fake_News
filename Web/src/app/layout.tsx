import type { Metadata } from 'next';
import { Prompt, Inter } from 'next/font/google';
import { ThemeProvider } from '@/Components/Theme_Provider';
import './globals.css';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-prompt',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Thai Health Fake-News Detector | 1323404 NLP Mini Project',
  description: 'Thai Health Fake-News Detection using fine-tuned WangchanBERTa and TF-IDF Baseline with Next.js MVC OOP architecture.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning className={`${prompt.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen bg-[#fcfdfd] text-slate-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
