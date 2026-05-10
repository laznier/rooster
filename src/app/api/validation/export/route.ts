import { NextResponse } from 'next/server';
import { ensureSchema, sql } from '@/lib/db';
import { isAdminAuthorized } from '@/lib/validation/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Admin-only review + export endpoint.
 *   GET /api/validation/export?format=json|csv
 *   Authorization: Bearer <VALIDATION_ADMIN_TOKEN> (skipped in local env)
 */
export async function GET(req: Request) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    await ensureSchema();
    const url = new URL(req.url);
    const format = (url.searchParams.get('format') || 'json').toLowerCase();

    const rows = await sql`
      SELECT id, invite_token, started_at, completed_at, consent_confirmed,
             video_started, video_completed, video_pct,
             role_category, experience_level, relationship,
             name, email, followup_consent,
             transcript, summary_text, summary_struct,
             summary_confirmed, summary_user_edits, sensitive_info_flag,
             tokens_in, tokens_out, llm_calls
      FROM validation_sessions
      ORDER BY started_at DESC;
    `;

    if (format === 'csv') {
      const csv = toCsv(rows.rows);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="rooster-validation-${stamp()}.csv"`,
        },
      });
    }

    return NextResponse.json({ count: rows.rows.length, sessions: rows.rows });
  } catch (err) {
    console.error('[validation/export]', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

function stamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';
  const flat = rows.map((r) => {
    const struct = (r.summary_struct ?? {}) as Record<string, unknown>;
    return {
      id: r.id,
      invite_token: r.invite_token,
      started_at: r.started_at,
      completed_at: r.completed_at,
      consent_confirmed: r.consent_confirmed,
      video_started: r.video_started,
      video_completed: r.video_completed,
      video_pct: r.video_pct,
      role_category: r.role_category,
      experience_level: r.experience_level,
      relationship: r.relationship,
      name: r.name,
      email: r.email,
      followup_consent: r.followup_consent,
      summary_confirmed: r.summary_confirmed,
      sensitive_info_flag: r.sensitive_info_flag,
      tokens_in: r.tokens_in,
      tokens_out: r.tokens_out,
      llm_calls: r.llm_calls,
      summary_text: r.summary_text,
      problem_understanding: struct.problem_understanding ?? '',
      pain_score_1_7: struct.pain_score_1_7 ?? '',
      current_alternatives: struct.current_alternatives ?? '',
      most_valuable_feature: struct.most_valuable_feature ?? '',
      least_convincing_part: struct.least_convincing_part ?? '',
      main_objection: struct.main_objection ?? '',
      security_or_deployment_concerns: struct.security_or_deployment_concerns ?? '',
      assessment_trust_concerns: struct.assessment_trust_concerns ?? '',
      buyer_or_sponsor_clue: struct.buyer_or_sponsor_clue ?? '',
      pilot_interest_1_7: struct.pilot_interest_1_7 ?? '',
      willing_followup: struct.willing_followup ?? '',
      followup_type: struct.followup_type ?? '',
      evidence_strength: struct.evidence_strength ?? '',
      summary_user_edits: r.summary_user_edits,
      transcript_json: JSON.stringify(r.transcript ?? []),
    };
  });
  const headers = Object.keys(flat[0]);
  const escape = (v: unknown): string => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [headers.join(',')];
  for (const r of flat) lines.push(headers.map((h) => escape((r as Record<string, unknown>)[h])).join(','));
  return lines.join('\n');
}
