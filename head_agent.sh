#!/bin/bash

HEAD_AGENT_DIR="/Users/jacksonlafrance/Fixated"
LOG_FILE="$HEAD_AGENT_DIR/.head_agent.log"
PID_FILE="$HEAD_AGENT_DIR/.head_agent.pid"
INTERVAL=30

start_head_agent() {
  if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null 2>&1; then
      echo "Head agent is already running (PID: $PID)"
      return 1
    fi
  fi
  
  echo "Starting head agent..."
  nohup bash -c "
    while true; do
      cd $HEAD_AGENT_DIR
      node head_agent.js >> $LOG_FILE 2>&1
      sleep $INTERVAL
    done
  " > /dev/null 2>&1 &
  
  echo $! > "$PID_FILE"
  echo "Head agent started (PID: $(cat $PID_FILE))"
  echo "Monitoring every ${INTERVAL}s"
  echo "Log: $LOG_FILE"
}

stop_head_agent() {
  if [ ! -f "$PID_FILE" ]; then
    echo "Head agent is not running"
    return 1
  fi
  
  PID=$(cat "$PID_FILE")
  if ps -p $PID > /dev/null 2>&1; then
    kill $PID
    rm "$PID_FILE"
    echo "Head agent stopped"
  else
    echo "Head agent process not found"
    rm "$PID_FILE"
  fi
}

status_head_agent() {
  if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null 2>&1; then
      echo "Head agent is running (PID: $PID)"
      echo "Last 10 log lines:"
      tail -10 "$LOG_FILE" 2>/dev/null || echo "No log file yet"
    else
      echo "Head agent is not running (stale PID file)"
    fi
  else
    echo "Head agent is not running"
  fi
}

case "$1" in
  start)
    start_head_agent
    ;;
  stop)
    stop_head_agent
    ;;
  status)
    status_head_agent
    ;;
  restart)
    stop_head_agent
    sleep 1
    start_head_agent
    ;;
  report)
    cd "$HEAD_AGENT_DIR" && node head_agent.js
    ;;
  *)
    echo "Usage: $0 {start|stop|status|restart|report}"
    exit 1
    ;;
esac

