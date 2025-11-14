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
echo "║        PUSHING EVERYTHING TO MAIN                     ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

git fetch origin > /dev/null 2>&1

for worktree_info in "${WORKTREES[@]}"; do
  IFS=':' read -r path branch <<< "$worktree_info"
  
  if [ -d "$path" ]; then
    cd "$path"
    
    echo "📁 Pushing $branch..."
    
    if [ -n "$(git status --porcelain)" ]; then
      git add -A
      git commit -m "update $branch changes" > /dev/null 2>&1
    fi
    
    git push origin "$branch" 2>&1 | grep -v "Everything up-to-date" || echo "   ✅ Pushed"
  fi
done

cd /Users/jacksonlafrance/Fixated

if [ -n "$(git status --porcelain)" ]; then
  echo "📁 Committing main changes..."
  git add -A
  git commit -m "update main branch" > /dev/null 2>&1
fi

echo "📁 Pushing main..."
git push origin main 2>&1 | grep -v "Everything up-to-date" || echo "   ✅ Pushed"

echo ""
echo "✅ All branches pushed to remote!"
echo ""
echo "💡 To merge branches into main, run:"
echo "   git merge feat-auth-components feat-dashboard feat-skills-library feat-habits-tracking feat-progress-charts feat-daily-goals feat-achievements feat-notifications feat-profile feat-leaderboard"
echo "   git push origin main"
