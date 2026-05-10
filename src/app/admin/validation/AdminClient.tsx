'use client';

import { useCallback, useEffect, useState } from 'react';

interface Session {
  id: string;
  invite_token: string;
  started_at: string;
  completed_at: string | null;
  consent_confirmed: boolean;
  video_completed: boolean;
  video_pct: number;
  role_category: string | null;
  experience_level: string | null;
  relationship: string | null;
  name: string | null;
  email: string | null;
  followup_consent: boolean;
  summary_confirmed: boolean;
  sensitive_info_flag: boolean;
  summary_text: string | null;
  summary_struct: Record<string, unknown> | null;
  summary_user_edits: string | null;
  transcript: { role: string; content: string }[] | null;
  tokens_in: number;
  tokens_out: number;
  llm_calls: number;
}

interface UsageStats {
  model: string;
  provider: string;
  totals: { sessions: number; llm_calls: number; tokens_in: number; tokens_out: number; tokens_total: number };
  last_24h: { sessions: number; llm_calls: number; tokens_total: number };
  last_7d: { sessions: number; llm_calls: number; tokens_total: number };
}

interface Invite {
  token: string;
  label: string | null;
  active: boolean;
  used_count: number;
  created_at: string;
  sessions_started: number;
  sessions_completed: number;
}

