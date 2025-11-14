#!/bin/bash

cd /Users/jacksonlafrance/Fixated

echo "╔════════════════════════════════════════════════════════╗"
echo "║        AMEND EXISTING COMMITS TO TODAY'S DATE          ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "⚠️  This will amend commit dates for unpushed commits"
echo "📅 New date will be: $(date +%Y-%m-%d)"
echo ""
read -p "Continue? (y/n): " confirm

if [ "$confirm" != "y" ]; then
  echo "Cancelled"
  exit 0
fi

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

TODAY_DATE=$(date +%Y-%m-%d)
TODAY_DATETIME=$(date +%Y-%m-%d\ %H:%M:%S)

for worktree_info in "${WORKTREES[@]}"; do
  IFS=':' read -r path branch <<< "$worktree_info"
  
  if [ -d "$path" ]; then
    cd "$path"
    
    LOCAL=$(git rev-parse HEAD 2>/dev/null)
    REMOTE=$(git rev-parse origin/$branch 2>/dev/null 2>&1)
    
    if [ "$LOCAL" != "$REMOTE" ] && [ -n "$REMOTE" ]; then
      UNPUSHED_COUNT=$(git rev-list --count origin/$branch..HEAD 2>/dev/null || echo "0")
      
      if [ "$UNPUSHED_COUNT" -gt 0 ]; then
        echo "📁 $branch: $UNPUSHED_COUNT unpushed commits"
        echo "   Amending dates to $TODAY_DATE..."
        
        git filter-branch -f --env-filter "
          export GIT_AUTHOR_DATE=\"$TODAY_DATETIME\"
          export GIT_COMMITTER_DATE=\"$TODAY_DATETIME\"
        " origin/$branch..HEAD > /dev/null 2>&1
        
        echo "   ✅ Dates amended"
      fi
    fi
  fi
done

cd /Users/jacksonlafrance/Fixated
LOCAL_MAIN=$(git rev-parse HEAD 2>/dev/null)
REMOTE_MAIN=$(git rev-parse origin/main 2>/dev/null)

if [ "$LOCAL_MAIN" != "$REMOTE_MAIN" ]; then
  UNPUSHED_COUNT=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "0")
  
  if [ "$UNPUSHED_COUNT" -gt 0 ]; then
    echo "📁 main: $UNPUSHED_COUNT unpushed commits"
    echo "   Amending dates to $TODAY_DATE..."
    
    git filter-branch -f --env-filter "
      export GIT_AUTHOR_DATE=\"$TODAY_DATETIME\"
      export GIT_COMMITTER_DATE=\"$TODAY_DATETIME\"
    " origin/main..HEAD > /dev/null 2>&1
    
    echo "   ✅ Dates amended"
  fi
fi

echo ""
echo "✅ Done! Commits now dated: $TODAY_DATE"
echo "💡 Run ./push_daily_batch.sh to push them"

