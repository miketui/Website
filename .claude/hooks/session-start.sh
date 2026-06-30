#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(pwd)}"

# pnpm is pinned in packageManager field; ensure corepack activates it
corepack enable pnpm 2>/dev/null || true

pnpm install

# Persist env vars so Playwright finds the pre-installed Chromium
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo 'export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers' >> "$CLAUDE_ENV_FILE"
  echo 'export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1' >> "$CLAUDE_ENV_FILE"
fi
