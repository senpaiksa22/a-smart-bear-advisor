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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Clean up Bitdefender TrafficLight extension attributes before hydration
              (function() {
                try {
                  const clean = function() {
                    const els = document.querySelectorAll('[bis_skin_checked]');
                    for (let i = 0; i < els.length; i++) {
                      els[i].removeAttribute('bis_skin_checked');
                    }
                  };
                  clean();
                  const obs = new MutationObserver(function(muts) {
                    for (let i = 0; i < muts.length; i++) {
                      const m = muts[i];
                      if (m.type === 'attributes' && m.attributeName === 'bis_skin_checked') {
                        m.target.removeAttribute('bis_skin_checked');
                      }
                    }
                  });
                  obs.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['bis_skin_checked'] });
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 antialiased selection:bg-bear-500/20 selection:text-bear-800 dark:selection:text-bear-200"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
