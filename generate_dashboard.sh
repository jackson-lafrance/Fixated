#!/bin/bash

HEAD_AGENT_DIR="/Users/jacksonlafrance/Fixated"
DASHBOARD_FILE="$HEAD_AGENT_DIR/.head_agent_dashboard.html"

generate_dashboard() {
  cat > "$DASHBOARD_FILE" << 'HTML'
<!DOCTYPE html>
<html>
<head>
  <title>Head Agent Dashboard - Fixated</title>
  <meta http-equiv="refresh" content="10">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0d1117;
      color: #c9d1d9;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .header h1 { color: white; }
    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    .worktree-card {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 20px;
    }
    .worktree-card.active {
      border-color: #667eea;
    }
    .worktree-card.error {
      border-color: #f85149;
    }
    .worktree-name {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #667eea;
    }
    .status-item {
      margin: 8px 0;
      font-size: 14px;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }
    .badge.clean { background: #238636; color: white; }
    .badge.changes { background: #f85149; color: white; }
    .badge.warning { background: #d29922; color: white; }
    .timestamp {
      text-align: center;
      color: #8b949e;
      margin-top: 20px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🤖 Head Agent Dashboard</h1>
    <p>Monitoring all worktrees in real-time</p>
  </div>
  
  <div class="status-grid" id="statusGrid">
    Loading...
  </div>
  
  <div class="timestamp" id="timestamp"></div>
  
  <script>
    async function loadStatus() {
      try {
        const response = await fetch('/Users/jacksonlafrance/Fixated/.head_agent_status.json');
        const data = await response.json();
        
        const grid = document.getElementById('statusGrid');
        grid.innerHTML = '';
        
        data.worktrees.forEach(worktree => {
          const card = document.createElement('div');
          card.className = `worktree-card ${worktree.hasChanges ? 'active' : ''} ${worktree.error ? 'error' : ''}`;
          
          const badgeClass = worktree.error ? 'warning' : (worktree.hasChanges ? 'changes' : 'clean');
          const badgeText = worktree.error ? 'ERROR' : (worktree.hasChanges ? 'CHANGES' : 'CLEAN');
          
          card.innerHTML = `
            <div class="worktree-name">${worktree.name.toUpperCase()}</div>
            <div class="status-item">
              <span class="badge ${badgeClass}">${badgeText}</span>
            </div>
            <div class="status-item">Branch: ${worktree.branch || 'N/A'}</div>
            <div class="status-item">Uncommitted: ${worktree.uncommittedFiles || 0}</div>
            <div class="status-item" style="font-size: 12px; color: #8b949e; margin-top: 10px;">
              ${worktree.lastCommit || 'No commits'}
            </div>
            ${worktree.error ? `<div class="status-item" style="color: #f85149;">Error: ${worktree.error}</div>` : ''}
          `;
          
          grid.appendChild(card);
        });
        
        document.getElementById('timestamp').textContent = 
          `Last updated: ${new Date(data.timestamp).toLocaleString()}`;
      } catch (error) {
        document.getElementById('statusGrid').innerHTML = 
          '<div style="color: #f85149;">Error loading status. Run: node head_agent.js</div>';
      }
    }
    
    loadStatus();
    setInterval(loadStatus, 10000);
  </script>
</body>
</html>
HTML
  echo "Dashboard generated: $DASHBOARD_FILE"
  echo "Open in browser: open $DASHBOARD_FILE"
}

generate_dashboard

