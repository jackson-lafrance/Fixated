#!/bin/bash

cd /Users/jacksonlafrance/Fixated

WORKTREES=(
  "/Users/jacksonlafrance/Fixated-auth-components:feat-auth-components"
  "/Users/jacksonlafrance/Fixated-dashboard:feat-dashboard"
  "/Users/jacksonlafrance/Fixated-skills:feat-skills-library"
  "/Users/jacksonlafrance/Fixated-habits:feat-habits-tracking"
  "/Users/jacksonlafrance/Fixated-progress-charts:feat-progress-charts"
)

commit_all_changes() {
  local worktree_path=$1
  local branch=$2
  
  cd "$worktree_path" || return 1
  
  uncommitted=$(git status --porcelain | wc -l | tr -d ' ')
  if [ "$uncommitted" -eq 0 ]; then
    echo "  ✅ No changes to commit"
    return 0
  fi
  
  echo "  📝 Committing $uncommitted file(s)..."
  
  git add -A
  
  changed_files=$(git diff --cached --name-only | head -5 | tr '\n' ',' | sed 's/,$//')
  timestamp=$(date +%Y-%m-%d\ %H:%M:%S)
  commit_msg="Auto-commit [$timestamp]: $changed_files"
  
  if git commit -m "$commit_msg" > /dev/null 2>&1; then
    echo "  ✅ Committed: $commit_msg"
    return 0
  else
    echo "  ❌ Commit failed"
    return 1
  fi
}

clean_untracked() {
  local worktree_path=$1
  
  cd "$worktree_path" || return 1
  
  untracked=$(git status --porcelain | grep "^??" | wc -l | tr -d ' ')
  if [ "$untracked" -eq 0 ]; then
    return 0
  fi
  
  untracked_files=$(git status --porcelain | grep "^??" | awk '{print $2}' | head -10)
  
  for file in $untracked_files; do
    if [[ "$file" == *".cursor/"* ]] || [[ "$file" == *"node_modules"* ]] || [[ "$file" == *".git"* ]]; then
      echo "  🗑️  Removing untracked: $file"
      rm -rf "$file" 2>/dev/null
      git clean -fd "$file" 2>/dev/null
    fi
  done
  
  git add -A 2>/dev/null
}

echo "=== HEAD AGENT: COMMITTING ALL CHANGES ==="
echo ""

for worktree_info in "${WORKTREES[@]}"; do
  IFS=':' read -r path branch <<< "$worktree_info"
  
  if [ ! -d "$path" ]; then
    echo "⚠️  Worktree not found: $path"
    continue
  fi
  
  echo "📁 $branch"
  clean_untracked "$path"
  commit_all_changes "$path" "$branch"
  echo ""
done

echo "=== COMMIT OPERATION COMPLETE ==="

