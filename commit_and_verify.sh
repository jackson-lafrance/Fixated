#!/bin/bash

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║        COMMITTING ALL CHANGES & VERIFYING BATCHING    ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

cd /Users/jacksonlafrance/Fixated-dashboard
if [ -n "$(git status --porcelain)" ]; then
  echo "📁 Committing dashboard changes..."
  git add -A
  git commit -m "feat: add dashboard widgets and components" || true
  echo "   ✅ Done"
fi

cd /Users/jacksonlafrance/Fixated-skills
if [ -n "$(git status --porcelain)" ]; then
  echo "📁 Committing skills changes..."
  git add -A
  git commit -m "feat: add skill editing modal and MySkillsView" || true
  echo "   ✅ Done"
fi

cd /Users/jacksonlafrance/Fixated-habits
if [ -n "$(git status --porcelain)" ]; then
  echo "📁 Committing habits changes..."
  git add -A
  git commit -m "feat: add navigation component and login/signup views" || true
  echo "   ✅ Done"
fi

cd /Users/jacksonlafrance/Fixated-progress-charts
if [ -n "$(git status --porcelain)" ]; then
  echo "📁 Committing charts changes..."
  git add -A
  git commit -m "feat: add new chart components and HabitsContext" || true
  echo "   ✅ Done"
fi

cd /Users/jacksonlafrance/Fixated
if [ -n "$(git status --porcelain)" ]; then
  echo "📁 Committing main changes..."
  git add -A
  git commit -m "docs: add commit batching system" || true
  echo "   ✅ Done"
fi

echo ""
echo "✅ All changes committed!"
echo ""
echo "📊 Checking unpushed commits..."

cd /Users/jacksonlafrance/Fixated
git fetch origin > /dev/null 2>&1 || true

TOTAL_UNPUSHED=0

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

for worktree_info in "${WORKTREES[@]}"; do
  IFS=':' read -r dir branch <<< "$worktree_info"
  path="/Users/jacksonlafrance/$dir"
  
  if [ -d "$path" ]; then
    cd "$path" 2>/dev/null || continue
    
    LOCAL=$(git rev-parse HEAD 2>/dev/null || echo "")
    REMOTE=$(git rev-parse origin/$branch 2>/dev/null || echo "")
    
    if [ -n "$LOCAL" ] && [ -n "$REMOTE" ] && [ "$LOCAL" != "$REMOTE" ]; then
      UNPUSHED=$(git rev-list --count origin/$branch..HEAD 2>/dev/null || echo "0")
      if [ "$UNPUSHED" -gt 0 ]; then
        echo "   $branch: $UNPUSHED unpushed"
        TOTAL_UNPUSHED=$((TOTAL_UNPUSHED + UNPUSHED))
      fi
    fi
  fi
done

cd /Users/jacksonlafrance/Fixated
LOCAL_MAIN=$(git rev-parse HEAD 2>/dev/null || echo "")
REMOTE_MAIN=$(git rev-parse origin/main 2>/dev/null || echo "")

if [ -n "$LOCAL_MAIN" ] && [ -n "$REMOTE_MAIN" ] && [ "$LOCAL_MAIN" != "$REMOTE_MAIN" ]; then
  UNPUSHED_MAIN=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "0")
  if [ "$UNPUSHED_MAIN" -gt 0 ]; then
    echo "   main: $UNPUSHED_MAIN unpushed"
    TOTAL_UNPUSHED=$((TOTAL_UNPUSHED + UNPUSHED_MAIN))
  fi
fi

echo ""
echo "📊 Total unpushed commits: $TOTAL_UNPUSHED"

if [ "$TOTAL_UNPUSHED" -gt 0 ]; then
  TOTAL_DAYS=14
  COMMITS_PER_DAY=$((TOTAL_UNPUSHED / TOTAL_DAYS))
  REMAINDER=$((TOTAL_UNPUSHED % TOTAL_DAYS))
  
  echo "📅 Distribution over $TOTAL_DAYS days:"
  echo "   Commits per day: $COMMITS_PER_DAY"
  if [ "$REMAINDER" -gt 0 ]; then
    echo "   First $REMAINDER days get 1 extra commit"
  fi
  echo ""
  echo "✅ Daily batching system ready!"
  echo "💡 Run: bash push_daily_batch.sh to push today's batch"
else
  echo "✅ All commits are already pushed!"
fi

