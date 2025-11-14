#!/bin/bash

cd /Users/jacksonlafrance/Fixated

TOTAL_DAYS=14

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

STATE_FILE="/Users/jacksonlafrance/Fixated/.commit_batch_state.json"

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
      TOTAL_UNPUSHED=$((TOTAL_UNPUSHED + UNPUSHED))
    fi
  fi
done

cd /Users/jacksonlafrance/Fixated
LOCAL_MAIN=$(git rev-parse HEAD 2>/dev/null)
REMOTE_MAIN=$(git rev-parse origin/main 2>/dev/null)

if [ "$LOCAL_MAIN" != "$REMOTE_MAIN" ]; then
  UNPUSHED_MAIN=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "0")
  TOTAL_UNPUSHED=$((TOTAL_UNPUSHED + UNPUSHED_MAIN))
fi

if [ "$TOTAL_UNPUSHED" -eq 0 ]; then
  echo "✅ All commits are already pushed!"
  exit 0
fi

COMMITS_PER_DAY=$((TOTAL_UNPUSHED / TOTAL_DAYS))
REMAINDER=$((TOTAL_UNPUSHED % TOTAL_DAYS))

if [ "$COMMITS_PER_DAY" -lt 1 ]; then
  COMMITS_PER_DAY=1
fi

if [ ! -f "$STATE_FILE" ]; then
  echo "{\"day\": 1, \"commits_pushed_today\": 0, \"last_push_date\": \"$(date +%Y-%m-%d)\", \"total_unpushed\": $TOTAL_UNPUSHED, \"commits_per_day\": $COMMITS_PER_DAY}" > "$STATE_FILE"
fi

DAY=$(cat "$STATE_FILE" | grep -o '"day":[^,]*' | cut -d: -f2 | tr -d ' ')
LAST_DATE=$(cat "$STATE_FILE" | grep -o '"last_push_date":"[^"]*' | cut -d'"' -f4)
TODAY=$(date +%Y-%m-%d)
COMMITS_PUSHED=$(cat "$STATE_FILE" | grep -o '"commits_pushed_today":[^,]*' | cut -d: -f2 | tr -d ' ')

if [ "$LAST_DATE" != "$TODAY" ]; then
  DAY=$((DAY + 1))
  COMMITS_PUSHED=0
  echo "{\"day\": $DAY, \"commits_pushed_today\": 0, \"last_push_date\": \"$TODAY\", \"total_unpushed\": $TOTAL_UNPUSHED, \"commits_per_day\": $COMMITS_PER_DAY}" > "$STATE_FILE"
fi

TODAYS_LIMIT=$COMMITS_PER_DAY
if [ "$DAY" -le "$REMAINDER" ]; then
  TODAYS_LIMIT=$((COMMITS_PER_DAY + 1))
fi

if [ "$COMMITS_PUSHED" -ge "$TODAYS_LIMIT" ]; then
  echo "⚠️  Already pushed $COMMITS_PUSHED commits today (limit: $TODAYS_LIMIT)"
  echo "📅 Day $DAY of $TOTAL_DAYS"
  echo "💡 Wait until tomorrow or reset the counter"
  exit 0
fi

REMAINING=$((TODAYS_LIMIT - COMMITS_PUSHED))

echo "╔════════════════════════════════════════════════════════╗"
echo "║        DAILY COMMIT PUSHER (Day $DAY/$TOTAL_DAYS)              ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Status:"
echo "   Total unpushed commits: $TOTAL_UNPUSHED"
echo "   Commits per day: $COMMITS_PER_DAY"
echo "   Today's limit: $TODAYS_LIMIT"
echo "   Commits pushed today: $COMMITS_PUSHED / $TODAYS_LIMIT"
echo "   Remaining today: $REMAINING"
echo "   📅 Commits will show date: $(date +%Y-%m-%d)"
echo ""

COMMITS_TO_PUSH=$REMAINING
PUSHED=0

