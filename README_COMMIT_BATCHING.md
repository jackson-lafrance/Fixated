# QUICK START - COMMIT BATCHING

## Ready to Use!

All scripts are created and ready. Here's what to do:

### 1. Check Unpushed Commits
```bash
cd /Users/jacksonlafrance/Fixated
bash count_unpushed.sh
```

### 2. Push Daily Batch (when ready)
```bash
bash push_daily_batch.sh
```

### 3. Repeat Daily for 14 Days

That's it! The system will:
- ✅ Calculate commits per day automatically
- ✅ Set commit dates to today
- ✅ Track progress
- ✅ Distribute over 2 weeks

## Current Status

You have uncommitted changes in:
- dashboard: 13 files
- skills: 9 files  
- habits: 10 files
- charts: 8 files

**These need to be committed first** before they can be pushed in batches.

## Quick Commands

```bash
# Check unpushed commits
bash count_unpushed.sh

# Push today's batch
bash push_daily_batch.sh

# Check sync status
./check_sync_status.sh
```

All commits will show the date you push them on GitHub! 🎉

