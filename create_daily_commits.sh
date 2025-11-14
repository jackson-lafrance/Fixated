#!/bin/bash

cd /Users/jacksonlafrance/Fixated

TOTAL_DAYS=14

WORKTREES=(
  "/Users/jacksonlafrance/Fixated-auth-components:feat-auth-components:auth"
  "/Users/jacksonlafrance/Fixated-dashboard:feat-dashboard:dashboard"
  "/Users/jacksonlafrance/Fixated-skills:feat-skills-library:skills"
  "/Users/jacksonlafrance/Fixated-habits:feat-habits-tracking:habits"
  "/Users/jacksonlafrance/Fixated-progress-charts:feat-progress-charts:charts"
  "/Users/jacksonlafrance/Fixated-daily-goals:feat-daily-goals:daily-goals"
  "/Users/jacksonlafrance/Fixated-achievements:feat-achievements:achievements"
  "/Users/jacksonlafrance/Fixated-notifications:feat-notifications:notifications"
  "/Users/jacksonlafrance/Fixated-profile:feat-profile:profile"
  "/Users/jacksonlafrance/Fixated-leaderboard:feat-leaderboard:leaderboard"
)

STATE_FILE="/Users/jacksonlafrance/Fixated/.commit_batch_state.json"

TOTAL_FILES=0

for worktree_info in "${WORKTREES[@]}"; do
  IFS=':' read -r path branch feature <<< "$worktree_info"
  
  if [ -d "$path" ]; then
    cd "$path"
    UNCOMMITTED=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
    TOTAL_FILES=$((TOTAL_FILES + UNCOMMITTED))
  fi
done

cd /Users/jacksonlafrance/Fixated
UNCOMMITTED_MAIN=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
TOTAL_FILES=$((TOTAL_FILES + UNCOMMITTED_MAIN))

if [ "$TOTAL_FILES" -eq 0 ]; then
  echo "✅ All changes are already committed!"
  exit 0
fi

FILES_PER_DAY=$((TOTAL_FILES / TOTAL_DAYS))
REMAINDER=$((TOTAL_FILES % TOTAL_DAYS))

if [ "$FILES_PER_DAY" -lt 1 ]; then
  FILES_PER_DAY=1
fi

if [ ! -f "$STATE_FILE" ]; then
  echo "{\"day\": 1, \"files_committed_today\": 0, \"last_commit_date\": \"$(date +%Y-%m-%d)\", \"total_files\": $TOTAL_FILES, \"files_per_day\": $FILES_PER_DAY}" > "$STATE_FILE"
fi

DAY=$(cat "$STATE_FILE" | grep -o '"day":[^,]*' | cut -d: -f2 | tr -d ' ')
LAST_DATE=$(cat "$STATE_FILE" | grep -o '"last_commit_date":"[^"]*' | cut -d'"' -f4)
TODAY=$(date +%Y-%m-%d)
FILES_COMMITTED=$(cat "$STATE_FILE" | grep -o '"files_committed_today":[^,]*' | cut -d: -f2 | tr -d ' ')

if [ "$LAST_DATE" != "$TODAY" ]; then
  DAY=$((DAY + 1))
  FILES_COMMITTED=0
  echo "{\"day\": $DAY, \"files_committed_today\": 0, \"last_commit_date\": \"$TODAY\", \"total_files\": $TOTAL_FILES, \"files_per_day\": $FILES_PER_DAY}" > "$STATE_FILE"
fi

TODAYS_LIMIT=$FILES_PER_DAY
if [ "$DAY" -le "$REMAINDER" ]; then
  TODAYS_LIMIT=$((FILES_PER_DAY + 1))
fi

if [ "$FILES_COMMITTED" -ge "$TODAYS_LIMIT" ]; then
  echo "⚠️  Already committed $FILES_COMMITTED files today (limit: $TODAYS_LIMIT)"
  echo "📅 Day $DAY of $TOTAL_DAYS"
  echo "💡 Wait until tomorrow or reset the counter"
  exit 0
fi

REMAINING=$((TODAYS_LIMIT - FILES_COMMITTED))

echo "╔════════════════════════════════════════════════════════╗"
echo "║        DAILY COMMIT CREATOR (Day $DAY/$TOTAL_DAYS)              ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Status:"
echo "   Total uncommitted files: $TOTAL_FILES"
echo "   Files per day: $FILES_PER_DAY"
echo "   Today's limit: $TODAYS_LIMIT"
echo "   Files committed today: $FILES_COMMITTED / $TODAYS_LIMIT"
echo "   Remaining today: $REMAINING"
echo "   📅 Commits will be dated: $(date +%Y-%m-%d)"
echo ""

COMMITS_CREATED=0
FILES_IN_COMMITS=0
TODAY_DATE=$(date +%Y-%m-%d)
TODAY_DATETIME=$(date +%Y-%m-%d\ %H:%M:%S)

