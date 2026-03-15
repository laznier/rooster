'use client';

import { useState } from 'react';

const TIERS = [
  {
    id: 'low',
    label: 'Low Fidelity',
    cost: '$10s',
    examples: ['Table-top', 'White-board', 'Chair-flying', 'Discussion'],
    offeringsBefore: 4.5,
    offeringsAfter: 4.5,
    description:
      'Cheap, widely available methods. Great for introducing concepts, but limited in building real procedural muscle memory.',
  },
  {
    id: 'medium',
    label: 'Medium Fidelity',
    cost: '$$',
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
    examples: ['DTOC', 'Local training with', 'trained "SIM drivers"'],
    offeringsBefore: 1,
    offeringsAfter: 5,
    description:
      'Local training events with dedicated sim operators. Valuable but requires scheduling, staffing, and facility access.',
  },
  {
    id: 'realistic',
    label: 'Realistic',
    cost: '$$$$',
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
    examples: ['Local Live-fly', 'Flag-level', 'Exercises'],
    offeringsBefore: 2.7,
    offeringsAfter: 2.7,
    description:
      'Actual live training events — the gold standard for realism. Extremely expensive and infrequent.',
  },
  {
    id: 'combat',
    label: 'Combat Ops',
    cost: '$$$$$$$+',
    examples: ['Desert Shield', 'Desert Storm', 'Inherent Resolve', 'Enduring Freedom'],
    offeringsBefore: 5,
    offeringsAfter: 5,
    description:
      'Real-world operations. The ultimate test of readiness. Every other tier exists to prepare controllers for this.',
  },
];

export function MarketGap() {
  const [activeTier, setActiveTier] = useState<string>('medium');

  const active = TIERS.find((t) => t.id === activeTier)!;
  const maxOfferings = 5;

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

        {/* Interactive Chart */}
        <div className="bg-navy-900/60 border border-navy-700/50 rounded-2xl p-6 md:p-10 mb-8">
          {/* Bar Chart */}
          <div className="flex items-end gap-2 sm:gap-3 md:gap-4 mb-6" style={{ height: '260px' }}>
            {TIERS.map((tier) => {
              const isActive = tier.id === activeTier;
              const heightBefore = (tier.offeringsBefore / maxOfferings) * 100;
              const heightAfter = (tier.offeringsAfter / maxOfferings) * 100;

              return (
                <button
                  key={tier.id}
                  onClick={() => setActiveTier(tier.id)}
                  className={`relative flex-1 flex items-end justify-center gap-0.5 sm:gap-1 rounded-t-lg transition-all duration-300 cursor-pointer group pb-2 ${
                    isActive
                      ? 'bg-navy-800/80 ring-2 ring-accent-500/50'
                      : 'hover:bg-navy-800/40'
                  }`}
                  style={{ height: '100%' }}
                  aria-label={`View ${tier.label} details`}
                >
                  {/* Before bar */}
                  <div className="flex flex-col items-center gap-1 w-2/5">
                    <span className="text-[10px] text-navy-400 hidden sm:block">Before</span>
                    <div
                      className={`w-full rounded-t transition-all duration-500 ${
                        tier.isRooster
                          ? 'bg-navy-600/50 border border-dashed border-navy-500'
                          : 'bg-navy-500/60 border border-navy-400/30'
                      }`}
                      style={{ height: `${Math.max(heightBefore, 2)}%` }}
                    />
                  </div>

                  {/* After bar */}
                  <div className="flex flex-col items-center gap-1 w-2/5">
                    <span className="text-[10px] text-accent-400 hidden sm:block">After</span>
                    <div
                      className={`w-full rounded-t transition-all duration-500 ${
                        tier.isRooster
                          ? 'bg-accent-500 shadow-lg shadow-accent-500/20 border border-accent-400'
                          : 'bg-accent-600/70 border border-accent-500/40'
                      }`}
                      style={{ height: `${Math.max(heightAfter, 2)}%` }}
                    />
                  </div>

                  {/* Rooster indicator */}
                  {tier.isRooster && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="text-xs font-bold text-accent-400 animate-pulse">
                        ★ ROOSTER
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Axis Labels */}
          <div className="flex gap-2 sm:gap-3 md:gap-4">
            {TIERS.map((tier) => {
              const isActive = tier.id === activeTier;
              return (
                <button
                  key={tier.id}
                  onClick={() => setActiveTier(tier.id)}
                  className={`flex-1 text-center cursor-pointer transition-colors ${
                    isActive ? 'text-white' : 'text-navy-400 hover:text-navy-200'
                  }`}
                >
                  <p
                    className={`text-[10px] sm:text-xs font-semibold mb-0.5 ${
                      tier.isRooster && isActive ? 'text-accent-400' : ''
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
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-navy-700/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-navy-500/60 border border-navy-400/30" />
              <span className="text-xs text-navy-400">Before Rooster</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-accent-600/70 border border-accent-500/40" />
              <span className="text-xs text-navy-400">After Rooster</span>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div
          className={`border rounded-2xl p-6 md:p-8 transition-all duration-300 ${
            active.isRooster
              ? 'bg-accent-600/10 border-accent-500/30'
              : 'bg-navy-900/40 border-navy-700/50'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3
                  className={`text-lg font-bold ${
                    active.isRooster ? 'text-accent-400' : 'text-white'
                  }`}
                >
                  {active.label}
                </h3>
                <span className="text-sm text-navy-400 font-mono">{active.cost}</span>
              </div>
              <p className="text-sm md:text-base text-navy-200 leading-relaxed mb-4">
                {active.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {active.examples.map((ex) => (
                  <span
                    key={ex}
                    className={`inline-block text-xs px-3 py-1 rounded-full ${
                      active.isRooster
                        ? 'bg-accent-500/20 text-accent-300 border border-accent-500/30'
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
                <p className="text-2xl font-bold text-navy-400">{active.offeringsBefore === 0 ? '0' : active.offeringsBefore >= 5 ? '5+' : active.offeringsBefore.toString()}</p>
                <p className="text-[10px] uppercase tracking-wider text-navy-500 mt-1">Before</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${active.isRooster ? 'text-accent-400' : 'text-white'}`}>
                  {active.offeringsAfter >= 5 ? '5+' : active.offeringsAfter.toString()}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-navy-500 mt-1">After</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Insight */}
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="border border-navy-700/50 rounded-xl p-6">
            <p className="text-2xl font-bold text-accent-400 mb-1">$</p>
            <p className="text-sm font-semibold text-white mb-2">Cheap Repetitions</p>
            <p className="text-sm text-navy-300 leading-relaxed">
              Affordable reps build procedural fluency before operators ever touch
              an enterprise simulator.
            </p>
          </div>
          <div className="border border-navy-700/50 rounded-xl p-6">
            <p className="text-2xl font-bold text-accent-400 mb-1">↑</p>
            <p className="text-sm font-semibold text-white mb-2">Elevate the Basics</p>
            <p className="text-sm text-navy-300 leading-relaxed">
              Operators arrive at high-fidelity events with fundamentals already
              locked in — ready to tackle advanced objectives.
            </p>
          </div>
          <div className="border border-navy-700/50 rounded-xl p-6">
            <p className="text-2xl font-bold text-accent-400 mb-1">★</p>
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
