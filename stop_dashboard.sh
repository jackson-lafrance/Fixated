#!/bin/bash
cd /Users/jacksonlafrance/Fixated
if lsof -ti:8080 > /dev/null 2>&1; then
  echo "Stopping dashboard server..."
  lsof -ti:8080 | xargs kill
  echo "✅ Dashboard server stopped"
else
  echo "⚠️  No server running on port 8080"
fi