getCommitMessage() {
  local feature=$1
  local changed_files=$2
  
  case $feature in
    auth)
      if echo "$changed_files" | grep -q "Login\|Signup"; then
        echo "add login and signup components"
      elif echo "$changed_files" | grep -q "Password\|Reset"; then
        echo "add password reset functionality"
      else
        echo "add authentication components"
      fi
      ;;
    dashboard)
      if echo "$changed_files" | grep -q "DailyGoals\|Widget"; then
        echo "add daily goals widget to dashboard"
      elif echo "$changed_files" | grep -q "QuickStats\|Stats"; then
        echo "add quick stats cards to dashboard"
      elif echo "$changed_files" | grep -q "Activity\|Feed"; then
        echo "add recent activity feed to dashboard"
      else
        echo "add dashboard widgets and components"
      fi
      ;;
    skills)
      if echo "$changed_files" | grep -q "Edit\|Modal"; then
        echo "add skill editing modal"
      elif echo "$changed_files" | grep -q "MySkills\|View"; then
        echo "add my skills view"
      else
        echo "add skill management features"
      fi
      ;;
    habits)
      if echo "$changed_files" | grep -q "Navigation"; then
        echo "add navigation component"
      elif echo "$changed_files" | grep -q "Login\|Signup"; then
        echo "add login and signup views"
      else
        echo "add habit tracking components"
      fi
      ;;
    charts)
      if echo "$changed_files" | grep -q "Yesterday\|Comparison"; then
        echo "add yesterday comparison chart"
      elif echo "$changed_files" | grep -q "SkillSpecific"; then
        echo "add skill-specific charts"
      elif echo "$changed_files" | grep -q "HabitCompletion"; then
        echo "add habit completion chart"
      elif echo "$changed_files" | grep -q "Streak"; then
        echo "add streak visualization chart"
      else
        echo "add progress chart components"
      fi
      ;;
    daily-goals)
      echo "add daily goals tracking"
      ;;
    achievements)
      echo "add achievements system"
      ;;
    notifications)
      echo "add notification system"
      ;;
    profile)
      echo "add user profile features"
      ;;
    leaderboard)
      echo "add leaderboard system"
      ;;
    *)
      echo "update $feature components"
      ;;
  esac
}

for worktree_info in "${WORKTREES[@]}"; do
  IFS=':' read -r path branch feature <<< "$worktree_info"
  
  if [ -d "$path" ] && [ "$FILES_IN_COMMITS" -lt "$REMAINING" ]; then
    cd "$path"
    
    UNCOMMITTED=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
    
    if [ "$UNCOMMITTED" -gt 0 ] && [ "$FILES_IN_COMMITS" -lt "$REMAINING" ]; then
      FILES_TO_COMMIT=$((REMAINING - FILES_IN_COMMITS))
      if [ "$FILES_TO_COMMIT" -gt "$UNCOMMITTED" ]; then
        FILES_TO_COMMIT=$UNCOMMITTED
      fi
      
      git add -A
      
      CHANGED_FILES=$(git status --porcelain 2>/dev/null | head -10)
      FILES_IN_THIS_COMMIT=$(echo "$CHANGED_FILES" | wc -l | tr -d ' ')
      
      COMMIT_MSG=$(getCommitMessage "$feature" "$CHANGED_FILES")
      
      if git commit -m "$COMMIT_MSG" --date="$TODAY_DATETIME" > /dev/null 2>&1; then
        COMMITS_CREATED=$((COMMITS_CREATED + 1))
        FILES_IN_COMMITS=$((FILES_IN_COMMITS + FILES_IN_THIS_COMMIT))
        echo "✅ Created commit in $feature: \"$COMMIT_MSG\" ($FILES_IN_THIS_COMMIT files)"
      fi
    fi
  fi
done

cd /Users/jacksonlafrance/Fixated
if [ "$FILES_IN_COMMITS" -lt "$REMAINING" ]; then
  UNCOMMITTED_MAIN=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
  
  if [ "$UNCOMMITTED_MAIN" -gt 0 ]; then
    git add -A
    
    FILES_IN_THIS_COMMIT=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
    
      if git commit -m "update project documentation and scripts" --date="$TODAY_DATETIME" > /dev/null 2>&1; then
        COMMITS_CREATED=$((COMMITS_CREATED + 1))
        FILES_IN_COMMITS=$((FILES_IN_COMMITS + FILES_IN_THIS_COMMIT))
        echo "✅ Created commit in main: \"update project documentation and scripts\" ($FILES_IN_THIS_COMMIT files)"
    fi
  fi
fi

NEW_COUNT=$((FILES_COMMITTED + FILES_IN_COMMITS))
echo "{\"day\": $DAY, \"files_committed_today\": $NEW_COUNT, \"last_commit_date\": \"$TODAY\", \"total_files\": $TOTAL_FILES, \"files_per_day\": $FILES_PER_DAY}" > "$STATE_FILE"

echo ""
echo "✅ Created $COMMITS_CREATED commits with $FILES_IN_COMMITS files today"
echo "📊 Total today: $NEW_COUNT / $TODAYS_LIMIT"
echo "📅 Day $DAY of $TOTAL_DAYS"
echo ""
echo "💡 These commits are dated: $TODAY_DATE"
echo "💡 Run ./push_daily_batch.sh to push them to remote"
