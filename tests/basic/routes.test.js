const test = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { once } = require("node:events");

const PORT = 4010;
const BASE = `http://127.0.0.1:${PORT}`;
let server;

function waitForServer() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Server did not start in time")), 60000);

    const onStdout = (chunk) => {
      const text = String(chunk);
      if (text.includes("Ready") || text.includes(`:${PORT}`) || text.includes("started server")) {
        clearTimeout(timeout);
        server.stdout.off("data", onStdout);
        server.stderr.off("data", onStderr);
        setTimeout(resolve, 2000);
      }
    };

    const onStderr = (chunk) => {
      const text = String(chunk);
      if (text.toLowerCase().includes("error")) {
        clearTimeout(timeout);
        server.stdout.off("data", onStdout);
        server.stderr.off("data", onStderr);
        reject(new Error(text));
      }
    };

    server.stdout.on("data", onStdout);
    server.stderr.on("data", onStderr);
  });
}

test.before(async () => {
  server = spawn("node", ["./node_modules/next/dist/bin/next", "start", "-p", String(PORT)], {
    cwd: process.cwd(),
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  await waitForServer();
});

test.after(async () => {
  if (!server || server.killed) return;
  server.kill("SIGTERM");
  const exited = once(server, "exit");
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Server did not shut down in time")), 10000)
  );
  try {
    await Promise.race([exited, timeout]);
  } catch {
    server.kill("SIGKILL");
    await once(server, "exit");
  }
});

test("create paste endpoint works", async () => {
  const register = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: `test-${Date.now()}@example.com`,
      password: "Password123",
    }),
  });
  assert.equal(register.status, 201);
  const cookie = register.headers.get("set-cookie");
  assert.ok(cookie);

  const createPaste = await fetch(`${BASE}/api/pastes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({
      title: "Test paste",
      content: "Hello StarBond",
      visibility: "PUBLIC",
      language: "text",
      expiresIn: "never",
      burnAfterRead: false,
    }),
  });
  assert.equal(createPaste.status, 201);
  const paste = await createPaste.json();
  assert.ok(paste.item.slug);
});

test("create short link and redirect works", async () => {
  const register = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: `url-${Date.now()}@example.com`,
      password: "Password123",
    }),
  });
  assert.equal(register.status, 201);
  const cookie = register.headers.get("set-cookie");

  const createUrl = await fetch(`${BASE}/api/urls`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({
      originalUrl: "https://example.com",
      visibility: "PUBLIC",
      redirectType: "TEMPORARY",
    }),
  });
  assert.equal(createUrl.status, 201);
  const data = await createUrl.json();
  assert.ok(data.item.slug);

  const redirect = await fetch(`${BASE}/s/${data.item.slug}`, { redirect: "manual" });
  assert.ok([301, 302].includes(redirect.status));
});
