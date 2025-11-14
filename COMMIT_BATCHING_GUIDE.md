# COMMIT BATCHING SYSTEM - READY TO USE

## ✅ System Setup Complete

The commit batching system is ready! It will:
1. **Count total unpushed commits** across all branches
2. **Calculate commits per day** (total ÷ 14 days)
3. **Push commits gradually** with today's date
4. **Track progress** automatically

## 📊 How to Check Unpushed Commits

Run this to see how many commits need to be pushed:
```bash
cd /Users/jacksonlafrance/Fixated
bash count_unpushed.sh
```

This will show:
- Unpushed commits per branch
- Total unpushed commits
- Calculated commits per day
- How many days get extra commits

## 🚀 Daily Push Process

### Step 1: Check Status
```bash
bash count_unpushed.sh
```

### Step 2: Push Today's Batch
```bash
bash push_daily_batch.sh
```

The script will:
- Calculate how many commits to push today
- Push them with **today's date** (so they show on GitHub as made today)
- Track progress in `.commit_batch_state.json`
- Reset daily counter automatically

## 📅 How It Works

**Example**: If you have 140 unpushed commits:
- Commits per day: 140 ÷ 14 = 10 commits/day
- Each day you run the script, it pushes 10 commits
- After 14 days, all commits are pushed
- All commits show the date you pushed them (not when originally created)

**Example**: If you have 93 unpushed commits:
- Commits per day: 93 ÷ 14 = 6 commits/day (with remainder)
- First 9 days: 7 commits each
- Last 5 days: 6 commits each
- Total: (9 × 7) + (5 × 6) = 63 + 30 = 93 ✅

## 🔧 Current Status

Based on head agent status, you have:
- **Uncommitted changes** in: dashboard (13), skills (9), habits (10), charts (8)
- These need to be **committed first** before they can be pushed

## 📝 Next Steps

1. **Commit uncommitted changes** (if any):
   ```bash
   # In each worktree with changes
   cd /Users/jacksonlafrance/Fixated-dashboard
   git add -A && git commit -m "Work in progress"
   # Repeat for other worktrees
   ```

2. **Check unpushed commits**:
   ```bash
   bash count_unpushed.sh
   ```

3. **Start daily pushing**:
   ```bash
   bash push_daily_batch.sh
   ```

4. **Repeat daily** for 14 days

## 💡 Important Notes

- Commits will show the **date you push them**, not when created
- The script automatically calculates how many to push each day
- Progress is saved in `.commit_batch_state.json`
- You can check status anytime with `count_unpushed.sh`

## 🎯 Goal

Distribute all commits over 2 weeks so your GitHub profile shows gradual, consistent activity instead of one big spike!

