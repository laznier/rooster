'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RISKS, relevantRisksForRole, type RiskId } from '@/lib/validation/risks';

// ============================================================================
// YouTube IFrame API — minimal typings + loader
// ============================================================================
declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const VIDEO_ID = 'A8JCD8vycfY'; // "Rooster C2" AI-Enabled Simulator intro
const REQUIRED_PCT = 50;        // gate threshold (% of video watched)

// Approximate target number of user turns for the chat progress bar.
// The interviewer is told to wrap up around 10–14 exchanges; we display
// progress against this so respondents can see they're making headway.
const TARGET_USER_TURNS = 12;

function loadYouTubeApi(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return;
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }
    const existing = document.getElementById('yt-iframe-api');
    if (!existing) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prev) prev();
      resolve();
    };
  });
}

// ============================================================================
// Types
// ============================================================================
type Stage = 'gate' | 'consent' | 'video' | 'intake' | 'chat' | 'riskMicro' | 'summary' | 'done';

interface Intake {
  roleCategory: string;
  experienceLevel: string;
  relationship: string;
  name: string;
  email: string;
  followupConsent: boolean;
}

interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

interface SummaryStruct {
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
  evidence_strength: string;
  sensitive_info_flag: boolean;
}

interface RiskAnswer {
  relevant: boolean;
  p_failure_1_7: number | null;
  impact_1_7: number | null;
  confidence_1_5: number | null;
  pert_min: number | null;
  pert_likely: number | null;
  pert_max: number | null;
}

type RiskAnswers = Partial<Record<RiskId, RiskAnswer>>;

function blankAnswer(): RiskAnswer {
  return {
    relevant: true,
    p_failure_1_7: null,
    impact_1_7: null,
    confidence_1_5: null,
    pert_min: null,
    pert_likely: null,
    pert_max: null,
  };
}

const ROLE_CATEGORIES = [
  'Active-duty / uniformed (C2 / aircrew / operations)',
  'Instructor / schoolhouse / training squadron',
  'Defense civilian / DoD',
  'Defense contractor / industry',
  'Researcher / academic',
  'Investor / venture / accelerator',
  'Other',
];

const EXPERIENCE_LEVELS = [
  '0–2 years',
  '3–7 years',
  '8–15 years',
  '15+ years',
];

