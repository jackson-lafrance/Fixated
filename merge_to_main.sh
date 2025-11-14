#!/bin/bash

cd /Users/jacksonlafrance/Fixated

echo "Aborting any ongoing merge..."
git merge --abort 2>/dev/null || true

echo "Checking out main..."
git checkout main
git fetch origin

echo "Merging all feature branches into main..."

BRANCHES=(
  "feat-auth-components"
  "feat-dashboard"
  "feat-skills-library"
  "feat-habits-tracking"
  "feat-progress-charts"
  "feat-daily-goals"
  "feat-achievements"
  "feat-notifications"
  "feat-profile"
  "feat-leaderboard"
)

for branch in "${BRANCHES[@]}"; do
  echo ""
  echo "Merging $branch..."
  if git merge origin/$branch -X theirs --no-edit 2>&1 | tee /tmp/merge_output.log; then
    echo "✅ Successfully merged $branch"
  else
    if grep -q "CONFLICT" /tmp/merge_output.log; then
      echo "⚠️  Conflicts detected in $branch, resolving automatically..."
      git checkout --theirs .
      git add .
      git commit --no-edit || git commit -m "Merge $branch into main"
      echo "✅ Resolved conflicts and merged $branch"
    else
      echo "❌ Failed to merge $branch"
      exit 1
    fi
  fi
done

echo ""
echo "Pushing main to remote..."
git push origin main

echo ""
echo "✅ All branches merged into main and pushed!"
