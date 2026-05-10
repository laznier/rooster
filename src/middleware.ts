import { NextResponse, type NextRequest } from 'next/server';

/**
 * Lock admin surfaces to local development.
 *   /admin/*                      — admin UI shell
 *   /api/validation/invites       — invite management
 *   /api/validation/export        — bulk export
 *   /api/validation/usage         — LLM usage stats
 *
 * On Vercel (any non-local deploy), these return 404 so the surface is
 * invisible. Public endpoints (start / intake / chat / summarize / confirm)
 * are unaffected — those serve real respondents in production.
 */
const LOCAL_ONLY_PREFIXES = [
  '/admin',
  '/api/validation/invites',
  '/api/validation/export',
  '/api/validation/usage',
  '/api/validation/risk-rollup',
  '/api/validation/mitigations',
];

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (!LOCAL_ONLY_PREFIXES.some((p) => path === p || path.startsWith(p + '/'))) {
    return NextResponse.next();
  }
  const onVercel = !!process.env.VERCEL || !!process.env.VERCEL_ENV;
  if (onVercel) {
    return new NextResponse('Not Found', { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/validation/invites/:path*',
    '/api/validation/export/:path*',
    '/api/validation/usage/:path*',
    '/api/validation/risk-rollup/:path*',
    '/api/validation/mitigations/:path*',
  ],
};

