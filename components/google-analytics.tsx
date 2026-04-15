'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function AnalyticsTracker({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      
      // Ensure window.gtag exists before calling it
      if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        (window as any).gtag('config', gaId, {
          page_path: url,
        });
      }
    }
  }, [pathname, searchParams, gaId]);

  return null;
}

export function GoogleAnalyticsPageView({ gaId }: { gaId: string }) {
  return (
    <Suspense fallback={null}>
      <AnalyticsTracker gaId={gaId} />
    </Suspense>
  );
}
