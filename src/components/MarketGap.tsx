'use client';

import { useState } from 'react';

const TIERS = [
  {
    id: 'low',
    label: 'Low Fidelity',
    cost: '$',
    costDetail: '$10s+ / hr',
    examples: ['Table-top', 'White-board', 'Chair-flying', 'Discussion'],
    offeringsBefore: 5,
    offeringsAfter: 5,
    description:
      'Cheap, widely available methods. Great for introducing concepts, but limited in building real procedural muscle memory.',
  },
  {
    id: 'medium',
    label: 'Medium Fidelity',
    cost: '$$',
    costDetail: '$100s+ / hr',
    examples: ['ROOSTER'],
    offeringsBefore: 0,
    offeringsAfter: 1,
    isRooster: true,
    description:
      'The missing layer. Before Rooster, there were no credible medium-fidelity options — operators jumped straight from whiteboards to enterprise simulators with no way to build reps in between.',
  },
  {
    id: 'high',
    label: 'High Fidelity',
    cost: '$$$',
    costDetail: '$1,000s+ / hr',
    examples: ['DTOC', 'Local training with', 'trained "SIM drivers"'],
    offeringsBefore: 5,
    offeringsAfter: 5,
    description:
      'Local training events with dedicated sim operators. Valuable but requires scheduling, staffing, and facility access.',
  },
  {
    id: 'realistic',
    label: 'Realistic',
    cost: '$$$$',
    costDetail: '$10,000s+ / hr',
    examples: ['JSE', 'WPC', 'DMOC', 'Virtual'],
    offeringsBefore: 5,
    offeringsAfter: 5,
    description:
      'Enterprise-grade simulators. Highly effective but expensive to operate and limited in availability.',
  },
  {
    id: 'live',
    label: 'Live',
    cost: '$$$$$',
    costDetail: '$100,000s+ / hr',
    examples: ['Local Live-fly', 'Flag-level', 'Exercises'],
    offeringsBefore: 5,
    offeringsAfter: 5,
    description:
      'Actual live training events — the gold standard for realism. Extremely expensive and infrequent.',
  },
  {
    id: 'combat',
    label: 'Combat Ops',
    cost: '$$$$$$$+',
    costDetail: 'Tens of millions to billions',
    examples: ['Desert Shield', 'Desert Storm', 'Inherent Resolve', 'Enduring Freedom'],
    offeringsBefore: 5,
    offeringsAfter: 5,
    description:
      'Real-world operations. The ultimate test of readiness — tens of millions to billions of dollars. Every other tier exists to prepare controllers for this.',
  },
];

/* Chart layout constants */
const CHART_W = 900;
const CHART_H = 300;
const PAD_L = 50;
const PAD_R = 30;
const PAD_T = 30;
const PAD_B = 10;
const PLOT_W = CHART_W - PAD_L - PAD_R;
const PLOT_H = CHART_H - PAD_T - PAD_B;
const MAX_Y = 5;

function tierX(i: number) {
  return PAD_L + (PLOT_W / (TIERS.length - 1)) * i;
}
function valY(v: number) {
  return PAD_T + PLOT_H - (v / MAX_Y) * PLOT_H;
}

