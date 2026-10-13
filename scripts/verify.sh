#!/usr/bin/env bash
# verify.sh — Full quality gate. Must pass before any task is marked complete.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "======================================"
echo " harness-todo — Verification Suite"
echo "======================================"

step() { echo; echo "▶ $1"; }
ok()   { echo "  ✓ $1"; }
fail() { echo "  ✗ $1"; exit 1; }

# 1. TypeScript
step "TypeScript check"
npx tsc --noEmit && ok "No type errors" || fail "TypeScript errors found"

# 2. ESLint
step "ESLint"
npm run lint && ok "No lint errors" || fail "Lint errors found"

# 3. Prettier
step "Prettier format check"
npx prettier --check . && ok "Formatting OK" || fail "Formatting issues — run: npm run format"

# 4. Tests
step "Vitest"
npm run test && ok "All tests passed" || fail "Tests failed"

# 5. Build
step "Next.js build"
npm run build && ok "Build successful" || fail "Build failed"

# 6. Security audit
step "npm audit (high severity)"
npm audit --audit-level=high && ok "No high-severity vulnerabilities" || fail "Security vulnerabilities found"

echo
echo "======================================"
echo " ✅ All gates passed"
echo "======================================"
