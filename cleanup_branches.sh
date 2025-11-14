#!/bin/bash

cd /Users/jacksonlafrance/Fixated

echo "╔════════════════════════════════════════════════════════╗"
echo "║        CLEANING UP ALL FEATURE BRANCHES                ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

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

WORKTREES=(
  "/Users/jacksonlafrance/Fixated-auth-components"
  "/Users/jacksonlafrance/Fixated-dashboard"
  "/Users/jacksonlafrance/Fixated-skills"
  "/Users/jacksonlafrance/Fixated-habits"
  "/Users/jacksonlafrance/Fixated-progress-charts"
  "/Users/jacksonlafrance/Fixated-daily-goals"
  "/Users/jacksonlafrance/Fixated-achievements"
  "/Users/jacksonlafrance/Fixated-notifications"
  "/Users/jacksonlafrance/Fixated-profile"
  "/Users/jacksonlafrance/Fixated-leaderboard"
)

echo "1. Removing worktrees..."
for worktree_path in "${WORKTREES[@]}"; do
  if [ -d "$worktree_path" ]; then
    echo "   Removing worktree: $worktree_path"
    git worktree remove "$worktree_path" --force 2>/dev/null || rm -rf "$worktree_path"
    echo "   ✅ Removed"
  fi
done

echo ""
echo "2. Checking out main..."
git checkout main
git fetch origin

echo ""
echo "3. Deleting local branches..."
for branch in "${BRANCHES[@]}"; do
  if git show-ref --verify --quiet refs/heads/$branch; then
    echo "   Deleting local branch: $branch"
    git branch -D "$branch" 2>/dev/null && echo "   ✅ Deleted" || echo "   ⚠️  Could not delete"
  else
    echo "   $branch: Already deleted locally"
  fi
done

echo ""
echo "4. Deleting remote branches..."
for branch in "${BRANCHES[@]}"; do
  if git ls-remote --heads origin "$branch" | grep -q "$branch"; then
    echo "   Deleting remote branch: $branch"
    git push origin --delete "$branch" 2>/dev/null && echo "   ✅ Deleted" || echo "   ⚠️  Could not delete"
  else
    echo "   $branch: Already deleted remotely"
  fi
done

echo ""
echo "5. Pruning remote references..."
git remote prune origin

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Remaining branches:"
git branch -a | grep -v "HEAD" | sed 's/^/   /'

