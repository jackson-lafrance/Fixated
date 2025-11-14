#!/bin/bash

cd /Users/jacksonlafrance/Fixated

echo "╔════════════════════════════════════════════════════════╗"
echo "║           COMMIT STATISTICS                          ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

TOTAL=$(git log --all --oneline 2>/dev/null | wc -l | tr -d ' ')
echo "📊 Total commits across all branches: $TOTAL"
echo ""
echo "📈 Commits per branch:"
git branch -r | grep "origin/" | grep -E "(feat-|main)" | while read branch; do
  name=$(echo "$branch" | sed 's/origin\///')
  count=$(git log "$branch" --oneline 2>/dev/null | wc -l | tr -d ' ')
  echo "   $name: $count commits"
done

echo ""
DAILY_LIMIT=10
DAYS=14
TOTAL_ALLOWED=$((DAILY_LIMIT * DAYS))
echo "📅 Distribution Plan:"
echo "   Commits per day: $DAILY_LIMIT"
echo "   Days: $DAYS"
echo "   Total allowed: $TOTAL_ALLOWED commits"
echo ""

if [ "$TOTAL" -gt "$TOTAL_ALLOWED" ]; then
  echo "⚠️  More commits than planned ($TOTAL > $TOTAL_ALLOWED)"
  echo "   Will need to batch carefully"
else
  echo "✅ Within planned distribution"
fi

echo ""
echo "💡 To push commits gradually:"
echo "   Run: ./push_daily_batch.sh"
echo "   This will push up to 10 commits per day"

