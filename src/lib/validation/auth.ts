/**
 * Admin authorization helper.
 *
 * In local dev (when `process.env.VERCEL` is not set), the /admin/* routes and
 * their backing /api/validation/{invites,export,usage} endpoints are already
 * locked down by `src/middleware.ts` so they cannot be reached from a
 * deployment. In that environment we don't require the bearer token — the
 * machine itself is the trust boundary.
 *
 * In any Vercel environment we fall through to constant-time bearer compare
 * against `VALIDATION_ADMIN_TOKEN`. (Today the middleware blocks those routes
 * on Vercel anyway, but the check stays here as defense in depth.)
 */
export function isLocalEnv(): boolean {
  return !process.env.VERCEL && !process.env.VERCEL_ENV;
}

export function isAdminAuthorized(req: Request): boolean {
  if (isLocalEnv()) return true;
  const adminToken = process.env.VALIDATION_ADMIN_TOKEN;
  if (!adminToken) return false;
  const auth = req.headers.get('authorization') || '';
  const provided = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (provided.length !== adminToken.length) return false;
  let r = 0;
  for (let i = 0; i < provided.length; i++) {
    r |= provided.charCodeAt(i) ^ adminToken.charCodeAt(i);
  }
  return r === 0;
}
