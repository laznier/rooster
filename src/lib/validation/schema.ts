import { z } from 'zod';

export const StartSchema = z.object({
  invite: z.string().trim().min(1).max(128),
});

export const IntakeSchema = z.object({
  sessionId: z.string().min(1).max(64),
  consent: z.literal(true),
  videoStarted: z.boolean(),
  videoCompleted: z.boolean(),
  videoPct: z.number().int().min(0).max(100),
  roleCategory: z.string().trim().max(120).optional(),
  experienceLevel: z.string().trim().max(120).optional(),
  relationship: z.string().trim().max(500).optional(),
  name: z.string().trim().max(120).optional(),
  email: z.string().trim().email().max(200).optional().or(z.literal('').transform(() => undefined)),
  followupConsent: z.boolean().optional(),
});

export const ChatTurnSchema = z.object({
  sessionId: z.string().min(1).max(64),
  userMessage: z.string().trim().min(1).max(4000),
});

export const SummarizeSchema = z.object({
  sessionId: z.string().min(1).max(64),
});

export const ConfirmSchema = z.object({
  sessionId: z.string().min(1).max(64),
  confirmed: z.boolean(),
  edits: z.string().trim().max(4000).optional(),
});
