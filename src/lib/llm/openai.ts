import OpenAI from 'openai';
import type {
  ChatMessage,
  InterviewContext,
  LLMProvider,
  SummaryResult,
  ValidationSummaryStruct,
} from './types';
import {
  INTERVIEWER_SYSTEM_PROMPT,
  SUMMARY_JSON_SCHEMA,
  SUMMARY_SYSTEM_PROMPT,
  buildContextPreface,
} from './prompts';

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

function client(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  return new OpenAI({ apiKey });
}

export const openaiProvider: LLMProvider = {
  async generateInterviewReply(
    messages: ChatMessage[],
    context: InterviewContext,
  ): Promise<string> {
    const preface = buildContextPreface(context);
    const sys: ChatMessage = {
      role: 'system',
      content: preface
        ? `${INTERVIEWER_SYSTEM_PROMPT}\n\n${preface}`
        : INTERVIEWER_SYSTEM_PROMPT,
    };

    const resp = await client().chat.completions.create({
      model: MODEL,
      temperature: 0.4,
      messages: [sys, ...messages],
    });
    const text = resp.choices[0]?.message?.content?.trim();
    if (!text) throw new Error('Empty LLM response');
    return text;
  },

  async extractValidationSummary(
    transcript: ChatMessage[],
    context: InterviewContext,
  ): Promise<SummaryResult> {
    const preface = buildContextPreface(context);
    const transcriptText = transcript
      .filter((m) => m.role !== 'system')
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n');

    const userPrompt = [
      preface,
      'Schema (JSON Schema):',
      JSON.stringify(SUMMARY_JSON_SCHEMA),
      '',
      'Transcript:',
      transcriptText,
    ]
      .filter(Boolean)
      .join('\n\n');

    const resp = await client().chat.completions.create({
      model: MODEL,
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SUMMARY_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
    });

    const raw = resp.choices[0]?.message?.content?.trim();
    if (!raw) throw new Error('Empty summary response');

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error('Summary response was not valid JSON');
    }

    const summary_text = String(parsed.summary_text ?? '');
    const struct: ValidationSummaryStruct = {
      problem_understanding: String(parsed.problem_understanding ?? ''),
      pain_score_1_7: toIntOrNull(parsed.pain_score_1_7, 1, 7),
      current_alternatives: String(parsed.current_alternatives ?? ''),
      most_valuable_feature: String(parsed.most_valuable_feature ?? ''),
      least_convincing_part: String(parsed.least_convincing_part ?? ''),
      main_objection: String(parsed.main_objection ?? ''),
      security_or_deployment_concerns: String(parsed.security_or_deployment_concerns ?? ''),
      assessment_trust_concerns: String(parsed.assessment_trust_concerns ?? ''),
      buyer_or_sponsor_clue: String(parsed.buyer_or_sponsor_clue ?? ''),
      pilot_interest_1_7: toIntOrNull(parsed.pilot_interest_1_7, 1, 7),
      willing_followup: toBoolOrNull(parsed.willing_followup),
      followup_type: String(parsed.followup_type ?? ''),
      evidence_strength: toEvidence(parsed.evidence_strength),
      sensitive_info_flag: Boolean(parsed.sensitive_info_flag),
    };

    return { summary_text, summary_struct: struct };
  },
};

function toIntOrNull(v: unknown, min: number, max: number): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n)) return null;
  const i = Math.round(n);
  if (i < min || i > max) return null;
  return i;
}

function toBoolOrNull(v: unknown): boolean | null {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'boolean') return v;
  if (v === 'true') return true;
  if (v === 'false') return false;
  return null;
}

function toEvidence(v: unknown): ValidationSummaryStruct['evidence_strength'] {
  const s = String(v ?? '').toLowerCase();
  if (s === 'low' || s === 'medium' || s === 'high') return s;
  return 'unknown';
}
