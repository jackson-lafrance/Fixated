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
echo "║        RESETTING REMOTE BRANCHES TO BASE              ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "⚠️  This will reset ALL remote branches to base commits"
echo "⚠️  All commits on remote will be deleted!"
echo ""

read -p "Are you sure? Type 'yes' to continue: " confirm
if [ "$confirm" != "yes" ]; then
  echo "Cancelled"
  exit 0
fi

git fetch origin > /dev/null 2>&1

for worktree_info in "${WORKTREES[@]}"; do
  IFS=':' read -r path branch <<< "$worktree_info"
  
  if [ -d "$path" ]; then
    cd "$path"
    
    FIRST_COMMIT=$(git log origin/$branch --reverse --format="%H" 2>/dev/null | head -1)
    
    if [ -n "$FIRST_COMMIT" ]; then
      echo "📁 Resetting remote $branch to first commit..."
      git push origin "$FIRST_COMMIT:refs/heads/$branch" --force > /dev/null 2>&1
      echo "   ✅ Reset to $FIRST_COMMIT"
    else
      echo "📁 $branch: No commits found, skipping"
    fi
  fi
done

cd /Users/jacksonlafrance/Fixated
FIRST_MAIN=$(git log origin/main --reverse --format="%H" 2>/dev/null | head -1)

if [ -n "$FIRST_MAIN" ]; then
  echo "📁 Resetting remote main to first commit..."
  git push origin "$FIRST_MAIN:refs/heads/main" --force > /dev/null 2>&1
  echo "   ✅ Reset to $FIRST_MAIN"
fi

echo ""
echo "✅ All remote branches reset to base!"
