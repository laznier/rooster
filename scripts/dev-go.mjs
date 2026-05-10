// Starts `next dev` and opens the admin dashboard once the server is ready.
// Used by `npm run go`. Cross-platform (Windows/macOS/Linux).
import { spawn } from 'node:child_process';
import { platform } from 'node:os';

const PORT = process.env.PORT || '3000';
const URL = `http://localhost:${PORT}/admin/validation`;

const child = spawn('npx', ['next', 'dev', '-p', PORT], {
  stdio: ['inherit', 'pipe', 'inherit'],
  shell: true,
  env: process.env,
});

let opened = false;
function openBrowser() {
  if (opened) return;
  opened = true;
  const cmd =
    platform() === 'win32'
      ? `start "" "${URL}"`
      : platform() === 'darwin'
        ? `open "${URL}"`
        : `xdg-open "${URL}"`;
  spawn(cmd, { shell: true, stdio: 'ignore', detached: true }).unref();
  console.log(`\n[go] Opened ${URL}\n`);
}

child.stdout.on('data', (chunk) => {
  const text = chunk.toString();
  process.stdout.write(text);
  // Next.js prints "Ready" / "Local:" once the dev server is listening.
  if (!opened && /(Ready|Local:\s*http)/i.test(text)) {
    setTimeout(openBrowser, 400);
  }
});

// Safety net: open after 8s even if we never matched the ready string.
setTimeout(openBrowser, 8000);

child.on('exit', (code) => process.exit(code ?? 0));
process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
