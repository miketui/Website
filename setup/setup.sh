#!/usr/bin/env bash
set -Eeuo pipefail

# setup.sh — Codex cloud/local setup for Curls & Contemplation author-commerce build
# Safe purpose:
# - Prepare Codex to inspect the repo, scaffold a Next.js author site, run tests/builds,
#   and validate EPUB/PDF publishing artifacts without exposing secrets.
# - This script should be pasted into Codex cloud environment setup or committed as setup.sh.
#
# Security rules:
# - Do NOT echo secrets.
# - Do NOT write real API keys into repo files.
# - Do NOT copy paid EPUB/PDF files into any public web folder.

ROOT="$(pwd)"
TOOLS_DIR="$ROOT/tools"
REPORTS_DIR="$ROOT/validation-reports/codex-setup"
mkdir -p "$TOOLS_DIR" "$REPORTS_DIR"

log() { printf "\n\033[1;36m[%s]\033[0m %s\n" "$(date -u +%H:%M:%S)" "$*"; }
warn() { printf "\n\033[1;33m[WARN]\033[0m %s\n" "$*" >&2; }

log "Repository: $ROOT"
log "Node: $(node --version 2>/dev/null || echo 'not found')"
log "npm: $(npm --version 2>/dev/null || echo 'not found')"
log "Python: $(python3 --version 2>/dev/null || echo 'not found')"

if command -v apt-get >/dev/null 2>&1; then
  log "Installing baseline OS packages if available"
  sudo apt-get update -y
  sudo apt-get install -y \
    ca-certificates curl wget unzip zip jq git \
    openjdk-21-jre-headless \
    libxml2-utils \
    poppler-utils \
    ghostscript \
    fonts-liberation \
    fontconfig \
    chromium || warn "Some apt packages failed; Codex may still continue if base image already has equivalents."
fi

log "Enabling Corepack package-manager shims"
if command -v corepack >/dev/null 2>&1; then
  corepack enable || true
  corepack prepare pnpm@latest --activate || true
else
  npm install -g corepack pnpm || true
fi

log "Installing/confirming useful global JavaScript tools"
npm install -g pnpm npm-check-updates vercel supabase @lhci/cli || warn "Global JS tool install had warnings."

log "Installing EPUBCheck 5.1.0 if missing"
EPUBCHECK_DIR="$TOOLS_DIR/epubcheck"
EPUBCHECK_JAR="$EPUBCHECK_DIR/epubcheck.jar"
if [[ ! -f "$EPUBCHECK_JAR" ]]; then
  mkdir -p "$EPUBCHECK_DIR"
  TMP_ZIP="/tmp/epubcheck-5.1.0.zip"
  curl -L --retry 3 \
    -o "$TMP_ZIP" \
    "https://github.com/w3c/epubcheck/releases/download/v5.1.0/epubcheck-5.1.0.zip"
  unzip -q "$TMP_ZIP" -d "$EPUBCHECK_DIR"
  FOUND_JAR="$(find "$EPUBCHECK_DIR" -name 'epubcheck.jar' | head -1 || true)"
  if [[ -n "$FOUND_JAR" && "$FOUND_JAR" != "$EPUBCHECK_JAR" ]]; then
    cp "$FOUND_JAR" "$EPUBCHECK_JAR"
  fi
fi

log "Installing Python QA utilities"
python3 -m pip install --upgrade pip || true
python3 -m pip install --upgrade lxml beautifulsoup4 pypdf reportlab pillow pytest ruff pyright || true

log "Installing repo dependencies if package files exist"
if [[ -f pnpm-lock.yaml || -f package.json ]]; then
  if [[ -f pnpm-lock.yaml ]]; then
    pnpm install --frozen-lockfile || pnpm install
  elif [[ -f package-lock.json ]]; then
    npm ci || npm install
  elif [[ -f yarn.lock ]]; then
    corepack enable || true
    yarn install --frozen-lockfile || yarn install
  else
    pnpm install || npm install
  fi
else
  warn "No package.json at repo root. Codex should scaffold the app under author-site/."
fi

log "Checking release artifacts"
EPUB_PATH="$ROOT/release/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub"
ALT_EPUB_PATH="$ROOT/release/Curls-and-Contemplation-FINAL.epub"
if [[ -f "$EPUB_PATH" ]]; then
  java -jar "$EPUBCHECK_JAR" "$EPUB_PATH" > "$REPORTS_DIR/epubcheck-v8.txt" 2>&1 || true
  log "EPUBCheck report written to $REPORTS_DIR/epubcheck-v8.txt"
elif [[ -f "$ALT_EPUB_PATH" ]]; then
  java -jar "$EPUBCHECK_JAR" "$ALT_EPUB_PATH" > "$REPORTS_DIR/epubcheck-final.txt" 2>&1 || true
  warn "Requested V8 EPUB was not found; validated FINAL EPUB instead."
else
  warn "No release EPUB found at expected paths. Codex must inspect release/ and report actual filenames."
fi

if [[ -d "$ROOT/author-site" ]]; then
  log "Existing author site detected at author-site; installing dependencies"
  cd "$ROOT/author-site"
  if [[ -f pnpm-lock.yaml ]]; then pnpm install --frozen-lockfile || pnpm install; fi
  if [[ -f package.json && ! -f pnpm-lock.yaml ]]; then pnpm install || npm install; fi
  if [[ -f package.json ]]; then
    pnpm exec playwright install --with-deps chromium || npx playwright install --with-deps chromium || true
  fi
  cd "$ROOT"
fi

log "Setup summary"
{
  echo "Date UTC: $(date -u)"
  echo "Root: $ROOT"
  echo "Node: $(node --version 2>/dev/null || true)"
  echo "npm: $(npm --version 2>/dev/null || true)"
  echo "pnpm: $(pnpm --version 2>/dev/null || true)"
  echo "Java: $(java -version 2>&1 | head -1 || true)"
  echo "EPUBCheck jar: $EPUBCHECK_JAR"
  echo "Expected author site path: author-site"
  echo "No real API keys were written by setup.sh."
} | tee "$REPORTS_DIR/setup-summary.txt"

log "Done. Start Codex task with CODEX_MASTER_PROMPT.md."
