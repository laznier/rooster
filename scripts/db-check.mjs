// Quick DB inspector. Run with: node scripts/db-check.mjs
import { readFileSync } from 'node:fs';
import { sql } from '@vercel/postgres';

// Minimal .env.local loader (we don't want to add dotenv as a dep).
try {
  const txt = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    if (process.env[m[1]] !== undefined) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    process.env[m[1]] = v;
  }
} catch { /* ignore */ }

const args = process.argv.slice(2);

const r = await sql.query(`
  SELECT id, invite_token, started_at, completed_at, summary_confirmed,
         consent_confirmed, video_completed,
         jsonb_array_length(COALESCE(transcript, '[]'::jsonb)) AS turns,
         (summary_text IS NOT NULL) AS has_summary
  FROM validation_sessions
  ORDER BY started_at DESC
  LIMIT 20;
`);
console.log(`rows: ${r.rows.length}`);
console.table(r.rows);

if (args[0] === 'invites') {
  const inv = await sql.query(`
    SELECT i.token, i.label, i.active, i.used_count,
           COUNT(s.id)::int AS sessions
    FROM validation_invites i
    LEFT JOIN validation_sessions s ON s.invite_token = i.token
    GROUP BY i.token
    ORDER BY i.created_at DESC;
  `);
  console.log('\ninvites:');
  console.table(inv.rows);
}

process.exit(0);
