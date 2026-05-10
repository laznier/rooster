import { RISKS, roleWeight, type RiskAssessment, type RiskAssessmentMap, type RiskId } from './risks';

export interface SessionForRollup {
  id: string;
  role_category: string | null;
  sensitive_info_flag: boolean;
  risk_assessments: RiskAssessmentMap | null;
}

export interface RiskRollup {
  risk_id: RiskId;
  title: string;
  short_title: string;
  description: string;
  pert_metric: { label: string; unit: string };
  /** Number of sessions that contributed any signal for this risk. */
  n: number;
  /** Sum of effective weights (role × confidence). */
  weight_total: number;
  /** Weighted mean P (0..10) or null if n == 0. */
  p_mean: number | null;
  /** Weighted mean I (0..10) or null if n == 0. */
  i_mean: number | null;
  /** Weighted standard deviation of P. */
  p_std: number | null;
  /** Weighted standard deviation of I. */
  i_std: number | null;
  /** Risk exposure score = P×I / 49 (so 0..1). */
  exposure: number | null;
  /** Monte Carlo on PERT metric: aggregated mean + 5/95 percentiles. */
  pert: {
    mean: number | null;
    p05: number | null;
    p50: number | null;
    p95: number | null;
    n_responses: number;
    unit: string;
  };
  /** Top 3 supporting and 3 disconfirming quotes (de-duped, weighted). */
  top_evidence: { quote: string; session_id: string }[];
  top_disconfirming: { quote: string; session_id: string }[];
}

interface WeightedPoint { value: number; weight: number; }

export function buildRollups(sessions: SessionForRollup[]): RiskRollup[] {
  return RISKS.map((r) => buildOne(r.id as RiskId, r.title, r.shortTitle, r.description, r.pertMetric, sessions));
}

function buildOne(
  id: RiskId,
  title: string,
  short_title: string,
  description: string,
  pertMetric: { label: string; unit: string },
  sessions: SessionForRollup[],
): RiskRollup {
  const ps: WeightedPoint[] = [];
  const is: WeightedPoint[] = [];
  const evidence: { quote: string; session_id: string; w: number }[] = [];
  const disconf: { quote: string; session_id: string; w: number }[] = [];
  const pertSamples: number[] = [];

  for (const s of sessions) {
    if (s.sensitive_info_flag) continue; // exclude flagged sessions from quant rollup
    const a: RiskAssessment | undefined = s.risk_assessments?.[id];
    if (!a || !a.relevant) continue;
    const rw = roleWeight(s.role_category, id);
    const cw = a.confidence_1_5 != null ? a.confidence_1_5 / 5 : 0.6;
    const w = rw * cw;
    if (w <= 0) continue;
    if (a.p_failure_0_10 != null) ps.push({ value: a.p_failure_0_10, weight: w });
    if (a.impact_0_10 != null)    is.push({ value: a.impact_0_10,    weight: w });
    for (const q of a.evidence_quotes || []) {
      evidence.push({ quote: q, session_id: s.id, w });
    }
    for (const q of a.disconfirming_quotes || []) {
      disconf.push({ quote: q, session_id: s.id, w });
    }
    // PERT Monte Carlo: 200 samples per respondent from a Beta-PERT proxy
    // (we use a simple triangular distribution — adequate for venture-stage
    // risk planning and avoids pulling in a stats lib).
    if (a.pert_min != null && a.pert_likely != null && a.pert_max != null) {
      const { pert_min: lo, pert_likely: m, pert_max: hi } = a;
      if (Number.isFinite(lo) && Number.isFinite(m) && Number.isFinite(hi) && lo <= m && m <= hi && hi > lo) {
        for (let i = 0; i < 200; i++) pertSamples.push(triangular(lo, m, hi));
      }
    }
  }

  const p_mean = weightedMean(ps);
  const i_mean = weightedMean(is);
  const p_std  = weightedStd(ps, p_mean);
  const i_std  = weightedStd(is, i_mean);
  const exposure = (p_mean != null && i_mean != null) ? (p_mean * i_mean) / 100 : null;

  const pert = pertSamples.length > 0 ? {
    mean: pertSamples.reduce((a, b) => a + b, 0) / pertSamples.length,
    p05: percentile(pertSamples, 0.05),
    p50: percentile(pertSamples, 0.50),
    p95: percentile(pertSamples, 0.95),
    n_responses: Math.round(pertSamples.length / 200),
    unit: pertMetric.unit,
  } : { mean: null, p05: null, p50: null, p95: null, n_responses: 0, unit: pertMetric.unit };

  const n = new Set(
    sessions
      .filter((s) => !s.sensitive_info_flag && s.risk_assessments?.[id]?.relevant)
      .map((s) => s.id),
  ).size;

  return {
    risk_id: id,
    title,
    short_title,
    description,
    pert_metric: pertMetric,
    n,
    weight_total: ps.reduce((a, b) => a + b.weight, 0),
    p_mean, i_mean, p_std, i_std, exposure,
    pert,
    top_evidence: dedupTopK(evidence, 3),
    top_disconfirming: dedupTopK(disconf, 3),
  };
}

function weightedMean(pts: WeightedPoint[]): number | null {
  if (!pts.length) return null;
  const W = pts.reduce((a, p) => a + p.weight, 0);
  if (W <= 0) return null;
  return pts.reduce((a, p) => a + p.value * p.weight, 0) / W;
}

function weightedStd(pts: WeightedPoint[], mean: number | null): number | null {
  if (mean == null || pts.length < 2) return null;
  const W = pts.reduce((a, p) => a + p.weight, 0);
  if (W <= 0) return null;
  const variance = pts.reduce((a, p) => a + p.weight * (p.value - mean) ** 2, 0) / W;
  return Math.sqrt(variance);
}

function triangular(lo: number, m: number, hi: number): number {
  const u = Math.random();
  const c = (m - lo) / (hi - lo);
  if (u < c) return lo + Math.sqrt(u * (hi - lo) * (m - lo));
  return hi - Math.sqrt((1 - u) * (hi - lo) * (hi - m));
}

function percentile(samples: number[], q: number): number {
  const sorted = samples.slice().sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor(q * sorted.length)));
  return sorted[idx];
}

function dedupTopK(items: { quote: string; session_id: string; w: number }[], k: number) {
  const map = new Map<string, { quote: string; session_id: string; w: number }>();
  for (const it of items) {
    const key = it.quote.trim().toLowerCase();
    if (!key) continue;
    const cur = map.get(key);
    if (!cur || it.w > cur.w) map.set(key, it);
  }
  return Array.from(map.values())
    .sort((a, b) => b.w - a.w)
    .slice(0, k)
    .map(({ quote, session_id }) => ({ quote, session_id }));
}
