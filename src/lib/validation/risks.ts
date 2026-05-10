/**
 * The five highest-risk assumptions for the "Rooster C2" AI-Enabled Simulator
 * venture. Source: Rooster_C2_Venture_Snapshot.pdf, page 4.
 *
 * The survey + admin dashboard treat these as first-class objects so that
 * raw respondent data can be aggregated into a Probability × Impact
 * baseline that drives mitigation planning (page 5 of the snapshot).
 */

export type RiskId = 'R1' | 'R2' | 'R3' | 'R4' | 'R5';

export interface RiskDef {
  id: RiskId;
  title: string;
  shortTitle: string;
  description: string;
  /** What a quantitative answer looks like for this risk's PERT estimate. */
  pertMetric: { label: string; unit: string; hint: string };
}

export const RISKS: RiskDef[] = [
  {
    id: 'R1',
    title: 'Training effectiveness',
    shortTitle: 'Training effectiveness',
    description:
      'Rooster reps improve procedure accuracy, speed, decision quality, and readiness before high-fidelity simulator events.',
    pertMetric: {
      label: 'Estimated improvement in trainee readiness vs. status-quo prep',
      unit: '% lift',
      hint: 'e.g. min 5% / likely 20% / max 40%',
    },
  },
  {
    id: 'R2',
    title: 'Buyer / adopter pull',
    shortTitle: 'Buyer pull',
    description:
      'Schoolhouses, FTUs, units, or defense partners will sponsor a pilot and commit time, users, and feedback.',
    pertMetric: {
      label: 'Number of credible pilot sponsors reachable in 12 months',
      unit: 'pilot sponsors',
      hint: 'e.g. min 0 / likely 2 / max 5',
    },
  },
  {
    id: 'R3',
    title: 'Deployment & security',
    shortTitle: 'Deployment & security',
    description:
      'A low-friction UNCLASSIFIED-first pilot can run on laptop/edge/browser configurations with a clear path to controlled environments.',
    pertMetric: {
      label: 'Setup time for a non-founder to run a pilot scenario from a written guide',
      unit: 'minutes',
      hint: 'e.g. min 15 / likely 45 / max 180',
    },
  },
  {
    id: 'R4',
    title: 'Assessment trust',
    shortTitle: 'Assessment trust',
    description:
      'Instructors and SMEs trust AI-enabled scoring, debriefs, and error categorization enough to use them in training decisions.',
    pertMetric: {
      label: '% of AI-generated debriefs an SME would accept without major rework',
      unit: '% acceptable',
      hint: 'e.g. min 30% / likely 60% / max 85%',
    },
  },
  {
    id: 'R5',
    title: 'Procurement / scaling path',
    shortTitle: 'Procurement path',
    description:
      'A viable path exists through SBIR/STTR, OTA/pilot, SAM.gov opportunities, prime/sub partnerships, or unit innovation funds.',
    pertMetric: {
      label: 'Months to first contracted pilot or funding vehicle',
      unit: 'months',
      hint: 'e.g. min 3 / likely 9 / max 24',
    },
  },
];

export function getRisk(id: RiskId): RiskDef {
  const r = RISKS.find((x) => x.id === id);
  if (!r) throw new Error(`unknown risk id: ${id}`);
  return r;
}

// ---------------------------------------------------------------------------
// Role × risk credibility weights (0..1). Used to weight each respondent's
// score on each risk so that, e.g., an investor's view on assessment-trust
// is recorded but doesn't drown out an instructor's. Tuned conservatively.
// ---------------------------------------------------------------------------

const ROLE_WEIGHTS: Record<string, Record<RiskId, number>> = {
  'Active-duty / uniformed (C2 / aircrew / operations)':
    { R1: 1.0, R2: 0.7, R3: 0.8, R4: 1.0, R5: 0.4 },
  'Instructor / schoolhouse / training squadron':
    { R1: 1.0, R2: 0.8, R3: 0.9, R4: 1.0, R5: 0.4 },
  'Defense civilian / DoD':
    { R1: 0.6, R2: 1.0, R3: 0.8, R4: 0.6, R5: 1.0 },
  'Defense contractor / industry':
    { R1: 0.5, R2: 0.9, R3: 0.9, R4: 0.6, R5: 1.0 },
  'Researcher / academic':
    { R1: 0.7, R2: 0.4, R3: 0.6, R4: 0.7, R5: 0.3 },
  'Investor / venture / accelerator':
    { R1: 0.3, R2: 1.0, R3: 0.4, R4: 0.3, R5: 1.0 },
  'Other':
    { R1: 0.5, R2: 0.5, R3: 0.5, R4: 0.5, R5: 0.5 },
};

export function roleWeight(roleCategory: string | null | undefined, risk: RiskId): number {
  if (!roleCategory) return 0.5;
  return ROLE_WEIGHTS[roleCategory]?.[risk] ?? 0.5;
}

/**
 * Risks the respondent should be asked to score in the micro-survey.
 * Anything with weight >= 0.6 for their role.
 */
export function relevantRisksForRole(roleCategory: string | null | undefined): RiskId[] {
  return RISKS.map((r) => r.id).filter((id) => roleWeight(roleCategory, id) >= 0.6);
}

// ---------------------------------------------------------------------------
// Per-respondent risk assessment (shape persisted in
// validation_sessions.risk_assessments).
// ---------------------------------------------------------------------------

export interface RiskAssessment {
  /** True when this risk was relevant to this respondent (asked + answered). */
  relevant: boolean;
  /** 0 = no chance of failure, 10 = certain to fail. */
  p_failure_0_10: number | null;
  /** 0 = no impact, 10 = venture-killing. */
  impact_0_10: number | null;
  /** Self-rated confidence in the above scores. 1 = low, 5 = high. */
  confidence_1_5: number | null;
  /** Three-point estimate for the risk-specific quantitative metric. */
  pert_min: number | null;
  pert_likely: number | null;
  pert_max: number | null;
  /** Verbatim transcript snippets that justify this respondent's view. */
  evidence_quotes: string[];
  /** Snippets that argue against (caveats, counter-examples). */
  disconfirming_quotes: string[];
  /** Whether the source is the LLM extractor, the micro-survey, or both. */
  source: 'llm' | 'survey' | 'both' | 'none';
}

export function emptyAssessment(): RiskAssessment {
  return {
    relevant: false,
    p_failure_0_10: null,
    impact_0_10: null,
    confidence_1_5: null,
    pert_min: null,
    pert_likely: null,
    pert_max: null,
    evidence_quotes: [],
    disconfirming_quotes: [],
    source: 'none',
  };
}

export type RiskAssessmentMap = Partial<Record<RiskId, RiskAssessment>>;
