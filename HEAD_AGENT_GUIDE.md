# Head Agent Management System

## Overview
The Head Agent is a coordination system that monitors and manages all worktrees in parallel.

## Quick Start

### 1. Start the Head Agent (Background Monitoring)
```bash
cd /Users/jacksonlafrance/Fixated
./head_agent.sh start
```

The head agent will:
- Monitor all worktrees every 30 seconds
- Track uncommitted changes
- Detect merge conflicts
- Generate status reports
- Log everything to `.head_agent.log`

### 2. View Current Status
```bash
# Quick status report
./head_agent.sh report

# Or check if it's running
./head_agent.sh status
```

### 3. Sync All Worktrees
```bash
# Auto-commit changes and sync with remote
./sync_worktrees.sh sync

# Just commit all uncommitted changes
./sync_worktrees.sh commit-all
```

### 4. Generate Dashboard
```bash
./generate_dashboard.sh
# Then open the HTML file in your browser
```

## Commands Reference

### Head Agent Commands
- `./head_agent.sh start` - Start background monitoring
- `./head_agent.sh stop` - Stop monitoring
- `./head_agent.sh status` - Check if running
- `./head_agent.sh restart` - Restart the agent
- `./head_agent.sh report` - Generate status report

### Sync Commands
- `./sync_worktrees.sh sync` - Sync all worktrees (commit + pull)
- `./sync_worktrees.sh commit-all` - Commit all uncommitted changes

## How It Works

### Background Monitoring
The head agent runs in the background and:
1. Checks each worktree every 30 seconds
2. Tracks git status, commits, and changes
3. Detects conflicts and errors
4. Saves status to `.head_agent_status.json`
5. Logs to `.head_agent.log`

### Status File
Location: `.head_agent_status.json`
- Contains current status of all worktrees
- Updated every monitoring cycle
- Used by dashboard and reports

### Dashboard
Location: `.head_agent_dashboard.html`
- Real-time visual dashboard
- Auto-refreshes every 10 seconds
- Shows status of all worktrees
- Color-coded by status (clean/changes/error)

## Workflow

### For Individual Agents Working in Worktrees:
1. Work on your feature in your assigned worktree
2. Make commits frequently
3. The head agent will track your progress
4. Use `./sync_worktrees.sh sync` to sync with remote

### For Head Agent:
1. Monitor all worktrees continuously
2. Detect conflicts early
3. Coordinate merges
4. Generate reports for review

## Monitoring Features

### What Gets Monitored:
- ✅ Git status (clean/changes)
- ✅ Uncommitted file count
- ✅ Latest commit info
- ✅ Branch tracking
- ✅ Merge conflicts
- ✅ Errors

### Alerts:
- ⚠️ Uncommitted changes detected
- ❌ Merge conflicts found
- ❌ Errors in worktree operations

## Example Usage

```bash
# Start monitoring
./head_agent.sh start

# In another terminal, work on features...
# (agents work in their worktrees)

# Check status anytime
./head_agent.sh report

# Sync everything
./sync_worktrees.sh sync

# View dashboard
open .head_agent_dashboard.html
```

## Integration with Cursor

The head agent works alongside Cursor:
1. Open multiple Cursor windows (one per worktree)
2. Each agent works independently
3. Head agent monitors in background
4. Use dashboard to see overall status
5. Sync when ready to merge

## Troubleshooting

### Head agent not starting?
```bash
# Check if already running
./head_agent.sh status

# Check logs
tail -f .head_agent.log

# Restart
./head_agent.sh restart
```

### Conflicts detected?
```bash
# Check which worktrees have conflicts
./head_agent.sh report

# Manually resolve in affected worktree
cd /path/to/worktree
git status
# Resolve conflicts, then commit
```

### Status file not updating?
```bash
# Manually generate status
node head_agent.js

# Check permissions
ls -la .head_agent_status.json
```