// ============================================================================
// Component
// ============================================================================
export function ValidationFlow({ initialInvite }: { initialInvite: string }) {
  const [stage, setStage] = useState<Stage>(initialInvite ? 'consent' : 'gate');
  const [invite, setInvite] = useState(initialInvite);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Consent + video tracking
  const [consent, setConsent] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [videoPct, setVideoPct] = useState(0);
  const [manualConfirm, setManualConfirm] = useState(false);
  const playerRef = useRef<any>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Intake
  const [intake, setIntake] = useState<Intake>({
    roleCategory: '',
    experienceLevel: '',
    relationship: '',
    name: '',
    email: '',
    followupConsent: false,
  });

  // Chat
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [draft, setDraft] = useState('');
  const [chatComplete, setChatComplete] = useState(false);
  const [opener, setOpener] = useState<string>('');

  // Summary
  const [summaryText, setSummaryText] = useState('');
  const [summaryStruct, setSummaryStruct] = useState<SummaryStruct | null>(null);
  const [edits, setEdits] = useState('');

  // Per-risk micro-survey answers (R1…R5)
  const [riskAnswers, setRiskAnswers] = useState<RiskAnswers>({});
  const relevantRiskIds = useMemo<RiskId[]>(
    () => relevantRisksForRole(intake.roleCategory),
    [intake.roleCategory],
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Stage: start session when consent stage entered with valid invite
  // ─────────────────────────────────────────────────────────────────────────
  const startSession = useCallback(async () => {
    if (!invite.trim()) {
      setError('Invite token required.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/validation/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invite: invite.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error === 'invalid_invite' ? 'That invite token is not valid or has been deactivated.' : 'Could not start session.');
        setStage('gate'); // let the user re-enter
        return;
      }
      setSessionId(data.sessionId);

      // Resume from server-side state (so a refresh / new tab on the same
      // invite picks up exactly where the respondent left off).
      const st = data.state;
      if (st) {
        if (typeof st.consent === 'boolean') setConsent(st.consent);
        if (typeof st.videoStarted === 'boolean') setVideoStarted(st.videoStarted);
        if (typeof st.videoCompleted === 'boolean') setVideoCompleted(st.videoCompleted);
        if (typeof st.videoPct === 'number') setVideoPct(st.videoPct);
        if (st.intake) setIntake({
          roleCategory: st.intake.roleCategory ?? '',
          experienceLevel: st.intake.experienceLevel ?? '',
          relationship: st.intake.relationship ?? '',
          name: st.intake.name ?? '',
          email: st.intake.email ?? '',
          followupConsent: !!st.intake.followupConsent,
        });
        if (Array.isArray(st.transcript) && st.transcript.length > 0) {
          setMessages(st.transcript as ChatMsg[]);
          setOpener(st.transcript.find((m: ChatMsg) => m.role === 'assistant')?.content ?? '');
        }
        if (st.summaryText) setSummaryText(st.summaryText);
        if (st.summaryStruct) setSummaryStruct(st.summaryStruct as SummaryStruct);
      }

      setStage(decideResumeStage(st, data.resumed));
    } catch {
      setError('Network error — please try again.');
    } finally {
      setBusy(false);
    }
  }, [invite]);

  // If invite arrived in URL, auto-start.
  useEffect(() => {
    if (initialInvite && !sessionId && stage === 'consent') {
      startSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If we resumed straight into the chat stage but the transcript was empty
  // (intake done previously, no messages sent), fetch the standardized
  // opener so the respondent sees the same first prompt.
  useEffect(() => {
    if (stage !== 'chat' || messages.length > 0) return;
    let cancelled = false;
    (async () => {
      try {
        const op = await fetch('/api/validation/chat?opener=1').then((r) => r.json());
        if (cancelled) return;
        const opening = op?.opener || 'Thanks for taking the time. To start: what is your role?';
        setOpener(opening);
        setMessages([{ role: 'assistant', content: opening }]);
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // ─────────────────────────────────────────────────────────────────────────
  // Stage: video — YouTube IFrame API
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (stage !== 'video') return;
    let cancelled = false;
    loadYouTubeApi().then(() => {
      if (cancelled) return;
      playerRef.current = new window.YT.Player('rooster-video', {
        videoId: VIDEO_ID,
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onStateChange: (e: any) => {
            // 1=playing, 0=ended
            if (e.data === 1) setVideoStarted(true);
            if (e.data === 0) {
              setVideoCompleted(true);
              setVideoPct(100);
            }
          },
        },
      });
      pollRef.current = setInterval(() => {
        const p = playerRef.current;
        if (!p || typeof p.getCurrentTime !== 'function') return;
        const cur = p.getCurrentTime?.() ?? 0;
        const dur = p.getDuration?.() ?? 0;
        if (dur > 0) {
          const pct = Math.min(100, Math.round((cur / dur) * 100));
          setVideoPct((prev) => (pct > prev ? pct : prev));
          if (pct >= REQUIRED_PCT) setVideoCompleted(true);
        }
      }, 1500);
    });
    return () => {
      cancelled = true;
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
      try { playerRef.current?.destroy?.(); } catch { /* noop */ }
      playerRef.current = null;
    };
  }, [stage]);

  const canStartInterview = consent && (videoCompleted || (manualConfirm && videoPct >= 50));

  // ─────────────────────────────────────────────────────────────────────────
  // Submit intake → start chat
  // ─────────────────────────────────────────────────────────────────────────
  const submitIntake = useCallback(async () => {
    if (!sessionId) return;
    if (!intake.roleCategory || !intake.experienceLevel) {
      setError('Please select your role and experience level.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/validation/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          consent: true,
          videoStarted,
          videoCompleted,
          videoPct,
          roleCategory: intake.roleCategory,
          experienceLevel: intake.experienceLevel,
          relationship: intake.relationship || undefined,
          name: intake.name || undefined,
          email: intake.email || undefined,
          followupConsent: intake.followupConsent,
        }),
      });
      if (!res.ok) {
        setError('Could not save intake.');
        return;
      }
      // Fetch standardized opener and seed chat
      const op = await fetch('/api/validation/chat?opener=1').then((r) => r.json()).catch(() => null);
      const opening = op?.opener || 'Thanks for taking the time. To start: what is your role?';
      setOpener(opening);
      setMessages([{ role: 'assistant', content: opening }]);
      setStage('chat');
    } catch {
      setError('Network error — please try again.');
    } finally {
      setBusy(false);
    }
  }, [sessionId, intake, videoStarted, videoCompleted, videoPct]);

  // ─────────────────────────────────────────────────────────────────────────
  // Chat turn
  // ─────────────────────────────────────────────────────────────────────────
  const sendTurn = useCallback(async () => {
    if (!sessionId || !draft.trim() || busy) return;
    const userMsg = draft.trim();
    setMessages((m) => [...m, { role: 'user', content: userMsg }]);
    setDraft('');
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/validation/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, userMessage: userMsg }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError('The interviewer is unavailable. Please try again in a moment.');
        // Re-pop the user message so they can retry
        setMessages((m) => m.slice(0, -1));
        setDraft(userMsg);
        return;
      }
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
      if (data.complete) setChatComplete(true);
    } catch {
      setError('Network error — please try again.');
      setMessages((m) => m.slice(0, -1));
      setDraft(userMsg);
    } finally {
      setBusy(false);
    }
  }, [sessionId, draft, busy]);

  // ─────────────────────────────────────────────────────────────────────────
  // Summarize
  // ─────────────────────────────────────────────────────────────────────────
  const summarize = useCallback(async () => {
    if (!sessionId) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/validation/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError('Could not generate summary.');
        return;
      }
      setSummaryText(data.summary_text || '');
      setSummaryStruct(data.summary_struct || null);
      setStage('summary');
    } catch {
      setError('Network error — please try again.');
    } finally {
      setBusy(false);
    }
  }, [sessionId]);

  const confirmSummary = useCallback(async (confirmed: boolean) => {
    if (!sessionId) return;
    setBusy(true);
    try {
      await fetch('/api/validation/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, confirmed, edits: edits.trim() || undefined }),
      });
      setStage('done');
    } finally {
      setBusy(false);
    }
  }, [sessionId, edits]);

  // Submit micro-survey answers, then trigger summarize.
  const submitRiskSurvey = useCallback(async () => {
    if (!sessionId) return;
    setBusy(true);
    setError(null);
    try {
      // Drop empty answers; require at least one numeric score before submit.
      const answers: RiskAnswers = {};
      for (const id of Object.keys(riskAnswers) as RiskId[]) {
        const a = riskAnswers[id];
        if (!a) continue;
        if (!a.relevant) {
          answers[id] = { ...a, p_failure_1_7: null, impact_1_7: null, confidence_1_5: null,
                          pert_min: null, pert_likely: null, pert_max: null };
        } else {
          answers[id] = a;
        }
      }
      const res = await fetch('/api/validation/risk-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, answers }),
      });
      if (!res.ok) {
        setError('Could not save risk survey. You can still continue.');
      }
      // Always proceed to summarize even if the save partially failed; the
      // chat transcript and any prior progress are still recorded.
      await summarize();
    } catch {
      setError('Network error — please try again.');
    } finally {
      setBusy(false);
    }
  }, [sessionId, riskAnswers, summarize]);

  const userTurns = useMemo(() => messages.filter((m) => m.role === 'user').length, [messages]);

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <div className="container-narrow py-8 sm:py-12 md:py-16">
        <header className="mb-10">
          <p className="text-xs font-medium text-accent-400 uppercase tracking-[0.2em] mb-3">
            Validation · Customer Discovery
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
            &ldquo;Rooster C2&rdquo; AI-Enabled Simulator — Validation Interview
          </h1>
          <div className="h-0.5 w-12 bg-accent-500 rounded-full" />
          <ProgressBar stage={stage} />
        </header>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {stage === 'gate' && (
          <Card>
            <h2 className="text-xl font-semibold mb-3">Invite token required</h2>
            <p className="text-sm text-navy-300 leading-relaxed mb-5">
              This interview is invite-only. Please enter the invite token you received,
              or open the link you were sent (it will include the token).
            </p>
            <input
              type="text"
              value={invite}
              onChange={(e) => setInvite(e.target.value)}
              placeholder="invite token"
              className="w-full rounded-lg border border-navy-700 bg-navy-900 px-4 py-3 text-sm text-white placeholder:text-navy-500 focus:border-accent-500 focus:outline-none"
              autoFocus
            />
            <div className="mt-5 flex justify-end">
              <PrimaryButton onClick={startSession} disabled={busy || !invite.trim()}>
                {busy ? 'Verifying…' : 'Continue'}
              </PrimaryButton>
            </div>
          </Card>
        )}

        {stage === 'consent' && (
          <Card>
            <h2 className="text-xl font-semibold mb-3">Before we begin</h2>
            <ul className="space-y-3 text-sm text-navy-200 leading-relaxed mb-5 list-disc pl-5">
              <li>
                <span className="font-semibold text-white">Unclassified only.</span>{' '}
                Do not provide classified, CUI, sensitive operational, proprietary,
                personal, or government-restricted information. Keep all feedback
                general and unclassified.
              </li>
              <li>
                &ldquo;Rooster C2&rdquo; AI-Enabled Simulator is an early-stage training
                concept and is{' '}
                <span className="font-semibold text-white">not intended for real-world
                mission planning or operational decision-making</span>.
              </li>
              <li>
                Your feedback may be used to improve &ldquo;Rooster C2&rdquo; AI-Enabled
                Simulator and to support AI Venture Velocity Challenge experiment
                documentation. Your name and email are optional and used only for
                follow-up if you opt in.
              </li>
              <li>
                The interview is conducted by an AI interviewer and typically
                takes 6–8 minutes after the 3-minute video.
              </li>
            </ul>
            <label className="flex items-start gap-3 text-sm text-navy-200 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 accent-accent-500"
              />
              <span>
                I understand and consent. I will keep all feedback general and
                unclassified.
              </span>
            </label>
            <div className="mt-6 flex justify-end">
              <PrimaryButton
                onClick={async () => {
                  // Persist consent immediately so a bail-out before the
                  // intake form still leaves a record we can resume from.
                  if (sessionId) {
                    fetch('/api/validation/progress', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ sessionId, consent: true }),
                    }).catch(() => { /* best-effort */ });
                  }
                  setStage('video');
                }}
                disabled={!consent || !sessionId || busy}
              >
                {!sessionId ? 'Verifying invite…' : 'Continue to video'}
              </PrimaryButton>
            </div>
          </Card>
        )}

        {stage === 'video' && (
          <Card>
            <h2 className="text-xl font-semibold mb-2">Watch the 3-minute intro</h2>
            <p className="text-sm text-navy-300 leading-relaxed mb-5">
              Please watch the full video before starting the interview. The
              &ldquo;Start Feedback Interview&rdquo; button unlocks at {REQUIRED_PCT}% watched.
            </p>
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-navy-800 bg-black">
              <div id="rooster-video" className="h-full w-full" />
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-navy-400">
              <span>Watched: {videoPct}%</span>
              <span>{videoCompleted ? 'Threshold reached ✓' : `Required: ${REQUIRED_PCT}%`}</span>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-navy-800">
              <div
                className="h-full bg-accent-500 transition-all"
                style={{ width: `${videoPct}%` }}
              />
            </div>

            {!videoCompleted && videoPct >= 50 && (
              <label className="mt-5 flex items-start gap-3 text-xs text-navy-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={manualConfirm}
                  onChange={(e) => setManualConfirm(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 accent-accent-500"
                />
                <span>
                  Tracking imperfect — I confirm I&rsquo;ve watched the video in full and want to proceed.
                </span>
              </label>
            )}

            <div className="mt-6 flex justify-end">
              <PrimaryButton
                onClick={() => setStage('intake')}
                disabled={!canStartInterview}
              >
                Start Feedback Interview
              </PrimaryButton>
            </div>
          </Card>
        )}

        {stage === 'intake' && (
          <Card>
            <h2 className="text-xl font-semibold mb-2">A bit about you</h2>
            <p className="text-sm text-navy-300 leading-relaxed mb-6">
              This helps the interviewer tailor questions. Required fields are marked.
            </p>
            <div className="space-y-5">
              <Field label="Role category *">
                <select
                  value={intake.roleCategory}
                  onChange={(e) => setIntake({ ...intake, roleCategory: e.target.value })}
                  className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none"
                >
                  <option value="">Select…</option>
                  {ROLE_CATEGORIES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Experience in defense / training *">
                <select
                  value={intake.experienceLevel}
                  onChange={(e) => setIntake({ ...intake, experienceLevel: e.target.value })}
                  className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none"
                >
                  <option value="">Select…</option>
                  {EXPERIENCE_LEVELS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Relationship to C2 training, simulation, or defense (optional, one line)">
                <input
                  type="text"
                  value={intake.relationship}
                  onChange={(e) => setIntake({ ...intake, relationship: e.target.value })}
                  placeholder="e.g. AWACS instructor at training squadron"
                  className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2.5 text-sm text-white placeholder:text-navy-500 focus:border-accent-500 focus:outline-none"
                />
              </Field>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Name (optional)">
                  <input
                    type="text"
                    value={intake.name}
                    onChange={(e) => setIntake({ ...intake, name: e.target.value })}
                    className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none"
                  />
                </Field>
                <Field label="Email (optional, for follow-up)">
                  <input
                    type="email"
                    value={intake.email}
                    onChange={(e) => setIntake({ ...intake, email: e.target.value })}
                    className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none"
                  />
                </Field>
              </div>
              <label className="flex items-start gap-3 text-sm text-navy-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={intake.followupConsent}
                  onChange={(e) => setIntake({ ...intake, followupConsent: e.target.checked })}
                  className="mt-1 h-4 w-4 accent-accent-500"
                />
                <span>I&rsquo;m open to a brief follow-up about &ldquo;Rooster C2&rdquo; AI-Enabled Simulator.</span>
              </label>
            </div>
            <div className="mt-7 flex justify-end">
              <PrimaryButton onClick={submitIntake} disabled={busy}>
                {busy ? 'Saving…' : 'Begin interview'}
              </PrimaryButton>
            </div>
          </Card>
        )}

        {stage === 'chat' && (
          <Card>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Interview</h2>
              <span className="text-xs text-navy-400 whitespace-nowrap">
                {chatComplete
                  ? 'Complete'
                  : `Question ${Math.min(userTurns + 1, TARGET_USER_TURNS)} of ~${TARGET_USER_TURNS}`}
              </span>
            </div>

            {/* Interview-progress bar (separate from the overall stage progress) */}
            <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-navy-800">
              <div
                className="h-full bg-accent-500 transition-all"
                style={{
                  width: `${chatComplete ? 100 : Math.min(100, Math.round((userTurns / TARGET_USER_TURNS) * 100))}%`,
                }}
              />
            </div>

            <p className="text-xs text-navy-400 leading-relaxed mb-5">
              The AI interviewer is neutral and is not selling
              &ldquo;Rooster C2&rdquo; AI-Enabled Simulator. Honest, candid,
              critical feedback is most useful. Keep it general and unclassified.
            </p>

            <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1 sm:pr-2 mb-5">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === 'assistant'
                      ? 'rounded-xl border border-navy-800 bg-navy-900/70 px-3 sm:px-4 py-3 text-sm text-navy-100 leading-relaxed'
                      : 'rounded-xl border border-accent-500/30 bg-accent-500/10 px-3 sm:px-4 py-3 text-sm text-white leading-relaxed ml-4 sm:ml-8'
                  }
                >
                  <p className="text-[10px] uppercase tracking-wider mb-1 text-navy-400">
                    {m.role === 'assistant' ? 'Interviewer' : 'You'}
                  </p>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              ))}
              {busy && (
                <p className="text-xs text-navy-400 italic">Interviewer is thinking…</p>
              )}
            </div>

            {!chatComplete ? (
              <>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      sendTurn();
                    }
                  }}
                  placeholder="Type your answer… (Ctrl+Enter or Cmd+Enter to send)"
                  rows={3}
                  className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3 sm:px-4 py-3 text-base sm:text-sm text-white placeholder:text-navy-500 focus:border-accent-500 focus:outline-none resize-none"
                />
                <div className="mt-3 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-[11px] text-navy-500">
                    Reminder: keep responses general and unclassified.
                  </p>
                  <PrimaryButton onClick={sendTurn} disabled={busy || !draft.trim()}>
                    Send
                  </PrimaryButton>
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-accent-500/40 bg-accent-500/10 px-4 py-4 text-sm text-accent-100">
                <p className="font-semibold mb-2">The interviewer has enough to summarize.</p>
                <p className="text-xs text-navy-200 mb-4">
                  One short calibration step before we wrap: a few numeric scores on
                  the venture’s 5 highest-risk assumptions you’re qualified to evaluate.
                </p>
                <PrimaryButton onClick={() => {
                  // Seed default answers (relevant=true) for the risks tied to this role.
                  setRiskAnswers((prev) => {
                    const next: RiskAnswers = { ...prev };
                    for (const id of relevantRiskIds) {
                      if (!next[id]) next[id] = blankAnswer();
                    }
                    return next;
                  });
                  setStage('riskMicro');
                }} disabled={busy}>
                  Continue to risk calibration
                </PrimaryButton>
              </div>
            )}
          </Card>
        )}

        {stage === 'riskMicro' && (
          <Card>
            <h2 className="text-xl font-semibold mb-2">Quick risk calibration</h2>
            <p className="text-sm text-navy-300 leading-relaxed mb-5">
              Below are the venture&rsquo;s 5 highest-risk assumptions. We&rsquo;ve pre-selected
              the ones your role is best positioned to evaluate — uncheck any you can&rsquo;t
              credibly score, or add others. For each, give a 1–7 probability of failure
              and impact-if-failure, plus an optional three-point estimate. This drives
              the founders&rsquo; risk dashboard.
            </p>

            <div className="space-y-5">
              {RISKS.map((r) => {
                const id = r.id as RiskId;
                const a = riskAnswers[id] ?? blankAnswer();
                const setA = (patch: Partial<RiskAnswer>) =>
                  setRiskAnswers((prev) => ({ ...prev, [id]: { ...(prev[id] ?? blankAnswer()), ...patch } }));
                const isRecommended = relevantRiskIds.includes(id);
                return (
                  <div
                    key={id}
                    className={
                      'rounded-xl border p-4 ' +
                      (a.relevant
                        ? 'border-navy-700 bg-navy-900/60'
                        : 'border-navy-800 bg-navy-950/40 opacity-70')
                    }
                  >
                    <label className="flex items-start gap-3 cursor-pointer mb-3">
                      <input
                        type="checkbox"
                        checked={a.relevant}
                        onChange={(e) => setA({ relevant: e.target.checked })}
                        className="mt-1 h-4 w-4 accent-accent-500"
                      />
                      <span className="flex-1">
                        <span className="block font-semibold text-white">
                          {r.id}. {r.title}{' '}
                          {isRecommended && (
                            <span className="ml-2 inline-block rounded bg-accent-500/20 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-accent-300">
                              your role
                            </span>
                          )}
                        </span>
                        <span className="mt-1 block text-xs text-navy-300 leading-relaxed">
                          {r.description}
                        </span>
                      </span>
                    </label>

                    {a.relevant && (
                      <div className="grid gap-4 md:grid-cols-3 pl-7">
                        <LikertField
                          label="Probability this assumption fails (1 = very unlikely, 7 = almost certain)"
                          max={7}
                          value={a.p_failure_1_7}
                          onChange={(v) => setA({ p_failure_1_7: v })}
                        />
                        <LikertField
                          label="Impact if it fails (1 = nuisance, 7 = venture-killing)"
                          max={7}
                          value={a.impact_1_7}
                          onChange={(v) => setA({ impact_1_7: v })}
                        />
                        <LikertField
                          label="Your confidence in these scores (1 = guess, 5 = high)"
                          max={5}
                          value={a.confidence_1_5}
                          onChange={(v) => setA({ confidence_1_5: v })}
                        />

                        <div className="md:col-span-3">
                          <p className="text-[11px] uppercase tracking-wider text-navy-400 mb-2">
                            Optional three-point estimate — {r.pertMetric.label} ({r.pertMetric.unit})
                          </p>
                          <p className="text-[11px] text-navy-500 mb-2">{r.pertMetric.hint}</p>
                          <div className="grid grid-cols-3 gap-2">
                            <NumField label="min"    value={a.pert_min}    onChange={(v) => setA({ pert_min: v })} />
                            <NumField label="likely" value={a.pert_likely} onChange={(v) => setA({ pert_likely: v })} />
                            <NumField label="max"    value={a.pert_max}    onChange={(v) => setA({ pert_max: v })} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-7 flex justify-end">
              <PrimaryButton onClick={submitRiskSurvey} disabled={busy}>
                {busy ? 'Submitting…' : 'Submit & generate summary'}
              </PrimaryButton>
            </div>
          </Card>
        )}

        {stage === 'summary' && summaryStruct && (
          <Card>
            <h2 className="text-xl font-semibold mb-2">Review your summary</h2>
            <p className="text-sm text-navy-300 leading-relaxed mb-5">
              Please confirm whether this summary accurately captures your feedback.
              You can add corrections in the box below.
            </p>

            <div className="rounded-xl border border-navy-800 bg-navy-900/60 p-5 mb-5">
              <p className="text-sm text-navy-100 leading-relaxed whitespace-pre-wrap">
                {summaryText}
              </p>
            </div>

            <details className="mb-5 rounded-lg border border-navy-800 bg-navy-900/40 p-4">
              <summary className="cursor-pointer text-xs font-semibold text-navy-300 uppercase tracking-wider">
                Structured fields
              </summary>
              <dl className="mt-4 grid gap-3 text-xs md:grid-cols-2">
                {Object.entries(summaryStruct).map(([k, v]) => (
                  <div key={k} className="rounded border border-navy-800 bg-navy-950/60 p-3">
                    <dt className="text-navy-400 mb-1">{k}</dt>
                    <dd className="text-navy-100 break-words">{String(v ?? '')}</dd>
                  </div>
                ))}
              </dl>
            </details>

            <Field label="Corrections or additions (optional)">
              <textarea
                value={edits}
                onChange={(e) => setEdits(e.target.value)}
                rows={4}
                placeholder="Anything the summary got wrong, or additional context you want recorded."
                className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2.5 text-sm text-white placeholder:text-navy-500 focus:border-accent-500 focus:outline-none resize-none"
              />
            </Field>

            <div className="mt-6 flex flex-wrap gap-3 justify-end">
              <SecondaryButton onClick={() => confirmSummary(false)} disabled={busy}>
                Submit as not fully accurate
              </SecondaryButton>
              <PrimaryButton onClick={() => confirmSummary(true)} disabled={busy}>
                {busy ? 'Saving…' : 'Confirm summary'}
              </PrimaryButton>
            </div>
          </Card>
        )}

        {stage === 'done' && (
          <Card>
            <h2 className="text-xl font-semibold mb-3">Thank you</h2>
            <p className="text-sm text-navy-200 leading-relaxed mb-3">
              Your feedback has been recorded. It will inform &ldquo;Rooster C2&rdquo;
              AI-Enabled Simulator&rsquo;s validation work and support AI Venture
              Velocity Challenge experiment documentation.
            </p>
            <p className="text-sm text-navy-300 leading-relaxed">
              You can close this tab.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Small presentational helpers
// ============================================================================
function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-navy-800 bg-navy-900/40 p-4 sm:p-6 md:p-8 shadow-2xl shadow-black/20">
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-navy-300 uppercase tracking-wider mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center rounded-lg bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-500 disabled:cursor-not-allowed disabled:bg-navy-700 disabled:text-navy-400"
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center rounded-lg border border-navy-600 px-5 py-2.5 text-sm font-semibold text-navy-200 transition-colors hover:bg-navy-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function ProgressBar({ stage }: { stage: Stage }) {
  const order: Stage[] = ['gate', 'consent', 'video', 'intake', 'chat', 'riskMicro', 'summary', 'done'];
  const idx = order.indexOf(stage);
  const pct = ((idx + 1) / order.length) * 100;
  return (
    <div className="mt-6">
      <div className="h-1 w-full overflow-hidden rounded-full bg-navy-800">
        <div className="h-full bg-accent-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-[11px] text-navy-400 uppercase tracking-wider">
        Step {idx + 1} of {order.length} · {labelFor(stage)}
      </p>
    </div>
  );
}

function labelFor(s: Stage): string {
  switch (s) {
    case 'gate': return 'Invite';
    case 'consent': return 'Consent';
    case 'video': return 'Watch video';
    case 'intake': return 'Intake';
    case 'chat': return 'Interview';
    case 'riskMicro': return 'Risk calibration';
    case 'summary': return 'Review summary';
    case 'done': return 'Done';
  }
}

function LikertField({
  label, max, value, onChange,
}: { label: string; max: number; value: number | null; onChange: (v: number | null) => void }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-navy-400 mb-2">{label}</p>
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(value === n ? null : n)}
            className={
              'h-8 w-8 rounded-md border text-xs font-semibold transition-colors ' +
              (value === n
                ? 'border-accent-500 bg-accent-500 text-white'
                : 'border-navy-700 bg-navy-900 text-navy-200 hover:border-navy-500')
            }
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function NumField({
  label, value, onChange,
}: { label: string; value: number | null; onChange: (v: number | null) => void }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wider text-navy-400 mb-1">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        value={value ?? ''}
        onChange={(e) => {
          const v = e.target.value;
          if (v === '') onChange(null);
          else {
            const n = Number(v);
            onChange(Number.isFinite(n) ? n : null);
          }
        }}
        className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white focus:border-accent-500 focus:outline-none"
      />
    </label>
  );
}

// Pick the right stage to drop the respondent into based on what's already
// been saved server-side. Used when /api/validation/start returns an existing
// in-progress session.
function decideResumeStage(state: any, _resumed: boolean): Stage {
  if (!state) return 'consent';
  if (state.summaryText && !state.summaryConfirmed) return 'summary';
  const transcript: ChatMsg[] = Array.isArray(state.transcript) ? state.transcript : [];
  const hadUserTurn = transcript.some((m) => m.role === 'user');
  if (hadUserTurn) return 'chat';
  const i = state.intake || {};
  if (i.roleCategory && i.experienceLevel) return 'chat';
  if (state.consent && state.videoCompleted) return 'intake';
  if (state.consent) return 'video';
  return 'consent';
}
