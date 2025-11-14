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
echo "║           PUSHING ALL WORKTREES TO REMOTE              ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

for worktree_info in "${WORKTREES[@]}"; do
  IFS=':' read -r path branch <<< "$worktree_info"
  
  if [ -d "$path" ]; then
    echo "📁 Pushing $branch..."
    cd "$path"
    
    if git push origin "$branch" 2>&1; then
      echo "   ✅ Successfully pushed $branch"
    else
      echo "   ⚠️  Failed to push $branch (may need upstream set)"
      git push --set-upstream origin "$branch" 2>&1 && echo "   ✅ Set upstream and pushed $branch" || echo "   ❌ Error pushing $branch"
    fi
    echo ""
  fi
done

echo "📁 Pushing main branch..."
cd /Users/jacksonlafrance/Fixated
if git push origin main 2>&1; then
  echo "   ✅ Successfully pushed main"
else
  echo "   ⚠️  Failed to push main"
fi

echo ""
echo "✅ Push complete! Checking status..."
echo ""
cd /Users/jacksonlafrance/Fixated && git fetch origin && echo "✅ Fetched latest from remote"

