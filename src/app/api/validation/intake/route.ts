import { NextResponse } from 'next/server';
import { ensureSchema, sql } from '@/lib/db';
import { IntakeSchema } from '@/lib/validation/schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    await ensureSchema();
    const body = await req.json().catch(() => ({}));
    const parsed = IntakeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'invalid_input', details: parsed.error.flatten() }, { status: 400 });
    }
    const d = parsed.data;

    const result = await sql`
      UPDATE validation_sessions SET
        consent_confirmed = ${d.consent},
        video_started     = ${d.videoStarted},
        video_completed   = ${d.videoCompleted},
        video_pct         = ${d.videoPct},
        role_category     = ${d.roleCategory ?? null},
        experience_level  = ${d.experienceLevel ?? null},
        relationship      = ${d.relationship ?? null},
        name              = ${d.name ?? null},
        email             = ${d.email ?? null},
        followup_consent  = ${Boolean(d.followupConsent)}
      WHERE id = ${d.sessionId}
      RETURNING id;
    `;
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'session_not_found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[validation/intake]', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
