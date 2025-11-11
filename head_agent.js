#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const WORKTREES = [
  { name: 'auth', path: '/Users/jacksonlafrance/Fixated-auth-components', branch: 'feat-auth-components' },
  { name: 'dashboard', path: '/Users/jacksonlafrance/Fixated-dashboard', branch: 'feat-dashboard' },
  { name: 'skills', path: '/Users/jacksonlafrance/Fixated-skills', branch: 'feat-skills-library' },
  { name: 'habits', path: '/Users/jacksonlafrance/Fixated-habits', branch: 'feat-habits-tracking' },
  { name: 'charts', path: '/Users/jacksonlafrance/Fixated-progress-charts', branch: 'feat-progress-charts' },
  { name: 'daily-goals', path: '/Users/jacksonlafrance/Fixated-daily-goals', branch: 'feat-daily-goals' },
  { name: 'achievements', path: '/Users/jacksonlafrance/Fixated-achievements', branch: 'feat-achievements' },
  { name: 'notifications', path: '/Users/jacksonlafrance/Fixated-notifications', branch: 'feat-notifications' },
  { name: 'profile', path: '/Users/jacksonlafrance/Fixated-profile', branch: 'feat-profile' },
  { name: 'leaderboard', path: '/Users/jacksonlafrance/Fixated-leaderboard', branch: 'feat-leaderboard' }
];

const STATUS_FILE = '/Users/jacksonlafrance/Fixated/.head_agent_status.json';

function getWorktreeStatus(worktree) {
  try {
    const gitStatus = execSync(`cd ${worktree.path} && git status --porcelain`, { encoding: 'utf-8' });
    const lastCommit = execSync(`cd ${worktree.path} && git log -1 --oneline`, { encoding: 'utf-8' }).trim();
    const branch = execSync(`cd ${worktree.path} && git branch --show-current`, { encoding: 'utf-8' }).trim();
    const uncommittedFiles = gitStatus.split('\n').filter(line => line.trim()).length;
    
    return {
      name: worktree.name,
      path: worktree.path,
      branch: branch,
      lastCommit: lastCommit,
      uncommittedFiles: uncommittedFiles,
      hasChanges: uncommittedFiles > 0,
      status: gitStatus.trim() || 'clean'
    };
  } catch (error) {
    return {
      name: worktree.name,
      path: worktree.path,
      error: error.message,
      status: 'error'
    };
  }
}

function getAllStatuses() {
  return WORKTREES.map(getWorktreeStatus);
}

function saveStatus(statuses) {
  const data = {
    timestamp: new Date().toISOString(),
    worktrees: statuses
  };
  fs.writeFileSync(STATUS_FILE, JSON.stringify(data, null, 2));
}

function generateReport() {
  const statuses = getAllStatuses();
  
  console.log('\n=== HEAD AGENT STATUS REPORT ===\n');
  console.log(`Generated: ${new Date().toLocaleString()}\n`);
  
  statuses.forEach(status => {
    console.log(`📁 ${status.name.toUpperCase()}`);
    console.log(`   Branch: ${status.branch || 'N/A'}`);
    console.log(`   Last Commit: ${status.lastCommit || 'N/A'}`);
    console.log(`   Uncommitted Files: ${status.uncommittedFiles || 0}`);
    console.log(`   Status: ${status.hasChanges ? '⚠️  HAS CHANGES' : '✅ Clean'}`);
    if (status.error) {
      console.log(`   ❌ Error: ${status.error}`);
    }
    console.log('');
  });
  
  const totalChanges = statuses.reduce((sum, s) => sum + (s.uncommittedFiles || 0), 0);
  const activeWorktrees = statuses.filter(s => s.hasChanges).length;
  
  console.log(`📊 Summary:`);
  console.log(`   Active Worktrees: ${activeWorktrees}/${WORKTREES.length}`);
  console.log(`   Total Uncommitted Changes: ${totalChanges}\n`);
  
  saveStatus(statuses);
  
  return { statuses, totalChanges, activeWorktrees };
}

if (require.main === module) {
  generateReport();
}

module.exports = { getAllStatuses, generateReport };
