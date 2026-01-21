import { execSync } from 'node:child_process';

const baseUrl = 'http://localhost:3000';

function runCommand(command) {
  execSync(command, { stdio: 'inherit', shell: true });
}

async function postTest(type) {
  const response = await fetch(`${baseUrl}/api/sentry-test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API ${type} failed: ${response.status} ${text}`);
  }

  console.log(`[sentry:test:all] OK ${type}`);
}

async function run() {
  runCommand('pnpm sentry:test');

  try {
    await postTest('error');
    await postTest('message');
  } catch (error) {
    console.error('[sentry:test:all] Server test failed. Is `pnpm dev` running and SENTRY_TEST_ENABLED=true?');
    throw error;
  }
}

run().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
