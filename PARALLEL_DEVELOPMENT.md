# Fixated - Parallel Development Guide

## Running Agents in Parallel Across Worktrees

### Method 1: Multiple Cursor Windows (Recommended)

1. **Open each worktree in a separate Cursor window:**
   ```bash
   cursor /Users/jacksonlafrance/Fixated-auth-components
   cursor /Users/jacksonlafrance/Fixated-dashboard
   cursor /Users/jacksonlafrance/Fixated-skills
   cursor /Users/jacksonlafrance/Fixated-habits
   cursor /Users/jacksonlafrance/Fixated-progress-charts
   ```

2. **Or use the provided script:**
   ```bash
   ./open_worktrees.sh
   ```

3. **Each window will have its own AI agent** that can work independently on that worktree's feature.

### Method 2: VS Code Multi-root Workspace

Create a workspace file that includes all worktrees:

```json
{
  "folders": [
    { "path": "/Users/jacksonlafrance/Fixated-auth-components" },
    { "path": "/Users/jacksonlafrance/Fixated-dashboard" },
    { "path": "/Users/jacksonlafrance/Fixated-skills" },
    { "path": "/Users/jacksonlafrance/Fixated-habits" },
    { "path": "/Users/jacksonlafrance/Fixated-progress-charts" }
  ],
  "settings": {}
}
```

### Method 3: Terminal + Cursor Combo

1. Open terminal windows for each worktree
2. Use terminal commands to work on each feature
3. Use Cursor for the main worktree you're focusing on

### Current Worktree Structure

```
Fixated (main repo)
├── Fixated-auth-components (feat-auth-components)
│   └── Login/Signup components
├── Fixated-dashboard (feat-dashboard)
│   └── Dashboard view, UserStats
├── Fixated-skills (feat-skills-library)
│   └── SkillsView, SkillCard
├── Fixated-habits (feat-habits-tracking)
│   └── HabitsView, HabitCard
└── Fixated-progress-charts (feat-progress-charts)
    └── ProgressChart component
```

### Best Practices for Parallel Development

1. **Each agent should:**
   - Work only in their assigned worktree
   - Make frequent commits
   - Push to their feature branch regularly
   - Avoid modifying shared core files simultaneously

2. **Coordination:**
   - Core files (types, firebase config) should be updated carefully
   - If multiple agents need to modify core files, coordinate via PRs
   - Merge feature branches back to main when complete

3. **Testing:**
   - Test each feature branch independently
   - Merge and test integration before final merge to main

### Quick Commands

```bash
# List all worktrees
cd /Users/jacksonlafrance/Fixated && git worktree list

# Switch to a specific worktree (if needed)
cd /Users/jacksonlafrance/Fixated-auth-components

# Make commits in each worktree independently
cd /Users/jacksonlafrance/Fixated-auth-components
git add -A
git commit -m "Your commit message"

# Push feature branch
git push origin feat-auth-components
```

