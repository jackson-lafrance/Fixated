#!/bin/bash
cd /Users/jacksonlafrance/Fixated
WORKTREES=(
  "/Users/jacksonlafrance/Fixated-auth-components:feat-auth-components"
  "/Users/jacksonlafrance/Fixated-dashboard:feat-dashboard"
  "/Users/jacksonlafrance/Fixated-skills:feat-skills-library"
  "/Users/jacksonlafrance/Fixated-habits:feat-habits-tracking"
  "/Users/jacksonlafrance/Fixated-progress-charts:feat-progress-charts"
)
for worktree_info in "${WORKTREES[@]}"; do
  IFS=':' read -r path branch <<< "$worktree_info"
  if [ -d "$path" ]; then
    cd "$path" && git add -A && git commit -m "Auto-commit: $(date +%Y-%m-%d\ %H:%M:%S)" 2>/dev/null && echo "✅ $branch committed" || echo "⚠️  $branch: no changes"
  fi
done
