import { spawn } from "node:child_process";

const externalBaseUrl = process.env.SMOKE_BASE_URL;
const port = process.env.SMOKE_PORT || "3417";
const baseUrl = (externalBaseUrl || `http://127.0.0.1:${port}`).replace(/\/$/, "");
let server;
let serverOutput = "";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForServer() {
  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl, { redirect: "manual" });
      if (response.status > 0) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`The site did not start within 45 seconds.\n${serverOutput}`);
}

async function request(path, init) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual", ...init });
  return { response, body: await response.text() };
}

async function run() {
  if (!externalBaseUrl) {
    server = spawn("npm", ["run", "start", "--", "-p", port], {
      env: { ...process.env, NODE_ENV: "production" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    server.stdout.on("data", (chunk) => { serverOutput += chunk.toString(); });
    server.stderr.on("data", (chunk) => { serverOutput += chunk.toString(); });
    await waitForServer();
  }

  const home = await request("/");
  assert(home.response.status === 200, `Homepage returned ${home.response.status}`);
  assert(home.body.includes("GAME"), "Homepage is missing the GAME release.");
  assert(home.body.includes("https://open.spotify.com/track/4KcBt9xWi2VGzC5ggh0Rsu"), "Homepage is missing the official Spotify link.");
  assert(home.body.includes("https://www.youtube.com/watch?v=XGt6oHjTFn8"), "Homepage is missing the official YouTube link.");

  const privacy = await request("/privacy");
  assert(privacy.response.status === 200 && privacy.body.includes("PRIVACY"), "Privacy page failed.");

  const robots = await request("/robots.txt");
  assert(robots.response.status === 200 && robots.body.includes("Disallow: /admin/"), "robots.txt does not protect admin routes.");

  const sitemap = await request("/sitemap.xml");
  assert(sitemap.response.status === 200 && sitemap.body.includes("https://zafarsandhu.com"), "Sitemap is invalid.");

  const manifest = await request("/manifest.webmanifest");
  assert(manifest.response.status === 200 && manifest.body.includes("Zafar Sandhu"), "Web manifest is invalid.");

  const admin = await request("/admin");
  assert([302, 303, 307, 308].includes(admin.response.status), `Private admin returned ${admin.response.status} instead of redirecting.`);
  assert(admin.response.headers.get("location")?.startsWith("/admin/login"), "Private admin did not redirect to the sign-in page.");

  const login = await request("/admin/login");
  assert(login.response.status === 200 && login.body.includes("PRIVATE CONTROL ROOM"), "Admin sign-in page failed.");

  const exportAttempt = await request("/api/admin/audience/export");
  assert(exportAttempt.response.status === 401, `Anonymous audience export returned ${exportAttempt.response.status}.`);

  const invalidSignup = await request("/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "audit@example.invalid", city: "", consent: false }),
  });
  assert(
    invalidSignup.response.status === 400 && invalidSignup.body.includes("Consent is required"),
    `Consent enforcement failed with ${invalidSignup.response.status}: ${invalidSignup.body}`,
  );

  console.log(`Smoke tests passed against ${baseUrl}`);
}

try {
  await run();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  if (serverOutput) console.error(serverOutput);
  process.exitCode = 1;
} finally {
  server?.kill("SIGTERM");
}
