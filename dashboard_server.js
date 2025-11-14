#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = 8080;
const DASHBOARD_DIR = '/Users/jacksonlafrance/Fixated';

const server = http.createServer((req, res) => {
  let filePath = path.join(DASHBOARD_DIR, req.url === '/' ? '.head_agent_dashboard.html' : req.url);
  
  if (req.url === '/status.json' || req.url === '/.head_agent_status.json') {
    execSync(`cd ${DASHBOARD_DIR} && node head_agent.js`, { stdio: 'ignore' });
    filePath = path.join(DASHBOARD_DIR, '.head_agent_status.json');
  }
  
  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
  };
  
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Head Agent Dashboard Server running at http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`📈 Status API: http://localhost:${PORT}/status.json`);
  console.log(`\nPress Ctrl+C to stop the server\n`);
  
  const { exec } = require('child_process');
  exec(`open http://localhost:${PORT}`);
});

