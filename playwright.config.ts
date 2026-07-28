import { defineConfig } from "@playwright/test";

// E2E config. Runs against a production build (`next build` must precede
// `playwright test`) so CI verifies what actually ships. Vitest owns
// tests/*.test.ts; this runner owns *.spec.ts only — the two never overlap.
//
// testMatch widened from the single scroll spec on 2026-07-27 to pick up
// tests/a11y.spec.ts. Target one suite with `pnpm test:e2e` / `pnpm test:a11y`.
export default defineConfig({
  testMatch: "tests/*.spec.ts",
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: "http://127.0.0.1:3100",
    viewport: { width: 1280, height: 800 }
  },
  webServer: {
    command: "pnpm exec next start -H 127.0.0.1 -p 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  }
});
