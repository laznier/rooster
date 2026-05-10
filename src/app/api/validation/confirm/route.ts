import { NextResponse } from 'next/server';
import { ensureSchema, sql } from '@/lib/db';
import { ConfirmSchema } from '@/lib/validation/schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    await ensureSchema();
    const body = await req.json().catch(() => ({}));
    const parsed = ConfirmSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
    }
    const { sessionId, confirmed, edits } = parsed.data;

    const result = await sql`
      UPDATE validation_sessions SET
        summary_confirmed  = ${confirmed},
        summary_user_edits = ${edits ?? null},
        completed_at       = NOW()
      WHERE id = ${sessionId}
      RETURNING id;
    `;
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'session_not_found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[validation/confirm]', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
