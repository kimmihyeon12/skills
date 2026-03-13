#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// 임시 파일에서 명령 읽기
const tmpFile = process.argv[2];
if (!tmpFile) { process.exit(1); }

const command = fs.readFileSync(tmpFile, 'utf8').trim();
fs.unlinkSync(tmpFile); // 읽은 후 삭제

// claude CLI의 실제 cli.js 경로 찾기
const npmGlobal = path.join(process.env.APPDATA || path.join(require('os').homedir(), '.npm-global'), 'npm', 'node_modules', '@anthropic-ai', 'claude-code', 'cli.js');
const cliPath = fs.existsSync(npmGlobal) ? npmGlobal : 'claude';
const useShell = !fs.existsSync(npmGlobal);

const args = useShell
  ? ['-p', command, '--output-format', 'text', '--dangerously-skip-permissions']
  : [cliPath, '-p', command, '--output-format', 'text', '--dangerously-skip-permissions'];
const cmd = useShell ? 'claude' : process.execPath;

const proc = spawn(cmd, args, {
  cwd: process.cwd(),
  stdio: ['ignore', 'pipe', 'pipe'],
  env: process.env,
  shell: useShell,
});

proc.stdout.pipe(process.stdout);
proc.stderr.pipe(process.stderr);
proc.on('close', (code) => process.exit(code || 0));
proc.on('error', (err) => { console.error(err.message); process.exit(1); });
