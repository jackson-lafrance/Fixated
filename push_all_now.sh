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
echo "║        PUSHING ALL COMMITS TO REMOTE                  ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

git fetch origin > /dev/null 2>&1

for worktree_info in "${WORKTREES[@]}"; do
  IFS=':' read -r path branch <<< "$worktree_info"
  
  if [ -d "$path" ]; then
    cd "$path"
    
    UNPUSHED=$(git rev-list --count origin/$branch..HEAD 2>/dev/null || echo "0")
    
    if [ "$UNPUSHED" -gt 0 ]; then
      echo "📁 Pushing $branch ($UNPUSHED commits)..."
      if git push origin "$branch" 2>&1 | grep -q "error\|conflict\|rejected"; then
        echo "   ⚠️  Push failed - may have conflicts"
      else
        echo "   ✅ Pushed successfully"
      fi
    else
      echo "📁 $branch: ✅ Already pushed"
    fi
  fi
done

cd /Users/jacksonlafrance/Fixated
UNPUSHED_MAIN=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "0")

if [ "$UNPUSHED_MAIN" -gt 0 ]; then
  echo "📁 Pushing main ($UNPUSHED_MAIN commits)..."
  git push origin main 2>&1 | grep -q "error\|conflict\|rejected" && echo "   ⚠️  Push failed" || echo "   ✅ Pushed successfully"
else
  echo "📁 main: ✅ Already pushed"
fi

echo ""
echo "✅ Push complete!"

