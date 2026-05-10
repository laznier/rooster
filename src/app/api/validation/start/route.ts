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

    // Resume the most recent in-progress session for this invite, if any.
    // "In progress" = no completed_at AND not yet final-confirmed. This way a
    // friend who closed the tab partway through (or refreshes the page) picks
    // up exactly where they left off instead of starting a fresh row.
    const existing = await sql`
      SELECT id, consent_confirmed, video_started, video_completed, video_pct,
             role_category, experience_level, relationship,
             name, email, followup_consent,
             transcript, summary_text, summary_struct, summary_confirmed
      FROM validation_sessions
      WHERE invite_token = ${invite}
        AND completed_at IS NULL
        AND summary_confirmed = FALSE
      ORDER BY started_at DESC
      LIMIT 1;
    `;

    if (existing.rows.length > 0) {
      const s = existing.rows[0] as unknown as SessionRow;
      return NextResponse.json({
        sessionId: s.id,
        resumed: true,
        state: buildState(s),
      });
    }

    const id = cryptoRandomId();
    await sql`
      INSERT INTO validation_sessions (id, invite_token)
      VALUES (${id}, ${invite});
    `;
    await sql`
      UPDATE validation_invites SET used_count = used_count + 1 WHERE token = ${invite};
    `;
    return NextResponse.json({ sessionId: id, resumed: false, state: emptyState() });
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

interface SessionRow {
  id: string;
  consent_confirmed: boolean;
  video_started: boolean;
  video_completed: boolean;
  video_pct: number;
  role_category: string | null;
  experience_level: string | null;
  relationship: string | null;
  name: string | null;
  email: string | null;
  followup_consent: boolean;
  transcript: unknown;
  summary_text: string | null;
  summary_struct: unknown;
  summary_confirmed: boolean;
}

function buildState(s: SessionRow) {
  const transcript = Array.isArray(s.transcript) ? s.transcript : [];
  return {
    consent: !!s.consent_confirmed,
    videoStarted: !!s.video_started,
    videoCompleted: !!s.video_completed,
    videoPct: s.video_pct ?? 0,
    intake: {
      roleCategory: s.role_category ?? '',
      experienceLevel: s.experience_level ?? '',
      relationship: s.relationship ?? '',
      name: s.name ?? '',
      email: s.email ?? '',
      followupConsent: !!s.followup_consent,
    },
    transcript,
    summaryText: s.summary_text ?? '',
    summaryStruct: s.summary_struct ?? null,
    summaryConfirmed: !!s.summary_confirmed,
  };
}

function emptyState() {
  return {
    consent: false,
    videoStarted: false,
    videoCompleted: false,
    videoPct: 0,
    intake: {
      roleCategory: '',
      experienceLevel: '',
      relationship: '',
      name: '',
      email: '',
      followupConsent: false,
    },
    transcript: [],
    summaryText: '',
    summaryStruct: null,
    summaryConfirmed: false,
  };
}
