#!/usr/bin/env bash
# agent-task.sh — Checklist automation for starting a new task.
# Usage: ./scripts/agent-task.sh <task-name>
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TASK_NAME="${1:-unnamed-task}"
DATE=$(date +%Y-%m-%d)
PLAN_FILE="$ROOT/docs/exec-plans/active/${DATE}-${TASK_NAME}.md"

echo "======================================"
echo " harness-todo — New Task: $TASK_NAME"
echo "======================================"

# 1. Preflight
echo
echo "▶ Running preflight..."
bash "$ROOT/scripts/preflight.sh"

# 2. Check for existing active plans
ACTIVE_COUNT=$(find "$ROOT/docs/exec-plans/active" -name "*.md" ! -name ".gitkeep" | wc -l)
if [ "$ACTIVE_COUNT" -gt 0 ]; then
  echo
  echo "⚠  Active exec plans found:"
  find "$ROOT/docs/exec-plans/active" -name "*.md" ! -name ".gitkeep" -exec basename {} \;
  echo "   Consider completing or deferring them before starting a new task."
fi

# 3. Create exec plan template
echo
echo "▶ Creating exec plan: $PLAN_FILE"
cat > "$PLAN_FILE" << TEMPLATE
# Exec Plan: $TASK_NAME

**Date**: $DATE
**Status**: Active

## Objective


## Acceptance Criteria
- [ ]

## Plan
1.
2.
3.

## Risks
| Risk | Mitigation |
|------|-----------|
| | |

## Verification
\`\`\`bash
./scripts/verify.sh
\`\`\`

## Notes

TEMPLATE

echo "  ✓ Created: $PLAN_FILE"

echo
echo "======================================"
echo " ✅ Ready. Edit the exec plan, then start coding."
echo "    When done: move plan to docs/exec-plans/completed/"
echo "======================================"
