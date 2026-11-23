import { defineConfig, devices } from "@playwright/test";

// The app under test runs against a throwaway in-memory database (see tests/e2e/server.mjs).
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1, // tests share one database and the server's per-IP rate limits
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3100",
    // Uses the locally installed Chrome so no browser download is needed. Set E2E_BROWSER=msedge to use Edge.
    channel: process.env.E2E_BROWSER ?? "chrome",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: process.env.E2E_BROWSER ?? "chrome" }, testIgnore: /mobile/ },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: process.env.E2E_BROWSER ?? "chrome" }, testMatch: /mobile/ },
  ],
  webServer: {
    command: "node tests/e2e/server.mjs",
    url: "http://localhost:3100",
    timeout: 600_000,
    reuseExistingServer: false,
    stdout: "pipe",
  },
});
