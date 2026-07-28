import js from "@eslint/js";
import next from "eslint-config-next";

const config = [
  // Global ignores. In ESLint v9 flat config an `ignores` key is only global
  // when it is the ONLY key in the object — pair it with `rules` and it
  // silently degrades to a per-config filter that ignores nothing globally.
  //
  // eslint does not read .gitignore, so generated and vendored directories are
  // listed explicitly. `.cache/**` matters most: PLAYWRIGHT_BROWSERS_PATH
  // points the browser download inside the repo and Chromium ships its own
  // bundled JS, so `pnpm browser:install && pnpm lint` otherwise fails with
  // phantom "'chrome' is not defined" errors — fatal under --max-warnings=0.
  {
    ignores: [".next/**", "node_modules/**", "coverage/**", ".cache/**", "out/**", "test-results/**", "playwright-report/**"]
  },
  js.configs.recommended,
  ...next,
  {
    rules: {
      "no-unused-vars": "off"
    }
  }
];

export default config;
