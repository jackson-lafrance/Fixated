#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

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
    if (!fs.existsSync(worktree.path)) {
      return {
        name: worktree.name,
        path: worktree.path,
        status: 'not_found',
        error: 'Worktree directory does not exist'
      };
    }

    const gitStatus = execSync(`cd ${worktree.path} && git status --porcelain`, { encoding: 'utf-8' });
    const lastCommit = execSync(`cd ${worktree.path} && git log -1 --oneline`, { encoding: 'utf-8' }).trim();
    const branch = execSync(`cd ${worktree.path} && git branch --show-current`, { encoding: 'utf-8' }).trim();
    const uncommittedFiles = gitStatus.split('\n').filter(line => line.trim()).length;
    
    const untracked = gitStatus.split('\n').filter(line => line.startsWith('??')).length;
    const modified = gitStatus.split('\n').filter(line => line.startsWith(' M') || line.startsWith('M ')).length;
    
    return {
      name: worktree.name,
      path: worktree.path,
      branch: branch,
      lastCommit: lastCommit,
      uncommittedFiles: uncommittedFiles,
      untrackedFiles: untracked,
      modifiedFiles: modified,
      hasChanges: uncommittedFiles > 0,
      status: gitStatus.trim() || 'clean',
      needsCommit: uncommittedFiles > 0,
      needsCleanup: untracked > 0
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
    worktrees: statuses,
    summary: {
      total: statuses.length,
      active: statuses.filter(s => s.hasChanges).length,
      needsCommit: statuses.filter(s => s.needsCommit).length,
      needsCleanup: statuses.filter(s => s.needsCleanup).length,
      errors: statuses.filter(s => s.error).length
    }
  };
  fs.writeFileSync(STATUS_FILE, JSON.stringify(data, null, 2));
}

function generateReport() {
  const statuses = getAllStatuses();
  
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║        HEAD AGENT COMPREHENSIVE STATUS REPORT         ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  console.log(`Generated: ${new Date().toLocaleString()}\n`);
  
  const activeWorktrees = statuses.filter(s => s.hasChanges && !s.error);
  const completedWorktrees = statuses.filter(s => !s.hasChanges && !s.error && s.status !== 'not_found');
  const errorWorktrees = statuses.filter(s => s.error);
  
  console.log('📊 SUMMARY');
  console.log(`   Total Worktrees: ${statuses.length}`);
  console.log(`   Active: ${activeWorktrees.length}`);
  console.log(`   Completed/Clean: ${completedWorktrees.length}`);
  console.log(`   Errors: ${errorWorktrees.length}`);
  console.log(`   Needs Commit: ${statuses.filter(s => s.needsCommit).length}`);
  console.log(`   Needs Cleanup: ${statuses.filter(s => s.needsCleanup).length}\n`);
  
  if (activeWorktrees.length > 0) {
    console.log('🔄 ACTIVE WORKTREES (Have Uncommitted Changes)\n');
    activeWorktrees.forEach(status => {
      const icon = status.needsCommit ? '📝' : '📁';
      console.log(`${icon} ${status.name.toUpperCase().padEnd(15)} [${status.branch}]`);
      console.log(`   Files: ${status.uncommittedFiles} (${status.modifiedFiles} modified, ${status.untrackedFiles} untracked)`);
      console.log(`   Last: ${status.lastCommit.substring(0, 50)}`);
      if (status.needsCleanup) {
        console.log(`   ⚠️  Has untracked files - needs cleanup`);
      }
      console.log('');
    });
  }
  
  if (completedWorktrees.length > 0) {
    console.log('✅ COMPLETED WORKTREES (Clean, Ready for New Work)\n');
    completedWorktrees.forEach(status => {
      console.log(`✅ ${status.name.toUpperCase().padEnd(15)} [${status.branch}]`);
      console.log(`   Last: ${status.lastCommit.substring(0, 50)}`);
      console.log('');
    });
  }
  
  if (errorWorktrees.length > 0) {
    console.log('❌ ERROR WORKTREES\n');
    errorWorktrees.forEach(status => {
      console.log(`❌ ${status.name.toUpperCase().padEnd(15)}`);
      console.log(`   Error: ${status.error}`);
      console.log('');
    });
  }
  
  const totalChanges = statuses.reduce((sum, s) => sum + (s.uncommittedFiles || 0), 0);
  console.log(`\n📈 TOTAL UNCOMMITTED CHANGES: ${totalChanges}`);
  
  saveStatus(statuses);
  
  return { statuses, activeWorktrees, completedWorktrees, errorWorktrees };
}

if (require.main === module) {
  generateReport();
}

module.exports = { getAllStatuses, generateReport };