export function MarketGap() {
  const [activeTier, setActiveTier] = useState<string>('medium');

  const active = TIERS.find((t) => t.id === activeTier)!;

  /* Build polyline paths */
  const beforePoints = TIERS.map((t, i) => `${tierX(i)},${valY(t.offeringsBefore)}`).join(' ');
  const afterPoints = TIERS.map((t, i) => `${tierX(i)},${valY(t.offeringsAfter)}`).join(' ');

  return (
    <section id="market-gap" className="section-padding bg-navy-950 text-white scroll-mt-16">
      <div className="container-wide">
        <p className="text-xs font-medium text-accent-400 uppercase tracking-[0.2em] mb-3">
          Market Gap
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
          The Missing Layer in Training Fidelity
        </h2>
        <div className="h-0.5 w-12 bg-accent-500 rounded-full mb-4" />
        <p className="text-base md:text-lg text-navy-200 leading-relaxed max-w-3xl mb-12">
          Every fidelity tier already has multiple options — except medium fidelity.
          Rooster fills that gap with affordable, repeatable training so operators
          can master the basics before consuming expensive high-end simulator time.
          The result: higher-level training events focus on advanced learning
          objectives instead of re-teaching fundamentals.
        </p>

        {/* ── SVG Line Chart ── */}
        <div className="bg-navy-900/60 border border-navy-700/50 rounded-2xl p-4 md:p-8 mb-8">
          <svg
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Y-axis grid lines + labels */}
            {[0, 1, 2, 3, 4, 5].map((v) => (
              <g key={v}>
                <line
                  x1={PAD_L}
                  y1={valY(v)}
                  x2={CHART_W - PAD_R}
                  y2={valY(v)}
                  stroke="#334e68"
                  strokeWidth={0.5}
                  strokeDasharray={v === 0 ? undefined : '4 4'}
                />
                <text
                  x={PAD_L - 10}
                  y={valY(v) + 4}
                  textAnchor="end"
                  className="fill-[#627d98] text-[11px]"
                >
                  {v === 5 ? '5+' : v}
                </text>
              </g>
            ))}

            {/* Y-axis label */}
            <text
              x={14}
              y={PAD_T + PLOT_H / 2}
              textAnchor="middle"
              transform={`rotate(-90, 14, ${PAD_T + PLOT_H / 2})`}
              className="fill-[#829ab1] text-[11px] font-medium"
            >
              Offerings / Vendors
            </text>

            {/* Rooster highlight band behind the medium-fidelity column */}
            <rect
              x={tierX(1) - PLOT_W / (TIERS.length - 1) / 2.5}
              y={PAD_T}
              width={PLOT_W / (TIERS.length - 1) / 1.25}
              height={PLOT_H}
              rx={6}
              className="fill-accent-600/10"
            />

            {/* ── BEFORE line (dashed) ── */}
            <polyline
              points={beforePoints}
              fill="none"
              stroke="#829ab1"
              strokeWidth={2}
              strokeDasharray="8 5"
            />
            {/* Before dots */}
            {TIERS.map((t, i) => (
              <circle
                key={`b-${t.id}`}
                cx={tierX(i)}
                cy={valY(t.offeringsBefore)}
                r={5}
                className="fill-[#829ab1] stroke-navy-950"
                strokeWidth={2}
              />
            ))}

            {/* ── AFTER line (solid, orange/accent) ── */}
            <polyline
              points={afterPoints}
              fill="none"
              stroke="#f59e0b"
              strokeWidth={2.5}
            />
            {/* After dots */}
            {TIERS.map((t, i) => (
              <circle
                key={`a-${t.id}`}
                cx={tierX(i)}
                cy={valY(t.offeringsAfter)}
                r={t.isRooster ? 7 : 5}
                className={
                  t.isRooster
                    ? 'fill-[#f59e0b] stroke-navy-950'
                    : 'fill-[#f59e0b] stroke-navy-950'
                }
                strokeWidth={2}
              />
            ))}

            {/* Rooster annotation */}
            <text
              x={tierX(1)}
              y={valY(1) - 16}
              textAnchor="middle"
              className="fill-[#f59e0b] text-[11px] font-bold"
            >
              Rooster creates the first credible
            </text>
            <text
              x={tierX(1)}
              y={valY(1) - 4}
              textAnchor="middle"
              className="fill-[#f59e0b] text-[10px] font-bold"
            >
              medium-fidelity offering
            </text>

            {/* Clickable hit areas + tier labels below the line */}
            {TIERS.map((t, i) => {
              const isActive = t.id === activeTier;
              return (
                <g
                  key={t.id}
                  className="cursor-pointer"
                  onClick={() => setActiveTier(t.id)}
                >
                  {/* Invisible hit area */}
                  <rect
                    x={tierX(i) - PLOT_W / TIERS.length / 2}
                    y={PAD_T}
                    width={PLOT_W / TIERS.length}
                    height={PLOT_H}
                    fill="transparent"
                  />
                  {/* Active ring */}
                  {isActive && (
                    <circle
                      cx={tierX(i)}
                      cy={valY(t.offeringsAfter)}
                      r={12}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                      opacity={0.6}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Axis Labels below chart */}
          <div className="flex mt-2">
            {TIERS.map((tier) => {
              const isActive = tier.id === activeTier;
              return (
                <button
                  key={tier.id}
                  onClick={() => setActiveTier(tier.id)}
                  className={`flex-1 text-center cursor-pointer transition-colors py-2 ${
                    isActive ? 'text-white' : 'text-navy-400 hover:text-navy-200'
                  }`}
                >
                  <p
                    className={`text-[10px] sm:text-xs font-semibold mb-0.5 leading-tight ${
                      tier.isRooster && isActive ? 'text-[#f59e0b]' : ''
                    }`}
                  >
                    {tier.label}
                  </p>
                  <p className="text-[10px] text-navy-500">{tier.cost}</p>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-navy-700/50">
            <div className="flex items-center gap-2">
              <svg width="24" height="4"><line x1="0" y1="2" x2="24" y2="2" stroke="#829ab1" strokeWidth="2" strokeDasharray="4 3" /></svg>
              <span className="text-xs text-navy-400">Before Rooster</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="24" height="4"><line x1="0" y1="2" x2="24" y2="2" stroke="#f59e0b" strokeWidth="2.5" /></svg>
              <span className="text-xs text-navy-400">After Rooster</span>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div
          className={`border rounded-2xl p-6 md:p-8 transition-all duration-300 ${
            active.isRooster
              ? 'bg-[#f59e0b]/10 border-[#f59e0b]/30'
              : 'bg-navy-900/40 border-navy-700/50'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3
                  className={`text-lg font-bold ${
                    active.isRooster ? 'text-[#f59e0b]' : 'text-white'
                  }`}
                >
                  {active.label}
                </h3>
                <span className="text-sm text-navy-400 font-mono">{active.cost}</span>
              </div>
              <p className="text-xs text-navy-400 mb-3 font-mono">{active.costDetail}</p>
              <p className="text-sm md:text-base text-navy-200 leading-relaxed mb-4">
                {active.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {active.examples.map((ex) => (
                  <span
                    key={ex}
                    className={`inline-block text-xs px-3 py-1 rounded-full ${
                      active.isRooster
                        ? 'bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/30'
                        : 'bg-navy-800 text-navy-300 border border-navy-600'
                    }`}
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-6 sm:gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-navy-400">
                  {active.offeringsBefore === 0 ? '0' : '5+'}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-navy-500 mt-1">Before</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${active.isRooster ? 'text-[#f59e0b]' : 'text-white'}`}>
                  {active.offeringsAfter >= 5 ? '5+' : active.offeringsAfter.toString()}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-navy-500 mt-1">After</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Ladder */}
        <div className="mt-6 overflow-x-auto">
          <div className="flex gap-2 min-w-[600px]">
            {TIERS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTier(t.id)}
                className={`flex-1 text-center py-3 px-2 rounded-lg border transition-all cursor-pointer ${
                  t.id === activeTier
                    ? t.isRooster
                      ? 'border-[#f59e0b]/50 bg-[#f59e0b]/10 text-[#f59e0b]'
                      : 'border-navy-500 bg-navy-800 text-white'
                    : 'border-navy-700/50 text-navy-500 hover:text-navy-300 hover:border-navy-600'
                }`}
              >
                <p className="text-sm font-bold">{t.cost}</p>
                <p className="text-[10px] mt-0.5 opacity-80">{t.costDetail}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Key Insight */}
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="border border-navy-700/50 rounded-xl p-6">
            <p className="text-2xl font-bold text-[#f59e0b] mb-1">$</p>
            <p className="text-sm font-semibold text-white mb-2">Cheap Repetitions</p>
            <p className="text-sm text-navy-300 leading-relaxed">
              Affordable reps build procedural fluency before operators ever touch
              an enterprise simulator.
            </p>
          </div>
          <div className="border border-navy-700/50 rounded-xl p-6">
            <p className="text-2xl font-bold text-[#f59e0b] mb-1">↑</p>
            <p className="text-sm font-semibold text-white mb-2">Elevate the Basics</p>
            <p className="text-sm text-navy-300 leading-relaxed">
              Operators arrive at high-fidelity events with fundamentals already
              locked in — ready to tackle advanced objectives.
            </p>
          </div>
          <div className="border border-navy-700/50 rounded-xl p-6">
            <p className="text-2xl font-bold text-[#f59e0b] mb-1">★</p>
            <p className="text-sm font-semibold text-white mb-2">Higher-Order Focus</p>
            <p className="text-sm text-navy-300 leading-relaxed">
              Expensive simulator hours shift from teaching basics to advanced
              decision-making and higher-order learning objectives.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
