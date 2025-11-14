#!/bin/bash

echo "╔════════════════════════════════════════════════════════╗"
echo "║        COMMITTING ALL UNCOMMITTED CHANGES            ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

cd /Users/jacksonlafrance/Fixated-dashboard
if [ -n "$(git status --porcelain)" ]; then
  echo "📁 dashboard: Committing changes..."
  git add -A
  git commit -m "feat: add dashboard widgets and components (DailyGoalsWidget, QuickStatsCards, RecentActivityFeed, StatsComparison)"
  echo "   ✅ Committed"
else
  echo "📁 dashboard: ✅ Already clean"
fi

cd /Users/jacksonlafrance/Fixated-skills
if [ -n "$(git status --porcelain)" ]; then
  echo "📁 skills: Committing changes..."
  git add -A
  git commit -m "feat: add skill editing modal and MySkillsView"
  echo "   ✅ Committed"
else
  echo "📁 skills: ✅ Already clean"
fi

cd /Users/jacksonlafrance/Fixated-habits
if [ -n "$(git status --porcelain)" ]; then
  echo "📁 habits: Committing changes..."
  git add -A
  git commit -m "feat: add navigation component and login/signup views"
  echo "   ✅ Committed"
else
  echo "📁 habits: ✅ Already clean"
fi

cd /Users/jacksonlafrance/Fixated-progress-charts
if [ -n "$(git status --porcelain)" ]; then
  echo "📁 charts: Committing changes..."
  git add -A
  git commit -m "feat: add new chart components (YesterdayComparisonChart, SkillSpecificChart, HabitCompletionChart, StreakChart) and HabitsContext"
  echo "   ✅ Committed"
else
  echo "📁 charts: ✅ Already clean"
fi

cd /Users/jacksonlafrance/Fixated
if [ -n "$(git status --porcelain)" ]; then
  echo "📁 main: Committing changes..."
  git add -A
  git commit -m "docs: add commit batching system documentation and scripts"
  echo "   ✅ Committed"
else
  echo "📁 main: ✅ Already clean"
fi

echo ""
echo "✅ All uncommitted changes have been committed!"
echo ""
echo "📊 Summary:"
cd /Users/jacksonlafrance/Fixated-dashboard && echo "   dashboard: $(git status --porcelain | wc -l | tr -d ' ') files"
cd /Users/jacksonlafrance/Fixated-skills && echo "   skills: $(git status --porcelain | wc -l | tr -d ' ') files"
cd /Users/jacksonlafrance/Fixated-habits && echo "   habits: $(git status --porcelain | wc -l | tr -d ' ') files"
cd /Users/jacksonlafrance/Fixated-progress-charts && echo "   charts: $(git status --porcelain | wc -l | tr -d ' ') files"
cd /Users/jacksonlafrance/Fixated && echo "   main: $(git status --porcelain | wc -l | tr -d ' ') files"

