import { NextResponse } from 'next/server';
import { ensureSchema, sql } from '@/lib/db';
import { ChatTurnSchema } from '@/lib/validation/schema';
import { getProvider, INTERVIEW_COMPLETE_TOKEN, type ChatMessage, type InterviewContext } from '@/lib/llm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const OPENING_MESSAGE =
  "Thanks for taking the time. To start: in a sentence or two, what is your role and how does it relate to C2 training, simulation, readiness, or defense technology?";

export async function POST(req: Request) {
  try {
    await ensureSchema();
    const body = await req.json().catch(() => ({}));
    const parsed = ChatTurnSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
    }
    const { sessionId, userMessage } = parsed.data;

    const row = await sql`
      SELECT id, consent_confirmed, summary_text, transcript,
             role_category, experience_level, relationship
      FROM validation_sessions WHERE id = ${sessionId} LIMIT 1;
    `;
    if (row.rows.length === 0) {
      return NextResponse.json({ error: 'session_not_found' }, { status: 404 });
    }
    const s = row.rows[0];
    if (!s.consent_confirmed) {
      return NextResponse.json({ error: 'consent_required' }, { status: 403 });
    }
    if (s.summary_text) {
      return NextResponse.json({ error: 'interview_already_complete' }, { status: 409 });
    }

    const transcript: ChatMessage[] = Array.isArray(s.transcript) ? s.transcript : [];

    // First user message: opener has been shown client-side; if transcript is empty,
    // seed it with our opening assistant message so the LLM sees the full thread.
    if (transcript.length === 0) {
      transcript.push({ role: 'assistant', content: OPENING_MESSAGE });
    }
    transcript.push({ role: 'user', content: userMessage });

    const ctx: InterviewContext = {
      roleCategory: s.role_category,
      experienceLevel: s.experience_level,
      relationship: s.relationship,
    };

    const reply = await getProvider().generateInterviewReply(transcript, ctx);
    const isComplete = reply.text.includes(INTERVIEW_COMPLETE_TOKEN);
    const visibleReply = reply.text.replace(INTERVIEW_COMPLETE_TOKEN, '').trim();

    transcript.push({ role: 'assistant', content: visibleReply });

    await sql`
      UPDATE validation_sessions SET
        transcript = ${JSON.stringify(transcript)}::jsonb,
        tokens_in  = tokens_in  + ${reply.usage.prompt_tokens},
        tokens_out = tokens_out + ${reply.usage.completion_tokens},
        llm_calls  = llm_calls  + 1
      WHERE id = ${sessionId};
    `;

    return NextResponse.json({
      reply: visibleReply,
      complete: isComplete,
      turnCount: transcript.filter((m) => m.role === 'user').length,
    });
  } catch (err) {
    console.error('[validation/chat]', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  // Lightweight helper used by the client to fetch the standardized opener
  // without needing to hardcode it in two places.
  const url = new URL(req.url);
  if (url.searchParams.get('opener') === '1') {
    return NextResponse.json({ opener: OPENING_MESSAGE });
  }
  return NextResponse.json({ error: 'not_found' }, { status: 404 });
}
