'use client';

import { useCallback, useEffect, useState } from 'react';

// ── Types matching /api/validation/risk-rollup payload ────────────────────
interface Quote { quote: string; session_id: string; }

interface Rollup {
  risk_id: 'R1' | 'R2' | 'R3' | 'R4' | 'R5';
  title: string;
  short_title: string;
  description: string;
  pert_metric: { label: string; unit: string };
  n: number;
  weight_total: number;
  p_mean: number | null;
  i_mean: number | null;
  p_std: number | null;
  i_std: number | null;
  exposure: number | null;
  pert: { mean: number | null; p05: number | null; p50: number | null; p95: number | null; n_responses: number; unit: string };
  top_evidence: Quote[];
  top_disconfirming: Quote[];
}

interface Mitigation {
  risk_id: string;
  current_assessment: string;
  mitigation_plan: string;
  next_experiment: string;
  owner: string;
  status: string;
  updated_at: string;
}

const RISK_COLORS: Record<string, string> = {
  R1: '#60a5fa', // blue
  R2: '#34d399', // green
  R3: '#f59e0b', // amber
  R4: '#a78bfa', // violet
  R5: '#f472b6', // pink
};

export function RiskBaseline() {
  const [rollups, setRollups] = useState<Rollup[] | null>(null);
  const [mitigations, setMitigations] = useState<Record<string, Mitigation> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [rRes, mRes] = await Promise.all([
        fetch('/api/validation/risk-rollup', { cache: 'no-store' }),
        fetch('/api/validation/mitigations', { cache: 'no-store' }),
      ]);
      if (!rRes.ok || !mRes.ok) {
        setError('Could not load risk data.');
        setRollups(null);
        setMitigations(null);
        return;
      }
      const rData = await rRes.json();
      const mData = await mRes.json();
      setRollups(rData.rollups as Rollup[]);
      const mMap: Record<string, Mitigation> = {};
      for (const m of (mData.mitigations as Mitigation[])) mMap[m.risk_id] = m;
      setMitigations(mMap);
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const updateMitigation = useCallback(async (risk_id: string, patch: Partial<Mitigation>) => {
    setSavingId(risk_id);
    try {
      const res = await fetch('/api/validation/mitigations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ risk_id, ...patch }),
      });
      if (res.ok) {
        const data = await res.json();
        setMitigations((prev) => ({ ...(prev ?? {}), [risk_id]: data.mitigation }));
      }
    } finally {
      setSavingId(null);
    }
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-navy-800 bg-navy-900/40 p-5 mb-6">
        <p className="text-sm text-navy-400">Loading risk baseline…</p>
      </div>
    );
  }

  if (error || !rollups) {
    return (
      <div className="rounded-xl border border-navy-800 bg-navy-900/40 p-5 mb-6">
        <p className="text-sm text-red-300">{error ?? 'No risk data available.'}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-navy-800 bg-navy-900/40 p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Risk baseline (Probability × Impact)</h2>
        <button onClick={load} className="text-xs text-accent-400 hover:text-accent-300">Refresh</button>
      </div>
      <p className="text-xs text-navy-400 mb-4">
        Bubble position = weighted-mean probability of failure (x) and impact-if-failure (y),
        weighted by role × confidence. Bubble area = total evidence weight (more credible
        respondents → bigger). Click a bubble to drill down.
      </p>

      <PIMatrix rollups={rollups} onSelect={(id) => setOpen(open === id ? null : id)} selected={open} />

      {/* Per-risk row + mitigation editor */}
      <div className="mt-6 space-y-4">
        {rollups.map((r) => (
          <RiskRow
            key={r.risk_id}
            rollup={r}
            mitigation={mitigations?.[r.risk_id]}
            expanded={open === r.risk_id}
            onToggle={() => setOpen(open === r.risk_id ? null : r.risk_id)}
            onSave={(patch) => updateMitigation(r.risk_id, patch)}
            saving={savingId === r.risk_id}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// P×I matrix (SVG)
// ─────────────────────────────────────────────────────────────────────────
function PIMatrix({
  rollups, onSelect, selected,
}: { rollups: Rollup[]; onSelect: (id: string) => void; selected: string | null }) {
  const W = 560, H = 360;
  const PAD_L = 56, PAD_B = 44, PAD_T = 16, PAD_R = 16;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const x = (p: number) => PAD_L + (p / 10) * innerW;
  const y = (i: number) => PAD_T + (1 - i / 10) * innerH;

  const maxW = Math.max(0.0001, ...rollups.map((r) => r.weight_total));
  const radius = (w: number) => 6 + 22 * Math.sqrt(Math.max(0, w) / maxW);

  // Heatmap cells (0..10 × 0..10) coloured by p*i exposure.
  const cells: { p: number; i: number; expo: number }[] = [];
  for (let p = 0; p <= 10; p++) for (let i = 0; i <= 10; i++) cells.push({ p, i, expo: (p * i) / 100 });
  const cellW = innerW / 11, cellH = innerH / 11;
  const heatColor = (e: number) => {
    // Green → amber → red gradient.
    if (e < 0.33) return 'rgba(16,185,129,0.10)';
    if (e < 0.66) return 'rgba(245,158,11,0.12)';
    return 'rgba(239,68,68,0.16)';
  };

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" style={{ minWidth: 480 }}>
        {/* heatmap */}
        {cells.map((c, idx) => (
          <rect
            key={idx}
            x={x(c.p) - cellW / 2}
            y={y(c.i) - cellH / 2}
            width={cellW}
            height={cellH}
            fill={heatColor(c.expo)}
            stroke="rgba(148,163,184,0.10)"
          />
        ))}

        {/* axes */}
        <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke="#475569" />
        <line x1={PAD_L} y1={PAD_T}     x2={PAD_L}     y2={H - PAD_B} stroke="#475569" />

        {/* axis labels */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <g key={`xt${n}`}>
            <text x={x(n)} y={H - PAD_B + 16} textAnchor="middle" fontSize="10" fill="#94a3b8">{n}</text>
          </g>
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <g key={`yt${n}`}>
            <text x={PAD_L - 8} y={y(n) + 3} textAnchor="end" fontSize="10" fill="#94a3b8">{n}</text>
          </g>
        ))}
        <text x={PAD_L + innerW / 2} y={H - 6} textAnchor="middle" fontSize="11" fill="#cbd5e1">
          Probability of failure (0 = no chance → 10 = certain)
        </text>
        <text
          x={-(PAD_T + innerH / 2)}
          y={14}
          textAnchor="middle"
          fontSize="11"
          fill="#cbd5e1"
          transform="rotate(-90)"
        >
          Impact if it fails (0 = no impact → 10 = venture-killing)
        </text>

        {/* bubbles */}
        {rollups.map((r) => {
          if (r.p_mean == null || r.i_mean == null) {
            // Placeholder ghost in lower-left when no data.
            return (
              <g key={r.risk_id} opacity="0.35">
                <circle cx={x(0.3)} cy={y(0.3)} r={10} fill="#334155" stroke="#64748b" strokeDasharray="3 3" />
                <text x={x(0.3)} y={y(0.3) + 3} textAnchor="middle" fontSize="9" fill="#cbd5e1">
                  {r.risk_id}
                </text>
              </g>
            );
          }
          const cx = x(r.p_mean), cy = y(r.i_mean);
          const rad = radius(r.weight_total);
          const sel = selected === r.risk_id;
          return (
            <g
              key={r.risk_id}
              style={{ cursor: 'pointer' }}
              onClick={() => onSelect(r.risk_id)}
            >
              <circle
                cx={cx} cy={cy} r={rad}
                fill={RISK_COLORS[r.risk_id] + 'b3'}
                stroke={sel ? '#ffffff' : RISK_COLORS[r.risk_id]}
                strokeWidth={sel ? 3 : 1.5}
              />
              <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0b1220">
                {r.risk_id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Per-risk row with summary stats + collapsible drill-down + mitigation
// ─────────────────────────────────────────────────────────────────────────
function RiskRow({
  rollup, mitigation, expanded, onToggle, onSave, saving,
}: {
  rollup: Rollup;
  mitigation: Mitigation | undefined;
  expanded: boolean;
  onToggle: () => void;
  onSave: (patch: Partial<Mitigation>) => void;
  saving: boolean;
}) {
  const r = rollup;
  return (
    <div className="rounded-xl border border-navy-800 bg-navy-950/40">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-navy-900/40"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="inline-block h-3 w-3 rounded-full flex-none"
            style={{ background: RISK_COLORS[r.risk_id] }}
          />
          <span className="font-semibold text-white truncate">
            {r.risk_id}. {r.title}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-navy-300 flex-none">
          <span>n = {r.n}</span>
          <span>P = {fmt1(r.p_mean)} ± {fmt1(r.p_std)}</span>
          <span>I = {fmt1(r.i_mean)} ± {fmt1(r.i_std)}</span>
          <span>Exposure {fmtPct(r.exposure)}</span>
          <span className="text-accent-400">{expanded ? 'Hide' : 'Open'}</span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-navy-800 px-4 py-4 space-y-5">
          <p className="text-xs text-navy-300">{r.description}</p>

          {/* PERT block */}
          <div className="rounded-lg border border-navy-800 bg-navy-900/60 p-4">
            <p className="text-[11px] uppercase tracking-wider text-navy-400 mb-1">
              Quantitative metric · {r.pert_metric.label} ({r.pert_metric.unit})
            </p>
            {r.pert.n_responses === 0 ? (
              <p className="text-xs text-navy-500">No three-point estimates yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 text-xs text-navy-100">
                <Stat label="P05 (optimistic)" value={fmt2(r.pert.p05)} />
                <Stat label="P50 (median)"     value={fmt2(r.pert.p50)} />
                <Stat label="Mean"             value={fmt2(r.pert.mean)} />
                <Stat label="P95 (pessimistic)" value={fmt2(r.pert.p95)} />
                <p className="md:col-span-4 text-[10px] text-navy-500">
                  Monte Carlo (triangular PERT) over {r.pert.n_responses} respondent estimate(s).
                </p>
              </div>
            )}
          </div>

          {/* Evidence */}
          <div className="grid gap-4 md:grid-cols-2">
            <QuoteList title="Top supporting evidence" quotes={r.top_evidence} tone="ok" />
            <QuoteList title="Disconfirming evidence" quotes={r.top_disconfirming} tone="warn" />
          </div>

          {/* Mitigation editor */}
          <MitigationEditor
            riskId={r.risk_id}
            mitigation={mitigation}
            onSave={onSave}
            saving={saving}
          />
        </div>
      )}
    </div>
  );
}

function QuoteList({ title, quotes, tone }: { title: string; quotes: Quote[]; tone: 'ok' | 'warn' }) {
  const cls = tone === 'ok'
    ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-100'
    : 'border-amber-500/30 bg-amber-500/5 text-amber-100';
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-navy-400 mb-2">{title}</p>
      {quotes.length === 0 ? (
        <p className="text-xs text-navy-500">None recorded.</p>
      ) : (
        <ul className="space-y-2">
          {quotes.map((q, i) => (
            <li key={i} className={`rounded-lg border ${cls} px-3 py-2 text-xs leading-relaxed`}>
              &ldquo;{q.quote}&rdquo;
              <span className="block mt-1 text-[10px] opacity-70">session {q.session_id.slice(0, 8)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MitigationEditor({
  riskId, mitigation, onSave, saving,
}: {
  riskId: string;
  mitigation: Mitigation | undefined;
  onSave: (patch: Partial<Mitigation>) => void;
  saving: boolean;
}) {
  const [m, setM] = useState<Mitigation>(() => mitigation ?? {
    risk_id: riskId,
    current_assessment: '',
    mitigation_plan: '',
    next_experiment: '',
    owner: '',
    status: 'open',
    updated_at: '',
  });
  // Sync if upstream prop changes (after save).
  useEffect(() => { if (mitigation) setM(mitigation); }, [mitigation]);

  return (
    <div className="rounded-lg border border-navy-800 bg-navy-900/60 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] uppercase tracking-wider text-navy-300">Mitigation tracker</p>
        <span className="text-[10px] text-navy-500">
          {m.updated_at ? `updated ${new Date(m.updated_at).toLocaleString()}` : 'not saved yet'}
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Textarea label="Current assessment (founder view)" value={m.current_assessment}
          onChange={(v) => setM({ ...m, current_assessment: v })} />
        <Textarea label="Mitigation plan" value={m.mitigation_plan}
          onChange={(v) => setM({ ...m, mitigation_plan: v })} />
        <Textarea label="Next experiment" value={m.next_experiment}
          onChange={(v) => setM({ ...m, next_experiment: v })} />
        <div className="grid gap-3">
          <label className="block">
            <span className="block text-[11px] uppercase tracking-wider text-navy-400 mb-1">Owner</span>
            <input
              type="text"
              value={m.owner}
              onChange={(e) => setM({ ...m, owner: e.target.value })}
              className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white focus:border-accent-500 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="block text-[11px] uppercase tracking-wider text-navy-400 mb-1">Status</span>
            <select
              value={m.status}
              onChange={(e) => setM({ ...m, status: e.target.value })}
              className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white focus:border-accent-500 focus:outline-none"
            >
              {['open', 'in_progress', 'mitigated', 'accepted', 'transferred'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <button
          onClick={() => onSave({
            current_assessment: m.current_assessment,
            mitigation_plan:    m.mitigation_plan,
            next_experiment:    m.next_experiment,
            owner:              m.owner,
            status:             m.status as Mitigation['status'],
          })}
          disabled={saving}
          className="rounded-lg bg-accent-600 px-4 py-2 text-xs font-semibold text-white hover:bg-accent-500 disabled:bg-navy-700"
        >
          {saving ? 'Saving…' : 'Save mitigation'}
        </button>
      </div>
    </div>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wider text-navy-400 mb-1">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white focus:border-accent-500 focus:outline-none resize-none"
      />
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-navy-800 bg-navy-950/60 p-2">
      <p className="text-[10px] uppercase tracking-wider text-navy-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function fmt1(n: number | null): string { return n == null ? '—' : n.toFixed(1); }
function fmt2(n: number | null): string { return n == null ? '—' : (Math.abs(n) >= 100 ? n.toFixed(0) : n.toFixed(1)); }
function fmtPct(n: number | null): string { return n == null ? '—' : (n * 100).toFixed(0) + '%'; }
