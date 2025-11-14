#!/bin/bash

WORKTREES=(
  "/Users/jacksonlafrance/Fixated-auth-components:feat-auth-components"
  "/Users/jacksonlafrance/Fixated-dashboard:feat-dashboard"
  "/Users/jacksonlafrance/Fixated-skills:feat-skills-library"
  "/Users/jacksonlafrance/Fixated-habits:feat-habits-tracking"
  "/Users/jacksonlafrance/Fixated-progress-charts:feat-progress-charts"
)

MAIN_REPO="/Users/jacksonlafrance/Fixated"
MAIN_BRANCH="main"

check_and_merge() {
  local worktree_path=$1
  local branch=$2
  
  cd "$worktree_path" || return 1
  
  echo "Checking $branch..."
  
  uncommitted=$(git status --porcelain | wc -l | tr -d ' ')
  if [ "$uncommitted" -gt 0 ]; then
    echo "  ⚠️  Has $uncommitted uncommitted files - skipping merge"
    return 1
  fi
  
  git fetch origin "$branch" 2>/dev/null
  
  local_behind=$(git rev-list --count HEAD..origin/"$branch" 2>/dev/null || echo "0")
  if [ "$local_behind" -gt 0 ]; then
    echo "  ⬇️  Pulling latest changes..."
    git pull origin "$branch" --no-edit || {
      echo "  ❌ Merge conflict detected!"
      return 1
    }
  fi
  
  echo "  ✅ Up to date"
  return 0
}

auto_commit() {
  local worktree_path=$1
  local branch=$2
  
  cd "$worktree_path" || return 1
  
  uncommitted=$(git status --porcelain | wc -l | tr -d ' ')
  if [ "$uncommitted" -eq 0 ]; then
    return 0
  fi
  
  echo "Auto-committing changes in $branch..."
  
  git add -A
  
  changed_files=$(git diff --cached --name-only | head -3 | tr '\n' ',' | sed 's/,$//')
  commit_msg="Auto-commit: $(date +%Y-%m-%d\ %H:%M:%S) - $changed_files"
  
  git commit -m "$commit_msg" && {
    echo "  ✅ Committed: $commit_msg"
    return 0
  }
  
  echo "  ❌ Commit failed"
  return 1
}

sync_all() {
  echo "=== SYNCING ALL WORKTREES ==="
  echo ""
  
  for worktree_info in "${WORKTREES[@]}"; do
    IFS=':' read -r path branch <<< "$worktree_info"
    
    if [ ! -d "$path" ]; then
      echo "⚠️  Worktree not found: $path"
      continue
    fi
    
    echo "📁 $branch"
    
    auto_commit "$path" "$branch"
    check_and_merge "$path" "$branch"
    
    echo ""
  done
  
  echo "=== SYNC COMPLETE ==="
}

case "$1" in
  sync)
    sync_all
    ;;
  commit-all)
    for worktree_info in "${WORKTREES[@]}"; do
      IFS=':' read -r path branch <<< "$worktree_info"
      auto_commit "$path" "$branch"
    done
    ;;
  *)
    echo "Usage: $0 {sync|commit-all}"
    exit 1
    ;;
esac

