import fs from "node:fs";
import path from "node:path";

const POLL_INTERVAL_MS = 30_000;
const cwd = process.cwd();

loadEnvFile(".env.local");
loadEnvFile(".env");

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const secret = process.env.REMINDERS_CRON_SECRET;

if (!secret) {
  throw new Error(
    "Missing REMINDERS_CRON_SECRET. The reminder worker cannot start without it.",
  );
}

let stopped = false;
let timer = null;

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log(
  `[reminder-worker] Running every ${Math.round(POLL_INTERVAL_MS / 1000)}s against ${baseUrl}`,
);

scheduleNextRun(0);

function loadEnvFile(fileName) {
  const filePath = path.join(cwd, fileName);

  if (!fs.existsSync(filePath)) {
    return;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");

  for (const line of fileContents.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function scheduleNextRun(delay) {
  if (stopped) {
    return;
  }

  timer = setTimeout(async () => {
    await runCycle();
    scheduleNextRun(POLL_INTERVAL_MS);
  }, delay);
}

async function runCycle() {
  try {
    const response = await fetch(
      `${baseUrl}/api/internal/reminders/process?secret=${encodeURIComponent(secret)}`,
      {
        method: "POST",
      },
    );

    if (!response.ok) {
      const body = await response.text();
      console.error(`[reminder-worker] ${response.status}: ${body}`);
      return;
    }

    const result = await response.json();

    if (result.claimed > 0 || result.notified > 0 || result.failures > 0) {
      console.log("[reminder-worker]", JSON.stringify(result));
    }
  } catch (error) {
    console.error("[reminder-worker] Waiting for app server...", error.message);
  }
}

function shutdown() {
  stopped = true;

  if (timer) {
    clearTimeout(timer);
  }

  process.exit(0);
}
