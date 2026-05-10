import type { LLMProvider } from './types';
import { openaiProvider } from './openai';

/**
 * Provider registry. Selected by env `LLM_PROVIDER`. OpenAI is the only
 * implementation today; add Anthropic / local models here without touching
 * route handlers.
 */
const REGISTRY: Record<string, LLMProvider> = {
  openai: openaiProvider,
};

export function getProvider(): LLMProvider {
  const key = (process.env.LLM_PROVIDER || 'openai').toLowerCase();
  const provider = REGISTRY[key];
  if (!provider) {
    throw new Error(`Unknown LLM_PROVIDER: ${key}`);
  }
  return provider;
}

export type { ChatMessage, InterviewContext, SummaryResult, ValidationSummaryStruct } from './types';
export { INTERVIEW_COMPLETE_TOKEN } from './prompts';