export function AdminClient() {
  const [token, setToken] = useState('');
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [invites, setInvites] = useState<Invite[] | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  // New-invite form
  const [newToken, setNewToken] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [busyInvite, setBusyInvite] = useState(false);
  const [origin, setOrigin] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') setOrigin(window.location.origin);
  }, []);

  const authHeader = () => ({ Authorization: `Bearer ${token.trim()}` });

  const loadInvites = useCallback(async () => {
    if (!token.trim()) return;
    try {
      const res = await fetch('/api/validation/invites', { headers: authHeader() });
      if (!res.ok) {
        setError(res.status === 401 ? 'Invalid admin token.' : 'Could not load invites.');
        setInvites(null);
        return;
      }
      const data = await res.json();
      setInvites(data.invites || []);
    } catch {
      setError('Network error.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadUsage = useCallback(async () => {
    if (!token.trim()) return;
    try {
      const res = await fetch('/api/validation/usage', { headers: authHeader() });
      if (!res.ok) { setUsage(null); return; }
      setUsage(await res.json());
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const createInvite = useCallback(async () => {
    if (!token.trim()) return;
    setBusyInvite(true);
    setError(null);
    try {
      const res = await fetch('/api/validation/invites', {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: newToken.trim() || undefined,
          label: newLabel.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data?.error === 'token_exists' ? 'That token already exists.' :
          data?.error === 'invalid_input' ? 'Invalid token (use letters, digits, . _ -).' :
          'Could not create invite.',
        );
        return;
      }
      setNewToken('');
      setNewLabel('');
      await loadInvites();
    } finally {
      setBusyInvite(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, newToken, newLabel, loadInvites]);

  const toggleInvite = useCallback(async (t: string, active: boolean) => {
    const res = await fetch('/api/validation/invites', {
      method: 'PATCH',
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: t, active }),
    });
    if (!res.ok) setError('Could not update invite.');
    await loadInvites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, loadInvites]);

  const deleteInvite = useCallback(async (t: string) => {
    if (!confirm(`Delete invite "${t}"? Only allowed if no sessions used it.`)) return;
    const res = await fetch(`/api/validation/invites?token=${encodeURIComponent(t)}`, {
      method: 'DELETE',
      headers: authHeader(),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error === 'in_use' ? 'Cannot delete: sessions exist. Deactivate instead.' : 'Could not delete.');
    }
    await loadInvites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, loadInvites]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/validation/export?format=json', {
        headers: authHeader(),
      });
      if (!res.ok) {
        setError(res.status === 401 ? 'Invalid admin token.' : 'Could not load.');
        setSessions(null);
        return;
      }
      const data = await res.json();
      setSessions(data.sessions || []);
      await loadInvites();
      await loadUsage();
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, loadInvites, loadUsage]);

  const downloadCsv = useCallback(async () => {
    const res = await fetch('/api/validation/export?format=csv', {
      headers: authHeader(),
    });
    if (!res.ok) {
      setError('CSV download failed.');
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rooster-validation-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [token]);

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <div className="container-wide py-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Validation Admin</h1>
        <div className="h-0.5 w-12 bg-accent-500 rounded-full mb-8" />

        <div className="rounded-xl border border-navy-800 bg-navy-900/40 p-5 mb-6">
          <label className="block text-xs font-medium text-navy-300 uppercase tracking-wider mb-2">
            Admin token
          </label>
          <div className="flex flex-wrap gap-3">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="VALIDATION_ADMIN_TOKEN"
              className="flex-1 min-w-[260px] rounded-lg border border-navy-700 bg-navy-900 px-3 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none"
            />
            <button
              onClick={load}
              disabled={!token.trim() || loading}
              className="rounded-lg bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-500 disabled:bg-navy-700"
            >
              {loading ? 'Loading…' : 'Load sessions'}
            </button>
            <button
              onClick={downloadCsv}
              disabled={!token.trim()}
              className="rounded-lg border border-navy-600 px-4 py-2.5 text-sm font-semibold text-navy-200 hover:bg-navy-800 hover:text-white disabled:opacity-50"
            >
              Download CSV
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        </div>

        {/* ─────────── Usage panel ─────────── */}
        {usage && (
          <div className="rounded-xl border border-navy-800 bg-navy-900/40 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">LLM usage</h2>
              <span className="text-xs text-navy-400">
                {usage.provider} · {usage.model}
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <Stat label="All time"
                primary={`${fmtNum(usage.totals.tokens_total)} tokens`}
                secondary={`${usage.totals.sessions} sessions · ${usage.totals.llm_calls} calls · ${fmtNum(usage.totals.tokens_in)} in / ${fmtNum(usage.totals.tokens_out)} out`}
              />
              <Stat label="Last 7 days"
                primary={`${fmtNum(usage.last_7d.tokens_total)} tokens`}
                secondary={`${usage.last_7d.sessions} sessions · ${usage.last_7d.llm_calls} calls`}
              />
              <Stat label="Last 24 hours"
                primary={`${fmtNum(usage.last_24h.tokens_total)} tokens`}
                secondary={`${usage.last_24h.sessions} sessions · ${usage.last_24h.llm_calls} calls`}
              />
            </div>
          </div>
        )}

        {/* ─────────── Invites panel ─────────── */}
        {invites && (
          <div className="rounded-xl border border-navy-800 bg-navy-900/40 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Invite tokens</h2>
              <button
                onClick={loadInvites}
                className="text-xs text-accent-400 hover:text-accent-300"
              >
                Refresh
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] mb-5">
              <input
                type="text"
                value={newToken}
                onChange={(e) => setNewToken(e.target.value)}
                placeholder="token (blank = auto)"
                className="rounded-lg border border-navy-700 bg-navy-900 px-3 py-2.5 text-sm text-white placeholder:text-navy-500 focus:border-accent-500 focus:outline-none"
              />
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="label (e.g. AWACS instructor – Tinker)"
                className="rounded-lg border border-navy-700 bg-navy-900 px-3 py-2.5 text-sm text-white placeholder:text-navy-500 focus:border-accent-500 focus:outline-none"
              />
              <button
                onClick={createInvite}
                disabled={busyInvite}
                className="rounded-lg bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-500 disabled:bg-navy-700"
              >
                {busyInvite ? 'Creating…' : 'Create invite'}
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-navy-800">
              <table className="min-w-full text-xs">
                <thead className="bg-navy-900/70 text-navy-300 uppercase tracking-wider">
                  <tr>
                    <Th>Token</Th>
                    <Th>Label</Th>
                    <Th>Active</Th>
                    <Th>Started</Th>
                    <Th>Completed</Th>
                    <Th>Created</Th>
                    <Th>Link</Th>
                    <Th>{''}</Th>
                  </tr>
                </thead>
                <tbody>
                  {invites.length === 0 && (
                    <tr><td colSpan={8} className="px-3 py-6 text-center text-navy-400">No invites yet — create one above.</td></tr>
                  )}
                  {invites.map((inv) => {
                    const link = origin
                      ? `${origin}/validation?invite=${encodeURIComponent(inv.token)}`
                      : '';
                    return (
                      <tr key={inv.token} className="border-t border-navy-800 align-top">
                        <Td>
                          <code className="rounded bg-navy-950 px-1.5 py-0.5 text-accent-300">{inv.token}</code>
                        </Td>
                        <Td>{inv.label ?? '—'}</Td>
                        <Td>
                          {inv.active
                            ? <span className="text-emerald-300">active</span>
                            : <span className="text-navy-500">inactive</span>}
                        </Td>
                        <Td>{inv.sessions_started}</Td>
                        <Td>{inv.sessions_completed}</Td>
                        <Td>{fmt(inv.created_at)}</Td>
                        <Td>
                          {link && (
                            <button
                              onClick={() => navigator.clipboard.writeText(link).catch(() => {})}
                              className="text-accent-400 hover:text-accent-300"
                              title={link}
                            >
                              Copy link
                            </button>
                          )}
                        </Td>
                        <Td>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleInvite(inv.token, !inv.active)}
                              className="text-xs text-navy-200 hover:text-white"
                            >
                              {inv.active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => deleteInvite(inv.token)}
                              className="text-xs text-red-300 hover:text-red-200"
                            >
                              Delete
                            </button>
                          </div>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {sessions && (
          <>
            <p className="text-sm text-navy-400 mb-4">{sessions.length} session(s)</p>
            <div className="overflow-x-auto rounded-xl border border-navy-800">
              <table className="min-w-full text-xs">
                <thead className="bg-navy-900/70 text-navy-300 uppercase tracking-wider">
                  <tr>
                    <Th>Started</Th>
                    <Th>Role</Th>
                    <Th>Pain</Th>
                    <Th>Pilot</Th>
                    <Th>Follow-up</Th>
                    <Th>Confirmed</Th>
                    <Th>Sensitive</Th>
                    <Th>Tokens</Th>
                    <Th>Invite</Th>
                    <Th>Email</Th>
                    <Th>{''}</Th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => {
                    const struct = (s.summary_struct || {}) as Record<string, unknown>;
                    return (
                      <tr key={s.id} className="border-t border-navy-800 align-top">
                        <Td>{fmt(s.started_at)}</Td>
                        <Td>{s.role_category ?? '—'}</Td>
                        <Td>{String(struct.pain_score_1_7 ?? '—')}</Td>
                        <Td>{String(struct.pilot_interest_1_7 ?? '—')}</Td>
                        <Td>{s.followup_consent ? '✓' : '—'}</Td>
                        <Td>{s.summary_confirmed ? '✓' : '—'}</Td>
                        <Td>{s.sensitive_info_flag ? '⚠' : '—'}</Td>
                        <Td>{fmtNum((s.tokens_in ?? 0) + (s.tokens_out ?? 0))}</Td>
                        <Td>{s.invite_token}</Td>
                        <Td>{s.email ?? '—'}</Td>
                        <Td>
                          <button
                            onClick={() => setOpen(open === s.id ? null : s.id)}
                            className="text-accent-400 hover:text-accent-300"
                          >
                            {open === s.id ? 'Hide' : 'View'}
                          </button>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {open && (() => {
              const s = sessions.find((x) => x.id === open);
              if (!s) return null;
              return (
                <div className="mt-6 rounded-xl border border-navy-800 bg-navy-900/40 p-5">
                  <h3 className="font-semibold mb-3">Session {s.id}</h3>
                  <p className="text-sm text-navy-200 whitespace-pre-wrap mb-4">
                    {s.summary_text || '(no summary)'}
                  </p>
                  {s.summary_user_edits && (
                    <div className="mb-4 rounded border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-100">
                      <p className="font-semibold mb-1">User corrections:</p>
                      <p className="whitespace-pre-wrap">{s.summary_user_edits}</p>
                    </div>
                  )}
                  <details className="mb-3">
                    <summary className="cursor-pointer text-xs uppercase tracking-wider text-navy-300">
                      Structured fields
                    </summary>
                    <pre className="mt-2 overflow-auto rounded bg-navy-950 p-3 text-[11px] text-navy-200">
                      {JSON.stringify(s.summary_struct, null, 2)}
                    </pre>
                  </details>
                  <details>
                    <summary className="cursor-pointer text-xs uppercase tracking-wider text-navy-300">
                      Transcript
                    </summary>
                    <div className="mt-2 space-y-2">
                      {(s.transcript ?? []).map((m, i) => (
                        <div key={i} className="rounded border border-navy-800 bg-navy-950 p-3 text-xs">
                          <p className="text-[10px] uppercase tracking-wider text-navy-400 mb-1">
                            {m.role}
                          </p>
                          <p className="whitespace-pre-wrap text-navy-100">{m.content}</p>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2 text-left font-semibold">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2 text-navy-100">{children}</td>;
}
function Stat({ label, primary, secondary }: { label: string; primary: string; secondary: string }) {
  return (
    <div className="rounded-lg border border-navy-800 bg-navy-950/60 p-4">
      <p className="text-[10px] uppercase tracking-wider text-navy-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{primary}</p>
      <p className="mt-1 text-xs text-navy-400">{secondary}</p>
    </div>
  );
}
function fmtNum(n: number): string {
  return n.toLocaleString();
}
function fmt(ts: string): string {
  try { return new Date(ts).toISOString().replace('T', ' ').slice(0, 16); } catch { return ts; }
}
