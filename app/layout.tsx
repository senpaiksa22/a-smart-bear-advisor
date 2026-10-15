import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asmartbear-advisor.vercel.app';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#dfd6c5' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0d14' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'مستشار الدب الذكي | A Smart Bear Advisor',
    template: '%s | مستشار الدب الذكي',
  },
  description:
    'المنصة الاستراتيجية والمعرفية المستندة إلى فكر وتجارب جيسون كوهين (مؤسس WP Engine و Smart Bear) — أكثر من 213 مقالاً ونموذجاً فكرياً ومستشار ذكي مباشر لرواد الأعمال.',
  keywords: [
    'جيسون كوهين',
    'A Smart Bear',
    'Jason Cohen',
    'ريادة الأعمال',
    'WP Engine',
    'Smart Bear Software',
    'SaaS',
    'التسعير',
    'ملاءمة المنتج للسوق',
    'PMF',
    'التمويل الذاتي',
    'Bootstrapping',
    'رأس المال الجريء',
    'Venture Capital',
    'النماذج الفكرية',
    'Mental Models',
    'الشركات الناشئة',
  ],
  authors: [{ name: 'Jason Cohen' }, { name: 'A Smart Bear Advisor' }],
  creator: 'A Smart Bear Advisor',
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: 'en_US',
    url: siteUrl,
    title: 'مستشار الدب الذكي | A Smart Bear Advisor',
    description:
      'الخلاصة التنفيذية لأكثر من 20 عاماً في بناء الشركات البرمجية من الصفر إلى اليونيكورن. 213 مقالاً استراتيجياً مترجماً ومستشار ذكاء اصطناعي تفاعلي.',
    siteName: 'A Smart Bear Advisor',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'مستشار الدب الذكي | A Smart Bear Advisor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مستشار الدب الذكي | A Smart Bear Advisor',
    description:
      'فلسفة واستراتيجيات جيسون كوهين لريادة الأعمال وبناء شركات برمجية مستدامة.',
    creator: '@asmartbear',
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'ar-SA': siteUrl,
      'en-US': `${siteUrl}/?lang=en`,
    },
  },
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
