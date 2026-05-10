import { NextResponse } from 'next/server';
import { ensureSchema, sql } from '@/lib/db';
import { isAdminAuthorized } from '@/lib/validation/auth';
import { buildRollups, type SessionForRollup } from '@/lib/validation/rollup';
import type { RiskAssessmentMap } from '@/lib/validation/risks';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/validation/risk-rollup
 * Authorization: admin (local-only via middleware).
 *
 * Returns the weighted Probability × Impact baseline + Monte Carlo PERT
 * aggregates per risk, plus top supporting / disconfirming quotes. This is
 * the chart payload for the admin Risk Baseline view.
 */
export async function GET(req: Request) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  try {
    await ensureSchema();
    const rows = await sql`
      SELECT id, role_category, sensitive_info_flag, risk_assessments
      FROM validation_sessions
      WHERE risk_assessments IS NOT NULL
        AND risk_assessments::text <> '{}'
    `;
    const sessions: SessionForRollup[] = rows.rows.map((r) => ({
      id: r.id as string,
      role_category: r.role_category as string | null,
      sensitive_info_flag: !!r.sensitive_info_flag,
      risk_assessments: (r.risk_assessments ?? null) as RiskAssessmentMap | null,
    }));

    const rollups = buildRollups(sessions);
    return NextResponse.json({
      sessions_considered: sessions.length,
      generated_at: new Date().toISOString(),
      rollups,
    });
  } catch (err) {
    console.error('[validation/risk-rollup]', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
