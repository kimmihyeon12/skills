#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');

// 설정 파일 로드
const CONFIG_PATH = path.join(__dirname, '..', 'config.json');
let config = {};
try { config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')); } catch {}

const MODE = { NOTIFICATION: 'notification', PERMISSION: 'permission' };
const mode = process.argv[2] || 'stop';
const BOT_PORT = config.httpPort || 47391;

const truncate = (str, max) => str.length > max ? str.slice(0, max) + '...' : str;

function sendToBot(data) {
  return new Promise((resolve) => {
    const body = JSON.stringify(data);
    const req = http.request({
      hostname: '127.0.0.1',
      port: BOT_PORT,
      path: '/',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: 130000,
    }, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
        catch { resolve({}); }
      });
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.write(body);
    req.end();
  });
}

function permissionMessage(toolName, toolInput) {
  if (toolName === 'AskUserQuestion' && toolInput.questions?.[0]) {
    return truncate(toolInput.questions[0].question, 150);
  }
  const detail = toolInput.command || toolInput.path || truncate(JSON.stringify(toolInput), 100);
  return `${toolName}: ${detail}`;
}

const stdinChunks = [];
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => stdinChunks.push(chunk));
process.stdin.on('end', async () => {
  let payload = {};
  try { payload = JSON.parse(stdinChunks.join('').trim()); } catch {}

  const title = payload.cwd ? path.basename(payload.cwd) : 'Claude Code';

  if (mode === MODE.PERMISSION) {
    const toolName = payload.tool_name || '도구';
    const toolInput = payload.tool_input || {};
    const message = permissionMessage(toolName, toolInput);
    const requestId = crypto.randomUUID();

    const result = await sendToBot({
      type: 'permission',
      requestId,
      title,
      message,
      toolName,
      mode,
    });

    if (result && result.decision === 'allow') {
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PermissionRequest',
          decision: { behavior: 'allow' },
        },
      }));
    } else if (result && result.decision === 'deny') {
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PermissionRequest',
          decision: { behavior: 'deny', message: 'Discord에서 거부됨' },
        },
      }));
    }
    // timeout → 아무것도 출력하지 않음 → 기본 권한 다이얼로그 표시

  } else if (mode === MODE.NOTIFICATION) {
    sendToBot({ type: 'notify', title, message: payload.message || '확인이 필요합니다', mode });
  } else {
    const lastMsg = payload.last_assistant_message || '';
    const msg = lastMsg ? truncate(lastMsg, 300) : '작업이 완료됐습니다.';
    sendToBot({ type: 'notify', title, message: msg, mode });
  }
});
