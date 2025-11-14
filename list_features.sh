#!/bin/bash

cd /Users/jacksonlafrance/Fixated

echo "╔════════════════════════════════════════════════════════╗"
echo "║           HEAD AGENT: FEATURE ASSIGNMENT              ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

FEATURES=(
  "Daily Goals System: Create daily goal tracking with completion rewards"
  "Achievements System: Build achievement badges and unlock system"
  "Notifications: Implement push notifications for habits and goals"
  "User Profile: Create comprehensive user profile page"
  "Leaderboard: Build competitive leaderboard system"
  "Streak Visualization: Add visual streak tracking components"
  "Skill Rating Editor: Allow users to manually adjust skill ratings"
  "Progress Comparison: Build yesterday vs today comparison views"
  "Habit Analytics: Create detailed habit analytics dashboard"
  "Mobile Navigation: Implement React Native navigation structure"
)

echo "📋 AVAILABLE FEATURES TO ASSIGN:"
echo ""
for i in "${!FEATURES[@]}"; do
  echo "  $((i+1)). ${FEATURES[$i]}"
done
echo ""
echo "💡 Use: ./assign_feature.sh <worktree-name> <feature-number>"
echo "   Example: ./assign_feature.sh daily-goals 1"

