import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ensureSchema, sql } from '@/lib/db';
import { RISKS, type RiskAssessmentMap, type RiskId, emptyAssessment } from '@/lib/validation/risks';
import { mergeAssessments } from '@/lib/validation/risk-merge';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RiskAnswer = z.object({
  relevant: z.boolean(),
  p_failure_1_7: z.number().int().min(1).max(7).nullable().optional(),
  impact_1_7: z.number().int().min(1).max(7).nullable().optional(),
  confidence_1_5: z.number().int().min(1).max(5).nullable().optional(),
  pert_min: z.number().nullable().optional(),
  pert_likely: z.number().nullable().optional(),
  pert_max: z.number().nullable().optional(),
});

const RiskSurveySchema = z.object({
  sessionId: z.string().min(1).max(64),
  answers: z.record(z.enum(['R1', 'R2', 'R3', 'R4', 'R5']), RiskAnswer),
});

/**
 * POST /api/validation/risk-survey
 * Body: { sessionId, answers: { R1: {...}, R2: {...}, ... } }
 *
 * Persists the respondent's calibrated micro-survey answers into the
 * session's risk_assessments JSONB. Merged in (does not clobber LLM-extracted
 * evidence quotes that may have been added later by the summarizer).
 */
export async function POST(req: Request) {
  try {
    await ensureSchema();
    const body = await req.json().catch(() => ({}));
    const parsed = RiskSurveySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'invalid_input', details: parsed.error.flatten() }, { status: 400 });
    }
    const { sessionId, answers } = parsed.data;

    const cur = await sql`
      SELECT risk_assessments FROM validation_sessions WHERE id = ${sessionId} LIMIT 1;
    `;
    if (cur.rows.length === 0) {
      return NextResponse.json({ error: 'session_not_found' }, { status: 404 });
    }
    const prior: RiskAssessmentMap = (cur.rows[0].risk_assessments ?? {}) as RiskAssessmentMap;

    const surveyMap: RiskAssessmentMap = {};
    for (const r of RISKS) {
      const id = r.id as RiskId;
      const a = answers[id];
      if (!a) continue;
      surveyMap[id] = {
        ...emptyAssessment(),
        relevant: a.relevant,
        p_failure_1_7: a.p_failure_1_7 ?? null,
        impact_1_7: a.impact_1_7 ?? null,
        confidence_1_5: a.confidence_1_5 ?? null,
        pert_min: a.pert_min ?? null,
        pert_likely: a.pert_likely ?? null,
        pert_max: a.pert_max ?? null,
        evidence_quotes: prior[id]?.evidence_quotes ?? [],
        disconfirming_quotes: prior[id]?.disconfirming_quotes ?? [],
        source: 'survey',
      };
    }

    // Survey is authoritative for numeric fields; merge with anything already
    // stored (LLM extraction would only run later in /summarize, so usually
    // prior is empty here, but the merge is still correct if /summarize ran
    // first).
    const merged = mergeAssessments(surveyMap, prior);

    await sql`
      UPDATE validation_sessions SET
        risk_assessments = ${JSON.stringify(merged)}::jsonb
      WHERE id = ${sessionId};
    `;

    return NextResponse.json({ ok: true, risk_assessments: merged });
  } catch (err) {
    console.error('[validation/risk-survey]', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