for worktree_info in "${WORKTREES[@]}"; do
  IFS=':' read -r path branch <<< "$worktree_info"
  
  if [ -d "$path" ] && [ "$PUSHED" -lt "$COMMITS_TO_PUSH" ]; then
    cd "$path"
    
    LOCAL=$(git rev-parse HEAD 2>/dev/null)
    REMOTE=$(git rev-parse origin/$branch 2>/dev/null 2>&1)
    
    if [ "$LOCAL" != "$REMOTE" ] && [ -n "$REMOTE" ]; then
      UNPUSHED_COUNT=$(git rev-list --count origin/$branch..HEAD 2>/dev/null || echo "0")
      
      if [ "$UNPUSHED_COUNT" -gt 0 ] && [ "$PUSHED" -lt "$COMMITS_TO_PUSH" ]; then
        COMMITS_FROM_BRANCH=$((COMMITS_TO_PUSH - PUSHED))
        if [ "$COMMITS_FROM_BRANCH" -gt "$UNPUSHED_COUNT" ]; then
          COMMITS_FROM_BRANCH=$UNPUSHED_COUNT
        fi
        
        COMMITS_TO_PUSH_LIST=$(git rev-list origin/$branch..HEAD 2>/dev/null | head -$COMMITS_FROM_BRANCH)
        
        for commit_hash in $COMMITS_TO_PUSH_LIST; do
          if [ "$PUSHED" -lt "$COMMITS_TO_PUSH" ] && [ -n "$commit_hash" ]; then
            COMMIT_MSG=$(git log -1 --format=%s "$commit_hash" 2>/dev/null)
            if git push origin "$commit_hash:refs/heads/$branch" > /dev/null 2>&1; then
              PUSHED=$((PUSHED + 1))
              echo "✅ Pushed: \"$COMMIT_MSG\" from $branch ($PUSHED/$COMMITS_TO_PUSH)"
            fi
          fi
        done
      fi
    fi
  fi
done

cd /Users/jacksonlafrance/Fixated
if [ "$PUSHED" -lt "$COMMITS_TO_PUSH" ]; then
  LOCAL_MAIN=$(git rev-parse HEAD 2>/dev/null)
  REMOTE_MAIN=$(git rev-parse origin/main 2>/dev/null)
  
  if [ "$LOCAL_MAIN" != "$REMOTE_MAIN" ]; then
    UNPUSHED_COUNT=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "0")
    
    if [ "$UNPUSHED_COUNT" -gt 0 ]; then
      COMMITS_FROM_MAIN=$((COMMITS_TO_PUSH - PUSHED))
      if [ "$COMMITS_FROM_MAIN" -gt "$UNPUSHED_COUNT" ]; then
        COMMITS_FROM_MAIN=$UNPUSHED_COUNT
      fi
      
      COMMITS_TO_PUSH_LIST=$(git rev-list origin/main..HEAD 2>/dev/null | head -$COMMITS_FROM_MAIN)
      
      for commit_hash in $COMMITS_TO_PUSH_LIST; do
        if [ "$PUSHED" -lt "$COMMITS_TO_PUSH" ] && [ -n "$commit_hash" ]; then
          COMMIT_MSG=$(git log -1 --format=%s "$commit_hash" 2>/dev/null)
          if git push origin "$commit_hash:refs/heads/main" > /dev/null 2>&1; then
            PUSHED=$((PUSHED + 1))
            echo "✅ Pushed: \"$COMMIT_MSG\" from main ($PUSHED/$COMMITS_TO_PUSH)"
          fi
        fi
      done
    fi
  fi
fi

NEW_COUNT=$((COMMITS_PUSHED + PUSHED))
echo "{\"day\": $DAY, \"commits_pushed_today\": $NEW_COUNT, \"last_push_date\": \"$TODAY\", \"total_unpushed\": $TOTAL_UNPUSHED, \"commits_per_day\": $COMMITS_PER_DAY}" > "$STATE_FILE"

echo ""
echo "✅ Pushed $PUSHED commits today"
echo "📊 Total today: $NEW_COUNT / $TODAYS_LIMIT"
echo "📅 Day $DAY of $TOTAL_DAYS"
echo ""
echo "💡 These commits will show on GitHub as made on: $(date +%Y-%m-%d)"
