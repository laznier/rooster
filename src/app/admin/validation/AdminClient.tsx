'use client';

import { useCallback, useState } from 'react';

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
}

export function AdminClient() {
  const [token, setToken] = useState('');
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/validation/export?format=json', {
        headers: { Authorization: `Bearer ${token.trim()}` },
      });
      if (!res.ok) {
        setError(res.status === 401 ? 'Invalid admin token.' : 'Could not load.');
        setSessions(null);
        return;
      }
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const downloadCsv = useCallback(async () => {
    const res = await fetch('/api/validation/export?format=csv', {
      headers: { Authorization: `Bearer ${token.trim()}` },
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
function fmt(ts: string): string {
  try { return new Date(ts).toISOString().replace('T', ' ').slice(0, 16); } catch { return ts; }
}
