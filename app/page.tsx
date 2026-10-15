'use client';

import dynamic from 'next/dynamic';

const HomeClient = dynamic(() => import('@/components/HomeClient'), {
  ssr: false,
  loading: () => (
    <div
      suppressHydrationWarning
      className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100"
    >
      <div className="flex flex-col items-center gap-3" suppressHydrationWarning>
        <div className="w-10 h-10 border-4 border-bear-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-stone-500">
          جاري تشغيل منصة مستشار الدب الذكي...
        </p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  return <HomeClient />;
}
