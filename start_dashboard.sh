#!/bin/bash

cd /Users/jacksonlafrance/Fixated

echo "🚀 Starting Head Agent Dashboard Server..."
echo ""

if lsof -ti:8080 > /dev/null 2>&1; then
  echo "⚠️  Port 8080 is already in use"
  echo "   Stopping existing server..."
  lsof -ti:8080 | xargs kill 2>/dev/null
  sleep 1
fi

node dashboard_server.js &
SERVER_PID=$!

sleep 2

if ps -p $SERVER_PID > /dev/null 2>&1; then
  echo "✅ Dashboard server started (PID: $SERVER_PID)"
  echo "📊 Dashboard: http://localhost:8080"
  echo "📈 Status API: http://localhost:8080/status.json"
  echo ""
  echo "💡 The dashboard should open automatically in your browser"
  echo "💡 To stop: ./stop_dashboard.sh or kill $SERVER_PID"
else
  echo "❌ Failed to start server"
fi

