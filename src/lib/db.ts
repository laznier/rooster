import { sql } from '@vercel/postgres';

let schemaReady: Promise<void> | null = null;

/**
 * Idempotent schema bootstrap. Called from every API route on first use.
 * Uses Vercel Postgres (Neon). All writes are JSONB-friendly so the schema
 * can evolve without migrations during early validation.
 */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS validation_invites (
          token        TEXT PRIMARY KEY,
          label        TEXT,
          active       BOOLEAN NOT NULL DEFAULT TRUE,
          used_count   INTEGER NOT NULL DEFAULT 0,
          created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS validation_sessions (
          id                     TEXT PRIMARY KEY,
          invite_token           TEXT REFERENCES validation_invites(token),
          started_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          completed_at           TIMESTAMPTZ,
          consent_confirmed      BOOLEAN NOT NULL DEFAULT FALSE,
          video_started          BOOLEAN NOT NULL DEFAULT FALSE,
          video_completed        BOOLEAN NOT NULL DEFAULT FALSE,
          video_pct              INTEGER NOT NULL DEFAULT 0,
          role_category          TEXT,
          experience_level       TEXT,
          relationship           TEXT,
          name                   TEXT,
          email                  TEXT,
          followup_consent       BOOLEAN NOT NULL DEFAULT FALSE,
          transcript             JSONB NOT NULL DEFAULT '[]'::jsonb,
          summary_text           TEXT,
          summary_struct         JSONB,
          summary_confirmed      BOOLEAN NOT NULL DEFAULT FALSE,
          summary_user_edits     TEXT,
          sensitive_info_flag    BOOLEAN NOT NULL DEFAULT FALSE,
          tokens_in              INTEGER NOT NULL DEFAULT 0,
          tokens_out             INTEGER NOT NULL DEFAULT 0,
          llm_calls              INTEGER NOT NULL DEFAULT 0
        );
      `;
      // Backfill columns on pre-existing DBs (idempotent).
      await sql`ALTER TABLE validation_sessions ADD COLUMN IF NOT EXISTS tokens_in  INTEGER NOT NULL DEFAULT 0;`;
      await sql`ALTER TABLE validation_sessions ADD COLUMN IF NOT EXISTS tokens_out INTEGER NOT NULL DEFAULT 0;`;
      await sql`ALTER TABLE validation_sessions ADD COLUMN IF NOT EXISTS llm_calls  INTEGER NOT NULL DEFAULT 0;`;
      await sql`ALTER TABLE validation_sessions ADD COLUMN IF NOT EXISTS risk_assessments JSONB NOT NULL DEFAULT '{}'::jsonb;`;

      // Founder-edited mitigation tracker. One row per risk id (R1..R5).
      // Local-only writes via /api/validation/mitigations (admin-gated).
      await sql`
        CREATE TABLE IF NOT EXISTS validation_risk_mitigations (
          risk_id            TEXT PRIMARY KEY,
          current_assessment TEXT NOT NULL DEFAULT '',
          mitigation_plan    TEXT NOT NULL DEFAULT '',
          next_experiment    TEXT NOT NULL DEFAULT '',
          owner              TEXT NOT NULL DEFAULT '',
          status             TEXT NOT NULL DEFAULT 'open',
          updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `;

      // Seed invite tokens from env on first init (dev convenience)
      const seed = process.env.VALIDATION_SEED_INVITES;
      if (seed) {
        for (const raw of seed.split(',')) {
          const token = raw.trim();
          if (!token) continue;
          await sql`
            INSERT INTO validation_invites (token, label)
            VALUES (${token}, ${'seed'})
            ON CONFLICT (token) DO NOTHING;
          `;
        }
      }
    })().catch((err) => {
      // Reset so the next call can retry (e.g. transient DB connectivity)
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}

export { sql };
