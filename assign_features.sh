#!/bin/bash

cd /Users/jacksonlafrance/Fixated

echo "╔════════════════════════════════════════════════════════╗"
echo "║     HEAD AGENT: ASSIGNING FEATURES TO WORKTREES       ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

FEATURES=(
  "Daily Goals System: Track daily goals with completion rewards and XP"
  "Achievements System: Build achievement badges, unlocks, and reward system"
  "Notifications: Implement push notifications for habits, goals, and milestones"
  "User Profile: Create comprehensive profile page with stats and settings"
  "Leaderboard: Build competitive leaderboard with rankings and comparisons"
)

WORKTREES=(
  "/Users/jacksonlafrance/Fixated-daily-goals:feat-daily-goals"
  "/Users/jacksonlafrance/Fixated-achievements:feat-achievements"
  "/Users/jacksonlafrance/Fixated-notifications:feat-notifications"
  "/Users/jacksonlafrance/Fixated-profile:feat-profile"
  "/Users/jacksonlafrance/Fixated-leaderboard:feat-leaderboard"
)

echo "📋 FEATURE ASSIGNMENTS:"
echo ""

for i in "${!FEATURES[@]}"; do
  IFS=':' read -r path branch <<< "${WORKTREES[$i]}"
  feature="${FEATURES[$i]}"
  echo "  $((i+1)). $branch"
  echo "     → $feature"
  echo "     📁 $path"
  echo ""
done

echo "🚀 OPENING WORKTREES IN CURSOR..."
echo ""

for worktree_info in "${WORKTREES[@]}"; do
  IFS=':' read -r path branch <<< "$worktree_info"
  if [ -d "$path" ]; then
    echo "Opening: $branch"
    cursor "$path" &
    sleep 1
  fi
done

echo ""
echo "✅ All worktrees opened!"
echo ""
echo "💡 Each Cursor window can now work on its assigned feature independently."
echo "💡 Head agent will monitor progress automatically."

