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
echo "║        SHOWING REMAINING WORK FOR EACH WORKTREE       ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

for worktree_info in "${WORKTREES[@]}"; do
  IFS=':' read -r path branch <<< "$worktree_info"
  
  if [ -d "$path" ]; then
    echo "📁 $branch"
    echo "   Path: $path"
    
    if [ -f "$path/REMAINING_WORK.md" ]; then
      echo "   ✅ REMAINING_WORK.md exists"
      echo "   📋 Quick preview:"
      grep -E "^- \[ \]|^###" "$path/REMAINING_WORK.md" | head -5 | sed 's/^/      /'
    else
      echo "   ⚠️  No REMAINING_WORK.md found"
    fi
    echo ""
  fi
done

echo "💡 Each agent can check their worktree's REMAINING_WORK.md file"
echo "💡 Or run: cat REMAINING_WORK.md in their worktree directory"
