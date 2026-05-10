import { NextResponse } from 'next/server';
import { ensureSchema, sql } from '@/lib/db';
import { StartSchema } from '@/lib/validation/schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    await ensureSchema();
    const body = await req.json().catch(() => ({}));
    const parsed = StartSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
    }
    const { invite } = parsed.data;

    const inv = await sql`
      SELECT token, active FROM validation_invites WHERE token = ${invite} LIMIT 1;
    `;
    if (inv.rows.length === 0 || !inv.rows[0].active) {
      return NextResponse.json({ error: 'invalid_invite' }, { status: 403 });
    }

    const id = cryptoRandomId();
    await sql`
      INSERT INTO validation_sessions (id, invite_token)
      VALUES (${id}, ${invite});
    `;
    await sql`
      UPDATE validation_invites SET used_count = used_count + 1 WHERE token = ${invite};
    `;
    return NextResponse.json({ sessionId: id });
  } catch (err) {
    console.error('[validation/start]', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

function cryptoRandomId(): string {
  // 22-char URL-safe id (~128 bits of entropy)
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString('base64url');
}
