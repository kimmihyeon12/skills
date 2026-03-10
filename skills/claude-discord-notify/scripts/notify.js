#!/usr/bin/env node
/**
 * claude-discord-notify — Claude Code hook → Discord webhook
 *
 * Usage:
 *   node notify.js stop          # Stop hook: reads stdin JSON, sends 작업 완료
 *   node notify.js notification  # Notification hook: sends 확인 필요
 *
 * Config: ~/.claude/skills/claude-discord-notify/config.json
 *   { "webhookUrl": "https://discord.com/api/webhooks/..." }
 */

const https = require('https');
const path = require('path');
const fs = require('fs');
const url = require('url');

// ── Config ──────────────────────────────────────────────────────────────────

const configPath = path.join(
  process.env.HOME || process.env.USERPROFILE,
  '.claude', 'skills', 'claude-discord-notify', 'config.json'
);

let webhookUrl;
try {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  webhookUrl = config.webhookUrl;
} catch {
  process.exit(0); // config 없으면 조용히 종료
}

if (!webhookUrl) process.exit(0);

// ── Helpers ──────────────────────────────────────────────────────────────────

function sendEmbed(embed, done) {
  const body = JSON.stringify({ embeds: [embed] });
  const parsed = new url.URL(webhookUrl);
  const req = https.request(
    {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    },
    (res) => {
      res.resume(); // drain response body
      res.on('end', () => done && done());
    }
  );
  req.on('error', () => done && done());
  req.write(body);
  req.end();
}

// ── Mode ──────────────────────────────────────────────────────────────────────

const mode = process.argv[2] || 'stop';

if (mode === 'notification') {
  const projectName = path.basename(process.cwd());
  const agentName = process.env.CLAUDE_MODEL || 'Claude Sonnet 4.6';
  sendEmbed(
    {
      title: projectName,
      color: 16776960, // 노란색
      description: '확인이 필요합니다',
      footer: { text: agentName },
    },
    () => process.exit(0)
  );
  return; // Stop 모드로 넘어가지 않도록
}

// Stop mode — stdin에서 훅 페이로드 읽기
let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { raw += chunk; });
process.stdin.on('end', () => {
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  // 실제 페이로드 구조: last_assistant_message, cwd 직접 제공
  const raw_msg = payload.last_assistant_message || '';
  const summary = raw_msg.length > 300 ? raw_msg.slice(0, 300) + '...' : raw_msg || '(없음)';
  const projectName = payload.cwd ? path.basename(payload.cwd) : path.basename(process.cwd());
  const agentName = process.env.CLAUDE_MODEL || 'Claude Sonnet 4.6';

  sendEmbed(
    {
      title: projectName,
      color: 5763719, // 초록색
      description: summary,
      footer: { text: agentName },
    },
    () => process.exit(0)
  );
});
