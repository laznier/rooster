'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

/**
 * Renders the site footer everywhere EXCEPT the validation interview surface,
 * which is intentionally minimal so respondents aren't distracted by marketing
 * links during the consent → video → interview flow.
 */
export function ConditionalFooter() {
  const pathname = usePathname() || '';
  if (pathname.startsWith('/validation')) return null;
  return <Footer />;
}
