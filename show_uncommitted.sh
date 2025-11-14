#!/bin/bash

cd /Users/jacksonlafrance/Fixated

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

echo "╔════════════════════════════════════════════════════════╗"
echo "║        SHOWING ALL UNCOMMITTED CHANGES                ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

TOTAL_FILES=0

for worktree_info in "${WORKTREES[@]}"; do
  IFS=':' read -r path branch feature <<< "$worktree_info"
  
  if [ -d "$path" ]; then
    cd "$path"
    
    UNCOMMITTED=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
    
    if [ "$UNCOMMITTED" -gt 0 ]; then
      echo "📁 $feature ($branch): $UNCOMMITTED files"
      git status --short 2>/dev/null | head -10 | sed 's/^/   /'
      if [ "$UNCOMMITTED" -gt 10 ]; then
        echo "   ... and $((UNCOMMITTED - 10)) more files"
      fi
      TOTAL_FILES=$((TOTAL_FILES + UNCOMMITTED))
      echo ""
    fi
  fi
done

cd /Users/jacksonlafrance/Fixated
UNCOMMITTED_MAIN=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')

if [ "$UNCOMMITTED_MAIN" -gt 0 ]; then
  echo "📁 main: $UNCOMMITTED_MAIN files"
  git status --short 2>/dev/null | head -10 | sed 's/^/   /'
  if [ "$UNCOMMITTED_MAIN" -gt 10 ]; then
    echo "   ... and $((UNCOMMITTED_MAIN - 10)) more files"
  fi
  TOTAL_FILES=$((TOTAL_FILES + UNCOMMITTED_MAIN))
  echo ""
fi

echo "📊 Total uncommitted files: $TOTAL_FILES"

TOTAL_DAYS=14
if [ "$TOTAL_FILES" -gt 0 ]; then
  FILES_PER_DAY=$((TOTAL_FILES / TOTAL_DAYS))
  REMAINDER=$((TOTAL_FILES % TOTAL_DAYS))
  
  echo "📅 Distribution over $TOTAL_DAYS days:"
  echo "   Files per day: ~$FILES_PER_DAY"
  if [ "$REMAINDER" -gt 0 ]; then
    echo "   First $REMAINDER days get 1 extra file"
  fi
fi
