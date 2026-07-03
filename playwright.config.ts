import { defineConfig } from "@playwright/test";

// E2E config for the scroll-choreography gate (tests/e2e-scroll.spec.ts).
// Runs against a production build (`next build` must precede `playwright test`)
// so CI verifies what actually ships. Vitest owns tests/[glob].test.ts; this
// runner owns *.spec.ts only — the two never overlap.
export default defineConfig({
  testMatch: "tests/e2e-scroll.spec.ts",
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: "http://localhost:3100",
    viewport: { width: 1280, height: 800 }
  },
  webServer: {
    command: "pnpm exec next start -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  }
});
