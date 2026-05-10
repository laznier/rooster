// Starts `next dev`, waits until the API is actually responding, then opens
// the admin dashboard. On Ctrl+C (SIGINT/SIGBREAK) cleanly tears down the
// entire dev-server process tree so port 3000 is freed.
//
// Cross-platform (Windows / macOS / Linux). Used by `npm run go`.
import { spawn } from 'node:child_process';
import { platform } from 'node:os';

const PORT = process.env.PORT || '3000';
const ADMIN_URL = `http://localhost:${PORT}/admin/validation`;
const PROBE_URL = `http://localhost:${PORT}/api/validation/usage`;
const isWin = platform() === 'win32';

// Use the platform-specific npx. On Windows, Node refuses to spawn a .cmd
// without shell:true (EINVAL on Node >= 20), so we go through the shell.
// Killing the tree with `taskkill /T /F` still works.
const npxCmd = isWin ? 'npx.cmd' : 'npx';

const child = spawn(npxCmd, ['next', 'dev', '-p', PORT], {
  stdio: ['inherit', 'pipe', 'inherit'],
  env: process.env,
  shell: isWin,
  windowsHide: false,
});

let opened = false;
let readySeen = false;
let shuttingDown = false;

function openBrowser() {
  if (opened) return;
  opened = true;
  let cmd, args;
  if (isWin) {
    cmd = 'cmd.exe';
    args = ['/c', 'start', '""', ADMIN_URL];
  } else if (platform() === 'darwin') {
    cmd = 'open';
    args = [ADMIN_URL];
  } else {
    cmd = 'xdg-open';
    args = [ADMIN_URL];
  }
  spawn(cmd, args, { stdio: 'ignore', detached: true }).unref();
  console.log(`\n[go] Opened ${ADMIN_URL}\n`);
}

async function waitForApi(timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline && !shuttingDown) {
    try {
      const res = await fetch(PROBE_URL, { cache: 'no-store' });
      if (res.ok) return true;
    } catch { /* server not up yet */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}

child.stdout.on('data', async (chunk) => {
  const text = chunk.toString();
  process.stdout.write(text);
  if (readySeen || opened) return;
  if (/(Ready|Local:\s*http)/i.test(text)) {
    readySeen = true;
    // Wait for the actual API to be reachable so the admin page hydrates
    // with data on first paint instead of needing a manual refresh.
    const ok = await waitForApi();
    if (!ok) {
      console.warn('[go] API did not become ready in time — opening anyway.');
    }
    openBrowser();
  }
});

// Safety net: if we somehow miss the ready string, still open after 20s.
setTimeout(() => { if (!opened) openBrowser(); }, 20000).unref();

function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`\n[go] Received ${signal} — stopping dev server…`);
  if (!child.pid) {
    process.exit(0);
    return;
  }
  if (isWin) {
    // /T = kill child tree, /F = force. Required because `next dev` spawns
    // worker processes that won't exit just because we kill the parent.
    spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    try { process.kill(-child.pid, 'SIGTERM'); } catch { /* may already be gone */ }
    try { child.kill('SIGTERM'); } catch { /* noop */ }
  }
  // Give the OS a moment to actually release the port before we exit.
  setTimeout(() => process.exit(0), 600).unref();
}

child.on('exit', (code) => {
  if (!shuttingDown) process.exit(code ?? 0);
});

process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGBREAK', () => shutdown('SIGBREAK')); // Windows Ctrl+Break
