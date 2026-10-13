#!/usr/bin/env bash
# preflight.sh — Environment & dependency check before starting any task.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "======================================"
echo " harness-todo — Preflight Check"
echo "======================================"

ok()   { echo "  ✓ $1"; }
warn() { echo "  ⚠ $1"; }
fail() { echo "  ✗ $1"; FAILED=1; }

FAILED=0

# Node version
REQUIRED_NODE="18"
CURRENT_NODE=$(node -e "process.stdout.write(process.version.split('.')[0].replace('v',''))")
if [ "$CURRENT_NODE" -ge "$REQUIRED_NODE" ]; then
  ok "Node.js v$(node -v | tr -d 'v') (>= $REQUIRED_NODE required)"
else
  fail "Node.js >= $REQUIRED_NODE required (found $(node -v))"
fi

# npm
ok "npm $(npm --version)"

# node_modules
if [ -d "node_modules" ]; then
  ok "node_modules exists"
else
  warn "node_modules missing — running npm install..."
  npm install
fi

# package.json scripts
for script in dev build test lint typecheck verify; do
  if npm run "$script" -- --help &>/dev/null 2>&1 || grep -q "\"$script\"" package.json; then
    ok "script: $script"
  else
    warn "script not found: $script"
  fi
done

# .env.local (not required for v1)
if [ -f ".env.local" ]; then
  ok ".env.local exists"
else
  ok ".env.local not required for v1"
fi

# Git
if git rev-parse --git-dir &>/dev/null; then
  BRANCH=$(git branch --show-current)
  ok "Git repo on branch: $BRANCH"
else
  warn "Not a git repo"
fi

echo
if [ "$FAILED" -eq 0 ]; then
  echo "======================================"
  echo " ✅ Preflight passed — ready to work"
  echo "======================================"
else
  echo "======================================"
  echo " ❌ Preflight failed — fix issues above"
  echo "======================================"
  exit 1
fi
