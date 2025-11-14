#!/bin/bash

cd /Users/jacksonlafrance/Fixated

WORKTREES=(
  "/Users/jacksonlafrance/Fixated-auth-components:feat-auth-components"
  "/Users/jacksonlafrance/Fixated-dashboard:feat-dashboard"
  "/Users/jacksonlafrance/Fixated-skills:feat-skills-library"
  "/Users/jacksonlafrance/Fixated-habits:feat-habits-tracking"
  "/Users/jacksonlafrance/Fixated-progress-charts:feat-progress-charts"
  "/Users/jacksonlafrance/Fixated-daily-goals:feat-daily-goals"
  "/Users/jacksonlafrance/Fixated-achievements:feat-achievements"
  "/Users/jacksonlafrance/Fixated-notifications:feat-notifications"
  "/Users/jacksonlafrance/Fixated-profile:feat-profile"
  "/Users/jacksonlafrance/Fixated-leaderboard:feat-leaderboard"
)

echo "╔════════════════════════════════════════════════════════╗"
echo "║        SYNC STATUS - ALL WORKTREES                    ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

git fetch origin > /dev/null 2>&1

for worktree_info in "${WORKTREES[@]}"; do
  IFS=':' read -r path branch <<< "$worktree_info"
  
  if [ -d "$path" ]; then
    cd "$path"
    local_commit=$(git rev-parse HEAD 2>/dev/null)
    remote_commit=$(git rev-parse origin/$branch 2>/dev/null)
    
    if [ "$local_commit" = "$remote_commit" ]; then
      echo "✅ $branch: In sync"
    else
      echo "⚠️  $branch: Out of sync"
      echo "   Local:  ${local_commit:0:8}"
      echo "   Remote: ${remote_commit:0:8}"
    fi
  fi
done

cd /Users/jacksonlafrance/Fixated
local_main=$(git rev-parse HEAD 2>/dev/null)
remote_main=$(git rev-parse origin/main 2>/dev/null)

if [ "$local_main" = "$remote_main" ]; then
  echo "✅ main: In sync"
else
  echo "⚠️  main: Out of sync"
  echo "   Local:  ${local_main:0:8}"
  echo "   Remote: ${remote_main:0:8}"
fi

echo ""
echo "💡 Run ./push_all_worktrees.sh to push all branches"
echo "💡 Run git fetch origin in each worktree to pull latest"

