import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  // *.test.ts only — tests/e2e-scroll.spec.ts belongs to @playwright/test.
  test: { environment: "node", include: ["tests/**/*.test.ts"] },
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } }
});
