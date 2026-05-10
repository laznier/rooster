import type { RiskAssessmentMap } from '@/lib/validation/risks';

/**
 * Provider-agnostic LLM types. Implementations live alongside in this folder.
 * Add new providers by implementing `LLMProvider` and registering in `index.ts`.
 */

export type ChatRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface InterviewContext {
  roleCategory?: string | null;
  experienceLevel?: string | null;
  relationship?: string | null;
}

export interface ValidationSummaryStruct {
  problem_understanding: string;
  pain_score_1_7: number | null;
  current_alternatives: string;
  most_valuable_feature: string;
  least_convincing_part: string;
  main_objection: string;
  security_or_deployment_concerns: string;
  assessment_trust_concerns: string;
  buyer_or_sponsor_clue: string;
  pilot_interest_1_7: number | null;
  willing_followup: boolean | null;
  followup_type: string;
  evidence_strength: 'low' | 'medium' | 'high' | 'unknown';
  sensitive_info_flag: boolean;
  /** Per-risk LLM-extracted scores + supporting evidence (R1..R5). */
  risk_assessments: RiskAssessmentMap;
}

export interface SummaryResult {
  summary_text: string;
  summary_struct: ValidationSummaryStruct;
  usage: TokenUsage;
}

export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface ReplyResult {
  text: string;
  usage: TokenUsage;
}

export interface LLMProvider {
  /** One assistant turn given the running transcript. */
  generateInterviewReply(
    messages: ChatMessage[],
    context: InterviewContext,
  ): Promise<ReplyResult>;

  /** Final structured + narrative summary of the transcript. */
  extractValidationSummary(
    transcript: ChatMessage[],
    context: InterviewContext,
  ): Promise<SummaryResult>;
}
