import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ensureSchema, sql } from '@/lib/db';
import { isAdminAuthorized } from '@/lib/validation/auth';
import { RISKS } from '@/lib/validation/risks';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PutSchema = z.object({
  risk_id: z.enum(['R1', 'R2', 'R3', 'R4', 'R5']),
  current_assessment: z.string().max(4000).optional(),
  mitigation_plan: z.string().max(4000).optional(),
  next_experiment: z.string().max(2000).optional(),
  owner: z.string().max(120).optional(),
  status: z.enum(['open', 'in_progress', 'mitigated', 'accepted', 'transferred']).optional(),
});

/**
 * GET  /api/validation/mitigations           — list all 5 (creates blanks if missing)
 * PUT  /api/validation/mitigations           — upsert one row by risk_id
 *
 * Local-admin only (gated by middleware + isAdminAuthorized).
 */
export async function GET(req: Request) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  try {
    await ensureSchema();
    // Make sure a row exists for each defined risk so the UI always has 5.
    for (const r of RISKS) {
      await sql`
        INSERT INTO validation_risk_mitigations (risk_id) VALUES (${r.id})
        ON CONFLICT (risk_id) DO NOTHING;
      `;
    }
    const rows = await sql`
      SELECT risk_id, current_assessment, mitigation_plan, next_experiment,
             owner, status, updated_at
      FROM validation_risk_mitigations
      ORDER BY risk_id;
    `;
    return NextResponse.json({ mitigations: rows.rows });
  } catch (err) {
    console.error('[validation/mitigations GET]', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  try {
    await ensureSchema();
    const body = await req.json().catch(() => ({}));
    const parsed = PutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'invalid_input', details: parsed.error.flatten() }, { status: 400 });
    }
    const d = parsed.data;
    await sql`
      INSERT INTO validation_risk_mitigations
        (risk_id, current_assessment, mitigation_plan, next_experiment, owner, status, updated_at)
      VALUES
        (${d.risk_id},
         ${d.current_assessment ?? ''},
         ${d.mitigation_plan ?? ''},
         ${d.next_experiment ?? ''},
         ${d.owner ?? ''},
         ${d.status ?? 'open'},
         NOW())
      ON CONFLICT (risk_id) DO UPDATE SET
        current_assessment = COALESCE(${d.current_assessment ?? null}, validation_risk_mitigations.current_assessment),
        mitigation_plan    = COALESCE(${d.mitigation_plan ?? null},    validation_risk_mitigations.mitigation_plan),
        next_experiment    = COALESCE(${d.next_experiment ?? null},    validation_risk_mitigations.next_experiment),
        owner              = COALESCE(${d.owner ?? null},              validation_risk_mitigations.owner),
        status             = COALESCE(${d.status ?? null},             validation_risk_mitigations.status),
        updated_at         = NOW();
    `;
    const row = await sql`
      SELECT risk_id, current_assessment, mitigation_plan, next_experiment,
             owner, status, updated_at
      FROM validation_risk_mitigations WHERE risk_id = ${d.risk_id};
    `;
    return NextResponse.json({ mitigation: row.rows[0] });
  } catch (err) {
    console.error('[validation/mitigations PUT]', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
