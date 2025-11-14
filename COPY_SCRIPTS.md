# COPY SCRIPTS MANUALLY

Since the terminal is having issues, here's how to get the scripts working:

## The scripts exist here:
`/Users/jacksonlafrance/.cursor/worktrees/Fixated/ObabR/count_unpushed.sh`
`/Users/jacksonlafrance/.cursor/worktrees/Fixated/ObabR/push_daily_batch.sh`

## Copy them to your Fixated directory:

```bash
cp /Users/jacksonlafrance/.cursor/worktrees/Fixated/ObabR/count_unpushed.sh /Users/jacksonlafrance/Fixated/
cp /Users/jacksonlafrance/.cursor/worktrees/Fixated/ObabR/push_daily_batch.sh /Users/jacksonlafrance/Fixated/
chmod +x /Users/jacksonlafrance/Fixated/count_unpushed.sh
chmod +x /Users/jacksonlafrance/Fixated/push_daily_batch.sh
```

## Then use them:

```bash
cd /Users/jacksonlafrance/Fixated
bash count_unpushed.sh
bash push_daily_batch.sh
```

The scripts are definitely created - they're just in the ObabR worktree directory. Copy them over and they'll work!

