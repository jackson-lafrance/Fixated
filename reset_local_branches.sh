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
echo "║        RESETTING LOCAL BRANCHES (KEEPING CHANGES)     ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

git fetch origin > /dev/null 2>&1

for worktree_info in "${WORKTREES[@]}"; do
  IFS=':' read -r path branch <<< "$worktree_info"
  
  if [ -d "$path" ]; then
    cd "$path"
    
    REMOTE=$(git rev-parse origin/$branch 2>/dev/null)
    
    if [ -n "$REMOTE" ]; then
      echo "📁 Resetting $branch to origin/$branch (keeping changes)..."
      git reset --soft origin/$branch 2>/dev/null
      git reset HEAD . 2>/dev/null
      echo "   ✅ Reset - changes are now uncommitted"
    fi
  fi
done

cd /Users/jacksonlafrance/Fixated
REMOTE_MAIN=$(git rev-parse origin/main 2>/dev/null)

if [ -n "$REMOTE_MAIN" ]; then
  echo "📁 Resetting main to origin/main (keeping changes)..."
  git reset --soft origin/main 2>/dev/null
  git reset HEAD . 2>/dev/null
  echo "   ✅ Reset - changes are now uncommitted"
fi

echo ""
echo "✅ All local branches reset! All changes are now uncommitted."
