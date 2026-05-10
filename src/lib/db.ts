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
          sensitive_info_flag    BOOLEAN NOT NULL DEFAULT FALSE
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
