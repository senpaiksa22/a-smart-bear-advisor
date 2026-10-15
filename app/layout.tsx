import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'A Smart Bear Advisor | مستشار الدب الذكي',
  description:
    'High-security, multi-user AI Knowledge Base & Advisor based on Jason Cohen longform philosophy and startup essays.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth" suppressHydrationWarning>
      <body
        className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 antialiased selection:bg-bear-500/20 selection:text-bear-800 dark:selection:text-bear-200"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
