import { siteConfig } from '@/content/siteConfig';
import { MarketGap } from '@/components/MarketGap';

const PIPELINE_ROWS = [
  [
    'Voice Capture',
    'Transcription',
    'Normalization',
    'Intent Routing',
    'Repair Loop',
  ],
  [
    'Probabilistic Loop',
    'Deterministic Action',
    'Fighter / Entity Response',
    'Game UI Update',
    'Feedback / Debrief',
  ],
];

export default function HomePage() {
  const { links } = siteConfig;

  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════ */}
      <section className="relative bg-navy-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent-600/8 via-transparent to-transparent pointer-events-none" />
        <div className="container-wide relative py-24 md:py-32 lg:py-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Rooster"
            className="h-16 w-16 object-contain invert mb-8"
          />
          <p className="text-xs font-medium text-accent-400 uppercase tracking-[0.2em] mb-6">
            Early-Stage Defense Training Venture
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6 max-w-4xl text-balance">
            Train More.{' '}
            <br className="hidden sm:block" />
            Be Ready.
          </h1>
          <p className="text-lg md:text-xl text-navy-200 font-medium max-w-2xl leading-relaxed mb-4">
            Portable, voice-driven Command and Control (C2) training that
            supplements scarce enterprise simulators.
          </p>
          <p className="text-base text-navy-300 max-w-3xl leading-relaxed mb-10">
            Rooster is a suite of accessible C2 training tools so operators can
            get more reps before high-value simulator events. Working prototypes
            demonstrate that effective skill-building doesn&apos;t require
            enterprise-scale infrastructure&nbsp;&mdash; it requires smart design,
            realistic voice interaction, and the ability to train anywhere, anytime.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href={links.overviewVideo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-accent-600 text-white text-sm font-semibold rounded-lg hover:bg-accent-500 transition-colors"
            >
              Watch Intro Video
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-navy-600 text-navy-300 text-sm font-semibold rounded-lg hover:bg-navy-800 hover:text-white transition-colors"
            >
              <svg className="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          VIDEO SAMPLES
          ═══════════════════════════════════════════ */}
      <section id="samples" className="section-padding bg-navy-900 text-white scroll-mt-16">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="text-xs font-medium text-accent-400 uppercase tracking-[0.2em] mb-3">
              Live Demonstrations
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Video Samples
            </h2>
            <div className="h-0.5 w-12 bg-accent-500 rounded-full mb-6" />
            <p className="text-base md:text-lg text-navy-200 leading-relaxed">
              A direct look at Rooster in action. These samples show representative
              C2 training vignettes with realistic and adjustable pacing across
              different mission types.
            </p>
          </div>

          <div className="mt-10 space-y-8">
            <div className="rounded-2xl border border-accent-500/25 bg-gradient-to-br from-accent-500/10 via-navy-950/85 to-navy-950 p-4 md:p-6 shadow-2xl shadow-black/20">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center rounded-full border border-accent-500/40 bg-accent-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-300">
                  Overview
                </span>
                <span className="inline-flex items-center rounded-full border border-navy-600 bg-navy-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy-200">
                  Intro Video
                </span>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div className="overflow-hidden rounded-xl border border-navy-700/80 bg-black aspect-video relative group">
                  <a
                    href={links.overviewVideo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://img.youtube.com/vi/A8JCD8vycfY/hqdefault.jpg"
                      alt="Rooster intro video overview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600/90 text-white group-hover:bg-red-500 transition-colors shadow-lg">
                        <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                        </svg>
                      </div>
                    </div>
                  </a>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-300 mb-3">
                    First Look
                  </p>
                  <h3 className="text-2xl font-bold text-white tracking-tight mb-3">
                    Start with the short overview
                  </h3>
                  <p className="text-sm md:text-base text-navy-200 leading-relaxed">
                    This video is the clearest first pass at the concept. It gives
                    viewers the main idea before jumping into the longer, full-length
                    mission playthroughs below.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-navy-300 mb-4">
                Full-Length Video Playthroughs
              </p>
              <div className="grid gap-8 lg:grid-cols-2">
            {/* Video 1 — ABM Mode */}
            <div className="rounded-2xl border border-navy-700/70 bg-navy-950/70 p-4 md:p-6 shadow-2xl shadow-black/20">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center rounded-full border border-accent-500/40 bg-accent-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-300">
                  ABM Mode
                </span>
                <span className="inline-flex items-center rounded-full border border-navy-600 bg-navy-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy-200">
                  Level 4
                </span>
              </div>

              <div className="overflow-hidden rounded-xl border border-navy-700/80 bg-black aspect-video relative group">
                <a
                  href="https://www.youtube.com/watch?v=NKpMvW_IjVg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/thumbnail1.png"
                    alt="ABM Mode Level 4 Playthrough"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600/90 text-white group-hover:bg-red-500 transition-colors shadow-lg">
                      <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                      </svg>
                    </div>
                  </div>
                </a>
              </div>

              <p className="mt-4 text-sm text-navy-300 leading-relaxed">
                Air Battle Manager mode — a full Level 4 playthrough demonstrating
                control of ground and air defenses, threat detection, engagement
                sequencing, and voice-driven command flow.
              </p>
            </div>

            {/* Video 2 — Air-to-Air DCA */}
            <div className="rounded-2xl border border-navy-700/70 bg-navy-950/70 p-4 md:p-6 shadow-2xl shadow-black/20">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center rounded-full border border-accent-500/40 bg-accent-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-300">
                  Air-to-Air Mode
                </span>
                <span className="inline-flex items-center rounded-full border border-navy-600 bg-navy-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy-200">
                  Defensive Counter Air
                </span>
              </div>

              <div className="overflow-hidden rounded-xl border border-navy-700/80 bg-black aspect-video relative group">
                <a
                  href="https://www.youtube.com/watch?v=hv-QZgH368o"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/thumbnail3.png"
                    alt="Air-to-Air Defensive Counter Air Mission"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600/90 text-white group-hover:bg-red-500 transition-colors shadow-lg">
                      <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                      </svg>
                    </div>
                  </div>
                </a>
              </div>

              <p className="mt-4 text-sm text-navy-300 leading-relaxed">
                Air-to-air mode — a defensive counter air mission showcasing fighter
                management, intercept coordination, and real-time voice commands.
              </p>
            </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          THE TRAINING GAP
          ═══════════════════════════════════════════ */}
      <section id="training-gap" className="section-padding bg-gradient-to-b from-white via-white to-navy-50/80 border-y border-navy-100/80 scroll-mt-16">
        <div className="container-narrow">
          <p className="text-xs font-medium text-accent-600 uppercase tracking-[0.2em] mb-3">
            The Problem
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 tracking-tight mb-4">
            The Training Gap
          </h2>
          <div className="h-0.5 w-12 bg-accent-500 rounded-full mb-8" />

          <div className="space-y-5 text-base md:text-lg text-navy-700 leading-relaxed">
            <p>
              Command-and-control training today depends heavily on enterprise
              simulators&nbsp;&mdash; complex, expensive, and scarce systems that
              serve as the primary pathway for operator skill development.
            </p>
            <p>
              The problem isn&apos;t the simulators themselves. They&apos;re
              essential for high-fidelity training events. The problem is{' '}
              <strong className="text-navy-900">access</strong>.
            </p>
            <p>
              Training units face limited simulator availability, scheduling
              constraints, high operating costs, and instructor dependencies.
              Operators often arrive at high-end simulator events without sufficient
              preparatory repetitions&nbsp;&mdash; reducing the effectiveness of
              that expensive simulator time.
            </p>
            <p>
              The result: a readiness gap between classroom knowledge and simulator
              proficiency that costs time, money, and training quality.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                stat: 'Limited',
                label: 'Simulator Availability',
                desc: 'Enterprise systems are shared across units with constrained scheduling windows',
              },
              {
                stat: 'High',
                label: 'Cost Per Session',
                desc: 'Infrastructure, staffing, and maintenance make each simulator hour expensive',
              },
              {
                stat: 'Few',
                label: 'Reps Before Events',
                desc: 'Operators get limited practice before high-value simulator training',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="border border-navy-100 rounded-xl bg-white/80 p-6 shadow-sm shadow-navy-200/40"
              >
                <p className="text-2xl font-bold text-navy-900 mb-1">
                  {item.stat}
                </p>
                <p className="text-sm font-semibold text-navy-700 mb-2">
                  {item.label}
                </p>
                <p className="text-sm text-navy-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MARKET GAP
          ═══════════════════════════════════════════ */}
      <MarketGap />

      {/* ═══════════════════════════════════════════
          THE SOLUTION
          ═══════════════════════════════════════════ */}
      <section id="solution" className="section-padding bg-navy-50 scroll-mt-16">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="text-xs font-medium text-accent-600 uppercase tracking-[0.2em] mb-3">
              The Approach
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 tracking-tight mb-4">
              Rooster: Portable C2 Training
            </h2>
            <div className="h-0.5 w-12 bg-accent-500 rounded-full mb-8" />
            <p className="text-base md:text-lg text-navy-700 leading-relaxed mb-4">
              Rooster is a portable, voice-driven command-and-control training
              platform. It&apos;s designed to supplement&nbsp;&mdash; not
              replace&nbsp;&mdash; enterprise simulators by giving operators
              accessible, repeatable training reps for earlier skill-building.
            </p>
            <p className="text-base md:text-lg text-navy-700 leading-relaxed">
              By providing a lower-cost, higher-frequency training pathway, Rooster
              helps operators arrive at high-end simulator events better
              prepared&nbsp;&mdash; improving readiness and making better use of
              scarce simulator time.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {/* Phase 1 */}
            <div className="bg-white border border-navy-100 rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-50 text-accent-700 text-sm font-bold border border-accent-200">
                  1
                </span>
                <span className="text-xs font-medium text-accent-700 uppercase tracking-wider">
                  Available Now
                </span>
              </div>
              <h3 className="text-lg font-semibold text-navy-900 mb-3">
                Lightweight Web Demo
              </h3>
              <p className="text-sm text-navy-600 leading-relaxed mb-5">
                A playable, browser-based prototype for concept demonstration and
                familiarization. Accessible from any device with a web
                browser&nbsp;&mdash; no installation required.
              </p>
              <a
                href={links.prototype}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors"
              >
                Try the Demo
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Phase 2 */}
            <div className="bg-white border border-navy-100 rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-100 text-navy-700 text-sm font-bold">
                  2
                </span>
                <span className="text-xs font-medium text-navy-500 uppercase tracking-wider">
                  In Development
                </span>
              </div>
              <h3 className="text-lg font-semibold text-navy-900 mb-3">
                Local Advanced Prototype
              </h3>
              <p className="text-sm text-navy-600 leading-relaxed">
                A more advanced local prototype that demonstrates the full
                voice-command pipeline and simulation logic. Designed for controlled
                demonstration environments and internal validation.
              </p>
            </div>

            {/* Phase 3 */}
            <div className="bg-white border border-navy-100 rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-100 text-navy-700 text-sm font-bold">
                  3
                </span>
                <span className="text-xs font-medium text-navy-500 uppercase tracking-wider">
                  Future Vision
                </span>
              </div>
              <h3 className="text-lg font-semibold text-navy-900 mb-3">
                Scalable Platform
              </h3>
              <p className="text-sm text-navy-600 leading-relaxed">
                A future hosted, API-enabled version with expanded capabilities
                including multi-user scenarios, curriculum integration, and
                analytics. Designed for institutional deployment and scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════ */}
      <section id="how-it-works" className="section-padding bg-gradient-to-b from-navy-50/80 via-white to-accent-50/20 border-y border-navy-100/70 scroll-mt-16">
        <div className="container-narrow">
          <p className="text-xs font-medium text-accent-600 uppercase tracking-[0.2em] mb-3">
            Technology Approach
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 tracking-tight mb-4">
            How It Works
          </h2>
          <div className="h-0.5 w-12 bg-accent-500 rounded-full mb-8" />

          <p className="text-base md:text-lg text-navy-700 leading-relaxed mb-8">
            Rooster processes voice commands through a structured interaction
            pipeline designed for training fidelity. Each command flows through
            multiple processing stages that balance realism with constructive
            feedback&nbsp;&mdash; ensuring operators receive meaningful training
            value from every interaction.
          </p>

          {/* Pipeline Visualization */}
          <div className="bg-navy-950 rounded-xl p-6 md:p-8 mb-10">
            <p className="text-xs font-medium text-accent-400 uppercase tracking-[0.2em] mb-4">
              Voice-Driven, AI-Enabled Pipeline
            </p>
            <div className="space-y-3 text-[11px] font-semibold uppercase tracking-wide text-white">
              {PIPELINE_ROWS.map((row, rowIndex) => (
                <div
                  key={`row-${rowIndex}`}
                  className="flex flex-col gap-2 md:flex-row md:gap-0"
                >
                  {row.map((step, stepIndex) => (
                    <div
                      key={step}
                      className="flex flex-col items-stretch md:flex-1 md:flex-row md:items-center"
                    >
                      <div className="flex min-h-12 w-full items-center justify-center border border-sky-400 bg-navy-900 px-3 py-2 text-center leading-tight md:flex-1">
                        {step}
                      </div>
                      {stepIndex < row.length - 1 && (
                        <div className="flex items-center justify-center py-1 text-sky-400 md:w-4 md:py-0">
                          <svg
                            className="h-4 w-4 flex-shrink-0 rotate-90 md:rotate-0"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M5 2l6 6-6 6V2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-navy-500 leading-relaxed mb-10">
            This pipeline is a defendable training interaction architecture&nbsp;&mdash;
            not marketing language. Each stage serves a specific purpose in producing
            realistic, instructionally valuable training interactions.
          </p>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-base font-semibold text-navy-900 mb-2">
                Realistic Voice Interaction
              </h3>
              <p className="text-sm text-navy-600 leading-relaxed">
                Operators speak commands naturally. The system captures, normalizes,
                and interprets spoken input&nbsp;&mdash; handling the ambiguity and
                variation inherent in real voice communication.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-navy-900 mb-2">
                Intelligent Repair &amp; Clarification
              </h3>
              <p className="text-sm text-navy-600 leading-relaxed">
                When commands are ambiguous or incomplete, the pipeline engages
                repair and clarification loops&nbsp;&mdash; mirroring real-world
                patterns where operators refine and confirm instructions.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-navy-900 mb-2">
                Probabilistic Realism
              </h3>
              <p className="text-sm text-navy-600 leading-relaxed">
                Outcomes incorporate probabilistic elements to prevent rote
                memorization and encourage adaptive decision-making&nbsp;&mdash; a
                critical skill in dynamic operational environments.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-navy-900 mb-2">
                Structured Feedback &amp; Debrief
              </h3>
              <p className="text-sm text-navy-600 leading-relaxed">
                Every training iteration concludes with structured feedback,
                supporting deliberate practice and measurable improvement over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHY NOW
          ═══════════════════════════════════════════ */}
      <section id="why-now" className="section-padding bg-navy-900 text-white scroll-mt-16">
        <div className="container-narrow">
          <p className="text-xs font-medium text-accent-400 uppercase tracking-[0.2em] mb-3">
            Opportunity
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Why Now
          </h2>
          <div className="h-0.5 w-12 bg-accent-500 rounded-full mb-8" />

          <div className="space-y-5 text-base md:text-lg text-navy-200 leading-relaxed">
            <p>
              The need for scalable, accessible training has never been more
              pressing. Demand for qualified C2 operators continues to grow while
              enterprise simulator capacity remains constrained by cost and
              infrastructure limitations.
            </p>
            <p>
              At the same time, voice AI, browser-based computing, and simulation
              technology have matured to the point where meaningful training
              experiences can be delivered outside traditional enterprise
              systems&nbsp;&mdash; at a fraction of the cost.
            </p>
            <p>
              Rooster is positioned to fill the gap between classroom instruction
              and high-end simulator events. The goal is not to replace enterprise
              simulators, but to ensure operators make the most of every hour they
              get in one.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: 'Growing Demand',
                desc: 'Increasing need for qualified C2 operators outpaces simulator availability and throughput capacity.',
              },
              {
                title: 'Budget Pressure',
                desc: 'Training organizations need cost-effective supplements to maximize the return on expensive simulator investments.',
              },
              {
                title: 'Technology Readiness',
                desc: 'Voice AI, browser capabilities, and simulation frameworks have matured enough to deliver realistic lightweight training.',
              },
              {
                title: 'Supplement, Not Replace',
                desc: 'Rooster complements existing infrastructure — improving how operators prepare for and benefit from scarce simulator time.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border border-navy-700 rounded-xl p-6"
              >
                <h3 className="text-base font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-navy-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PROTOTYPE / DEMO
          ═══════════════════════════════════════════ */}
      <section id="prototype" className="section-padding bg-gradient-to-b from-white via-accent-50/30 to-navy-50/80 border-y border-navy-100/80 scroll-mt-16">
        <div className="container-narrow text-center">
          <p className="text-xs font-medium text-accent-600 uppercase tracking-[0.2em] mb-3">
            Lightweight Web Demo
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 tracking-tight mb-4">
            Try the Lightweight Web Demo
          </h2>
          <div className="h-0.5 w-12 bg-accent-500 rounded-full mb-8 mx-auto" />

          <p className="text-base md:text-lg text-navy-700 leading-relaxed max-w-2xl mx-auto mb-4">
            The lightweight web demo is live and playable. It demonstrates
            core interaction patterns including voice-driven command input, scenario
            response, and feedback loops&nbsp;&mdash; all running in the browser.
          </p>
          <p className="text-sm text-navy-500 leading-relaxed max-w-2xl mx-auto mb-10">
            This is an early concept demonstration, not a finished product.
            It&apos;s designed to show the interaction model and gather feedback
            from operators, instructors, and training stakeholders.
          </p>

          {/* Demo preview card */}
          <a
            href={links.prototype}
            target="_blank"
            rel="noopener noreferrer"
            className="block max-w-lg mx-auto border border-navy-200 rounded-xl overflow-hidden bg-navy-50 hover:shadow-md transition-shadow group mb-8"
          >
            <div className="aspect-video bg-navy-100 relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/thumbnail2.png"
                alt="Rooster lightweight web demo screenshot"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-600/90 text-white group-hover:bg-accent-500 transition-colors shadow-lg">
                  <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm font-semibold text-navy-900 mb-1">
                ADAFCO Lightweight Web Demo
              </p>
              <p className="text-xs text-navy-500">
                adafco.vercel.app &middot; Browser-based &middot; No install required
              </p>
            </div>
          </a>

          <a
            href={links.prototype}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-500 transition-colors text-base"
          >
            Launch Lightweight Web Demo
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MARKET
          ═══════════════════════════════════════════ */}
      <section id="market" className="section-padding bg-gradient-to-b from-navy-50/80 via-white to-white border-y border-navy-100/70 scroll-mt-16">
        <div className="container-narrow">
          <p className="text-xs font-medium text-accent-600 uppercase tracking-[0.2em] mb-3">
            Market
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 tracking-tight mb-4">
            Initial Customer
          </h2>
          <div className="h-0.5 w-12 bg-accent-500 rounded-full mb-8" />

          <div className="space-y-5 text-base md:text-lg text-navy-700 leading-relaxed mb-10">
            <p>
              Rooster&apos;s beachhead customer is{' '}
              <strong className="text-navy-900">
                U.S. military schoolhouses and training squadrons
              </strong>{' '}
              responsible for producing command-and-control operators. These
              organizations have the clearest need for supplemental training tools
              and the most direct path to validating the concept.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border border-navy-100 rounded-xl bg-white/80 p-6 shadow-sm shadow-navy-200/40">
              <h3 className="text-sm font-semibold text-navy-900 uppercase tracking-wider mb-4">
                Primary Market
              </h3>
              <ul className="space-y-3 text-sm text-navy-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-500 flex-shrink-0" />
                  U.S. military C2 schoolhouses
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-500 flex-shrink-0" />
                  Training squadrons producing C2 operators
                </li>
              </ul>
            </div>
            <div className="border border-navy-100 rounded-xl bg-white/80 p-6 shadow-sm shadow-navy-200/40">
              <h3 className="text-sm font-semibold text-navy-900 uppercase tracking-wider mb-4">
                Expansion Markets
              </h3>
              <ul className="space-y-3 text-sm text-navy-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-navy-300 flex-shrink-0" />
                  Unit-level training shops
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-navy-300 flex-shrink-0" />
                  Allied and NATO training organizations
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-navy-300 flex-shrink-0" />
                  Defense training contractors
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ROADMAP
          ═══════════════════════════════════════════ */}
      <section id="roadmap" className="section-padding bg-navy-50 scroll-mt-16">
        <div className="container-narrow">
          <p className="text-xs font-medium text-accent-600 uppercase tracking-[0.2em] mb-3">
            Roadmap
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 tracking-tight mb-4">
            Where We Are
          </h2>
          <div className="h-0.5 w-12 bg-accent-500 rounded-full mb-10" />

          <div className="space-y-0">
            {/* Current */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-accent-500 ring-4 ring-accent-100 flex-shrink-0" />
                <div className="w-px flex-1 bg-navy-200 mt-2" />
              </div>
              <div className="pb-10">
                <h3 className="text-lg font-semibold text-navy-900 mb-1">
                  Current
                </h3>
                <p className="text-xs font-medium text-accent-600 uppercase tracking-wider mb-3">
                  Now
                </p>
                <ul className="space-y-2 text-sm text-navy-600">
                  <li>Working browser-based prototype (live)</li>
                  <li>Advanced local prototype with voice-command pipeline</li>
                  <li>Venture concept refinement and positioning</li>
                </ul>
              </div>
            </div>

            {/* Next */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-navy-300 ring-4 ring-navy-100 flex-shrink-0" />
                <div className="w-px flex-1 bg-navy-200 mt-2" />
              </div>
              <div className="pb-10">
                <h3 className="text-lg font-semibold text-navy-900 mb-1">
                  Next
                </h3>
                <p className="text-xs font-medium text-navy-500 uppercase tracking-wider mb-3">
                  Near-term
                </p>
                <ul className="space-y-2 text-sm text-navy-600">
                  <li>Public website and demo materials</li>
                  <li>Customer discovery and user feedback</li>
                  <li>Mentorship and advisor engagement</li>
                  <li>Compliance groundwork and business formation</li>
                  <li>IP strategy development</li>
                </ul>
              </div>
            </div>

            {/* Future */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-navy-300 ring-4 ring-navy-100 flex-shrink-0" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy-900 mb-1">
                  Future
                </h3>
                <p className="text-xs font-medium text-navy-500 uppercase tracking-wider mb-3">
                  Long-term
                </p>
                <ul className="space-y-2 text-sm text-navy-600">
                  <li>Pilot kit for initial customer validation</li>
                  <li>Scalable hosted platform deployment</li>
                  <li>Expanded scenario library and curriculum integration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FAQ
          ═══════════════════════════════════════════ */}
      <section className="section-padding bg-gradient-to-b from-white via-navy-50/60 to-white border-y border-navy-100/70 scroll-mt-16">
        <div className="container-narrow">
          <p className="text-xs font-medium text-accent-600 uppercase tracking-[0.2em] mb-3">
            Questions
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 tracking-tight mb-4">
            Frequently Asked
          </h2>
          <div className="h-0.5 w-12 bg-accent-500 rounded-full mb-10" />

          <div className="space-y-8">
            {[
              {
                q: 'Is Rooster a replacement for enterprise simulators?',
                a: 'No. Rooster is designed to supplement enterprise simulators by giving operators more reps before and between high-value simulator events. The goal is to make scarce simulator time more effective, not to replace it.',
              },
              {
                q: 'What stage is the venture in?',
                a: 'Rooster is in early-stage development with working prototypes. We are currently focused on customer discovery, mentorship, and validating the concept with training professionals.',
              },
              {
                q: 'Can I try the prototype?',
                a: 'Yes. The lightweight web demo is live at adafco.vercel.app and runs in any modern browser. It demonstrates the core interaction model and is free to explore.',
              },
              {
                q: 'Who is the target user?',
                a: 'The primary users are C2 operators in training, and the primary buyers are military schoolhouses and training squadrons responsible for producing those operators.',
              },
              {
                q: 'Is there a business entity?',
                a: 'Yes. Rooster C2 LLC has been formally established.',
              },
              {
                q: 'Is there a patent?',
                a: 'IP strategy is currently under review. The present focus is on unclassified validation, customer discovery, and pilot-readiness.',
              },
            ].map((item) => (
              <div key={item.q} className="rounded-xl border border-navy-100 bg-white/80 p-6 shadow-sm shadow-navy-200/40">
                <h3 className="text-base font-semibold text-navy-900 mb-2">
                  {item.q}
                </h3>
                <p className="text-sm text-navy-600 leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CONNECT
          ═══════════════════════════════════════════ */}
      <section id="connect" className="section-padding bg-navy-950 text-white scroll-mt-16">
        <div className="container-narrow text-center">
          <p className="text-xs font-medium text-accent-400 uppercase tracking-[0.2em] mb-3">
            Get in Touch
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Let&apos;s Connect
          </h2>
          <div className="h-0.5 w-12 bg-accent-500 rounded-full mb-8 mx-auto" />

          <p className="text-base md:text-lg text-navy-200 leading-relaxed max-w-2xl mx-auto mb-4">
            Rooster is currently in customer discovery and early venture
            development. If you&apos;re involved in C2 training, defense
            simulation, or startup mentorship, I&apos;d welcome the opportunity to
            connect.
          </p>
          <p className="text-sm text-navy-400 leading-relaxed max-w-xl mx-auto mb-10">
            Currently exploring conversations around pilot opportunities,
            mentorship, and early feedback from training professionals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-500 transition-colors"
            >
              <svg className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Connect on LinkedIn
            </a>
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 border border-navy-500 text-navy-200 font-semibold rounded-lg hover:bg-navy-800 hover:text-white transition-colors"
            >
              Request a Conversation
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
