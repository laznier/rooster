import { NextResponse } from 'next/server';
import { ensureSchema, sql } from '@/lib/db';
import { isAdminAuthorized } from '@/lib/validation/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/validation/usage
 * Authorization: Bearer <VALIDATION_ADMIN_TOKEN> (skipped in local env)
 *
 * Aggregate LLM token usage across sessions. Local-only (gated by middleware).
 */
export async function GET(req: Request) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    await ensureSchema();
    const totals = await sql`
      SELECT
        COUNT(*)::int                                                    AS sessions,
        COALESCE(SUM(llm_calls), 0)::int                                 AS llm_calls,
        COALESCE(SUM(tokens_in), 0)::int                                 AS tokens_in,
        COALESCE(SUM(tokens_out), 0)::int                                AS tokens_out,
        COALESCE(SUM(tokens_in + tokens_out), 0)::int                    AS tokens_total
      FROM validation_sessions;
    `;
    const last24h = await sql`
      SELECT
        COUNT(*)::int                                                    AS sessions,
        COALESCE(SUM(llm_calls), 0)::int                                 AS llm_calls,
        COALESCE(SUM(tokens_in + tokens_out), 0)::int                    AS tokens_total
      FROM validation_sessions
      WHERE started_at > NOW() - INTERVAL '24 hours';
    `;
    const last7d = await sql`
      SELECT
        COUNT(*)::int                                                    AS sessions,
        COALESCE(SUM(llm_calls), 0)::int                                 AS llm_calls,
        COALESCE(SUM(tokens_in + tokens_out), 0)::int                    AS tokens_total
      FROM validation_sessions
      WHERE started_at > NOW() - INTERVAL '7 days';
    `;

    return NextResponse.json({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      provider: process.env.LLM_PROVIDER || 'openai',
      totals: totals.rows[0],
      last_24h: last24h.rows[0],
      last_7d: last7d.rows[0],
    });
  } catch (err) {
    console.error('[validation/usage]', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
