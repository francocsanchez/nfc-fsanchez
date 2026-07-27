import { spawn } from "node:child_process";

const children = [];

startProcess("web", "npx", ["next", "dev"]);
startProcess("reminder-worker", "node", ["scripts/run-reminder-worker.mjs"]);

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function startProcess(label, command, args) {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    shell: true,
    stdio: "inherit",
    env: process.env,
  });

  children.push(child);

  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`[${label}] exited with code ${code}`);
    }
  });
}

function shutdown() {
  for (const child of children) {
    child.kill("SIGTERM");
  }

  process.exit(0);
}
