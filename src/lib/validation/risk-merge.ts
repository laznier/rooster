import { RISKS, emptyAssessment, type RiskAssessmentMap, type RiskId, type RiskAssessment } from './risks';

/**
 * Merge two RiskAssessmentMaps. The micro-survey (`survey`) is treated as
 * authoritative for the respondent's own subjective scores (P, I, confidence,
 * PERT). The LLM extraction (`llm`) supplies evidence quotes from the
 * transcript. We never lose evidence, we never overwrite a respondent's
 * explicit number with an LLM guess.
 */
export function mergeAssessments(
  survey: RiskAssessmentMap | null | undefined,
  llm: RiskAssessmentMap | null | undefined,
): RiskAssessmentMap {
  const out: RiskAssessmentMap = {};
  for (const r of RISKS) {
    const id = r.id as RiskId;
    const s = survey?.[id];
    const l = llm?.[id];
    if (!s && !l) {
      out[id] = emptyAssessment();
      continue;
    }
    const base: RiskAssessment = {
      ...emptyAssessment(),
      ...(l ?? {}),
      ...((s ?? {}) as Partial<RiskAssessment>),
    };
    // Source precedence
    if (hasNumeric(s) && (l?.evidence_quotes?.length || l?.disconfirming_quotes?.length)) {
      base.source = 'both';
    } else if (hasNumeric(s)) {
      base.source = 'survey';
    } else if (l) {
      base.source = 'llm';
    } else {
      base.source = 'none';
    }
    // Always keep the union of quotes (de-duped, capped).
    base.evidence_quotes = uniq([
      ...(s?.evidence_quotes ?? []),
      ...(l?.evidence_quotes ?? []),
    ]).slice(0, 5);
    base.disconfirming_quotes = uniq([
      ...(s?.disconfirming_quotes ?? []),
      ...(l?.disconfirming_quotes ?? []),
    ]).slice(0, 3);
    out[id] = base;
  }
  return out;
}

function hasNumeric(a: RiskAssessment | undefined): boolean {
  if (!a) return false;
  return a.p_failure_0_10 != null || a.impact_0_10 != null || a.pert_likely != null;
}

function uniq(arr: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of arr) {
    const k = s.trim().toLowerCase();
    if (k && !seen.has(k)) { seen.add(k); out.push(s.trim()); }
  }
  return out;
}
