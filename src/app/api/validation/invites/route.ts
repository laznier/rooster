import { NextResponse } from 'next/server';
import { ensureSchema, sql } from '@/lib/db';
import { z } from 'zod';
import { isAdminAuthorized } from '@/lib/validation/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Admin-only invite management.
 *   GET    /api/validation/invites              -> list
 *   POST   /api/validation/invites              -> create   { token?, label? }
 *   PATCH  /api/validation/invites              -> toggle   { token, active }
 *   DELETE /api/validation/invites?token=...    -> remove
 * Require: Authorization: Bearer <VALIDATION_ADMIN_TOKEN> (skipped in local env)
 */

const CreateSchema = z.object({
  token: z.string().trim().min(3).max(128).regex(/^[A-Za-z0-9._-]+$/, 'token must be alphanumeric / . _ -').optional(),
  label: z.string().trim().max(200).optional(),
});

const PatchSchema = z.object({
  token: z.string().trim().min(1).max(128),
  active: z.boolean(),
});

function authorized(req: Request): boolean {
  return isAdminAuthorized(req);
}

function unauth() {
  return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
}

export async function GET(req: Request) {
  if (!authorized(req)) return unauth();
  try {
    await ensureSchema();
    const rows = await sql`
      SELECT i.token, i.label, i.active, i.used_count, i.created_at,
             COUNT(s.id)::int                                            AS sessions_started,
             COUNT(s.id) FILTER (WHERE s.completed_at IS NOT NULL)::int  AS sessions_completed
      FROM validation_invites i
      LEFT JOIN validation_sessions s ON s.invite_token = i.token
      GROUP BY i.token
      ORDER BY i.created_at DESC;
    `;
    return NextResponse.json({ invites: rows.rows });
  } catch (err) {
    console.error('[validation/invites GET]', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!authorized(req)) return unauth();
  try {
    await ensureSchema();
    const body = await req.json().catch(() => ({}));
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'invalid_input', details: parsed.error.flatten() }, { status: 400 });
    }
    const token = (parsed.data.token ?? randomToken()).toLowerCase();
    const label = parsed.data.label ?? null;

    const exists = await sql`SELECT 1 FROM validation_invites WHERE token = ${token} LIMIT 1;`;
    if (exists.rows.length > 0) {
      return NextResponse.json({ error: 'token_exists' }, { status: 409 });
    }
    await sql`INSERT INTO validation_invites (token, label) VALUES (${token}, ${label});`;
    return NextResponse.json({ token, label, active: true, used_count: 0 });
  } catch (err) {
    console.error('[validation/invites POST]', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!authorized(req)) return unauth();
  try {
    await ensureSchema();
    const body = await req.json().catch(() => ({}));
    const parsed = PatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
    }
    const { token, active } = parsed.data;
    const r = await sql`
      UPDATE validation_invites SET active = ${active} WHERE token = ${token} RETURNING token;
    `;
    if (r.rows.length === 0) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[validation/invites PATCH]', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!authorized(req)) return unauth();
  try {
    await ensureSchema();
    const url = new URL(req.url);
    const token = (url.searchParams.get('token') || '').trim();
    if (!token) return NextResponse.json({ error: 'invalid_input' }, { status: 400 });

    // Refuse to hard-delete if any sessions reference it (preserve audit trail).
    const used = await sql`SELECT 1 FROM validation_sessions WHERE invite_token = ${token} LIMIT 1;`;
    if (used.rows.length > 0) {
      return NextResponse.json({ error: 'in_use', hint: 'deactivate instead' }, { status: 409 });
    }
    const r = await sql`DELETE FROM validation_invites WHERE token = ${token} RETURNING token;`;
    if (r.rows.length === 0) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[validation/invites DELETE]', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

function randomToken(): string {
  const bytes = new Uint8Array(9);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString('base64url').toLowerCase();
}
