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

TOTAL_DAYS=14

echo "╔════════════════════════════════════════════════════════╗"
echo "║        COUNTING UNPUSHED COMMITS                      ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

git fetch origin > /dev/null 2>&1

TOTAL_UNPUSHED=0

for worktree_info in "${WORKTREES[@]}"; do
  IFS=':' read -r path branch <<< "$worktree_info"
  
  if [ -d "$path" ]; then
    cd "$path"
    
    LOCAL=$(git rev-parse HEAD 2>/dev/null)
    REMOTE=$(git rev-parse origin/$branch 2>/dev/null 2>&1)
    
    if [ "$LOCAL" != "$REMOTE" ] && [ -n "$REMOTE" ]; then
      UNPUSHED=$(git rev-list --count origin/$branch..HEAD 2>/dev/null || echo "0")
      if [ "$UNPUSHED" -gt 0 ]; then
        echo "📁 $branch: $UNPUSHED unpushed commits"
        TOTAL_UNPUSHED=$((TOTAL_UNPUSHED + UNPUSHED))
      fi
    fi
  fi
done

cd /Users/jacksonlafrance/Fixated
LOCAL_MAIN=$(git rev-parse HEAD 2>/dev/null)
REMOTE_MAIN=$(git rev-parse origin/main 2>/dev/null)

if [ "$LOCAL_MAIN" != "$REMOTE_MAIN" ]; then
  UNPUSHED_MAIN=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "0")
  if [ "$UNPUSHED_MAIN" -gt 0 ]; then
    echo "📁 main: $UNPUSHED_MAIN unpushed commits"
    TOTAL_UNPUSHED=$((TOTAL_UNPUSHED + UNPUSHED_MAIN))
  fi
fi

echo ""
echo "📊 Total unpushed commits: $TOTAL_UNPUSHED"
echo "📅 Days to distribute: $TOTAL_DAYS"

if [ "$TOTAL_UNPUSHED" -gt 0 ]; then
  COMMITS_PER_DAY=$((TOTAL_UNPUSHED / TOTAL_DAYS))
  REMAINDER=$((TOTAL_UNPUSHED % TOTAL_DAYS))
  
  echo "📈 Commits per day: $COMMITS_PER_DAY"
  if [ "$REMAINDER" -gt 0 ]; then
    echo "   (First $REMAINDER days will have 1 extra commit)"
  fi
  
  echo ""
  echo "💡 Run ./push_daily_batch.sh to push commits gradually"
else
  echo "✅ All commits are already pushed!"
fi

