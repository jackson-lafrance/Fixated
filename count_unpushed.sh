#!/bin/bash

cd /Users/jacksonlafrance/Fixated

WORKTREES=(
  "Fixated-auth-components:feat-auth-components"
  "Fixated-dashboard:feat-dashboard"
  "Fixated-skills:feat-skills-library"
  "Fixated-habits:feat-habits-tracking"
  "Fixated-progress-charts:feat-progress-charts"
  "Fixated-daily-goals:feat-daily-goals"
  "Fixated-achievements:feat-achievements"
  "Fixated-notifications:feat-notifications"
  "Fixated-profile:feat-profile"
  "Fixated-leaderboard:feat-leaderboard"
)

TOTAL_DAYS=14

echo "Counting unpushed commits..."
git fetch origin > /dev/null 2>&1

TOTAL_UNPUSHED=0

for worktree_info in "${WORKTREES[@]}"; do
  IFS=':' read -r dir branch <<< "$worktree_info"
  path="/Users/jacksonlafrance/$dir"
  
  if [ -d "$path" ]; then
    cd "$path" 2>/dev/null || continue
    
    LOCAL=$(git rev-parse HEAD 2>/dev/null)
    REMOTE=$(git rev-parse origin/$branch 2>/dev/null 2>&1)
    
    if [ "$LOCAL" != "$REMOTE" ] && [ -n "$REMOTE" ] && [ "$REMOTE" != "origin/$branch" ]; then
      UNPUSHED=$(git rev-list --count origin/$branch..HEAD 2>/dev/null || echo "0")
      if [ "$UNPUSHED" -gt 0 ]; then
        echo "$branch: $UNPUSHED unpushed"
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
    echo "main: $UNPUSHED_MAIN unpushed"
    TOTAL_UNPUSHED=$((TOTAL_UNPUSHED + UNPUSHED_MAIN))
  fi
fi

echo ""
echo "Total unpushed: $TOTAL_UNPUSHED"
echo "Days: $TOTAL_DAYS"

if [ "$TOTAL_UNPUSHED" -gt 0 ]; then
  COMMITS_PER_DAY=$((TOTAL_UNPUSHED / TOTAL_DAYS))
  REMAINDER=$((TOTAL_UNPUSHED % TOTAL_DAYS))
  
  echo "Commits per day: $COMMITS_PER_DAY"
  if [ "$REMAINDER" -gt 0 ]; then
    echo "First $REMAINDER days get 1 extra commit"
  fi
else
  echo "All commits are pushed!"
fi
