import { NextResponse } from 'next/server';
import { ensureSchema, sql } from '@/lib/db';
import { SummarizeSchema } from '@/lib/validation/schema';
import { getProvider, type ChatMessage, type InterviewContext } from '@/lib/llm';
import { mergeAssessments } from '@/lib/validation/risk-merge';
import type { RiskAssessmentMap } from '@/lib/validation/risks';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    await ensureSchema();
    const body = await req.json().catch(() => ({}));
    const parsed = SummarizeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
    }
    const { sessionId } = parsed.data;

    const row = await sql`
      SELECT id, transcript, summary_text, summary_struct,
             role_category, experience_level, relationship,
             risk_assessments
      FROM validation_sessions WHERE id = ${sessionId} LIMIT 1;
    `;
    if (row.rows.length === 0) {
      return NextResponse.json({ error: 'session_not_found' }, { status: 404 });
    }
    const s = row.rows[0];

    // Idempotent: if summary already exists, return it.
    if (s.summary_text && s.summary_struct) {
      return NextResponse.json({
        summary_text: s.summary_text,
        summary_struct: s.summary_struct,
      });
    }

    const transcript: ChatMessage[] = Array.isArray(s.transcript) ? s.transcript : [];
    if (transcript.filter((m) => m.role === 'user').length < 1) {
      return NextResponse.json({ error: 'transcript_empty' }, { status: 400 });
    }

    const ctx: InterviewContext = {
      roleCategory: s.role_category,
      experienceLevel: s.experience_level,
      relationship: s.relationship,
    };

    const { summary_text, summary_struct, usage } = await getProvider().extractValidationSummary(
      transcript,
      ctx,
    );

    // Merge: micro-survey answers (already in DB column) take precedence
    // over LLM extraction for numeric fields, but LLM evidence quotes are
    // preserved.
    const priorRisk = (s.risk_assessments ?? {}) as RiskAssessmentMap;
    const mergedRisk = mergeAssessments(priorRisk, summary_struct.risk_assessments);

    await sql`
      UPDATE validation_sessions SET
        summary_text        = ${summary_text},
        summary_struct      = ${JSON.stringify({ ...summary_struct, risk_assessments: mergedRisk })}::jsonb,
        risk_assessments    = ${JSON.stringify(mergedRisk)}::jsonb,
        sensitive_info_flag = ${Boolean(summary_struct.sensitive_info_flag)},
        tokens_in           = tokens_in  + ${usage.prompt_tokens},
        tokens_out          = tokens_out + ${usage.completion_tokens},
        llm_calls           = llm_calls  + 1
      WHERE id = ${sessionId};
    `;

    return NextResponse.json({
      summary_text,
      summary_struct: { ...summary_struct, risk_assessments: mergedRisk },
    });
  } catch (err) {
    console.error('[validation/summarize]', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
