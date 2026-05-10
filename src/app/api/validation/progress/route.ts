import { NextResponse } from 'next/server';
import { ensureSchema, sql } from '@/lib/db';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Lightweight partial-save endpoint so we don't lose progress when a
 * respondent bails out mid-flow (e.g. after consent / part-way through the
 * video, before they ever submit the intake form).
 *
 * The chat endpoint already saves the transcript on every send; the intake
 * endpoint saves the full intake on submit. This endpoint fills the gap.
 */
const ProgressSchema = z.object({
  sessionId: z.string().min(1).max(64),
  consent: z.boolean().optional(),
  videoStarted: z.boolean().optional(),
  videoCompleted: z.boolean().optional(),
  videoPct: z.number().int().min(0).max(100).optional(),
});

export async function POST(req: Request) {
  try {
    await ensureSchema();
    const body = await req.json().catch(() => ({}));
    const parsed = ProgressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
    }
    const { sessionId, consent, videoStarted, videoCompleted, videoPct } = parsed.data;

    // Build a single UPDATE using COALESCE so we only touch fields the caller
    // actually sent. video_pct is monotonic — never go backwards.
    const result = await sql`
      UPDATE validation_sessions SET
        consent_confirmed = COALESCE(${consent ?? null}, consent_confirmed),
        video_started     = COALESCE(${videoStarted ?? null}, video_started),
        video_completed   = COALESCE(${videoCompleted ?? null}, video_completed),
        video_pct         = GREATEST(video_pct, COALESCE(${videoPct ?? null}, video_pct))
      WHERE id = ${sessionId}
      RETURNING id;
    `;
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'session_not_found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[validation/progress]', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
