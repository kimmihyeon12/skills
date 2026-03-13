#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const CONFIG_PATH = path.join(__dirname, '..', 'config.json');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((r) => rl.question(q, r));

(async () => {
  console.log('\n=== Claude Discord Hook 초기 설정 ===\n');

  // 기존 config 로드
  let existing = {};
  try { existing = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')); } catch {}

  const botToken = (await ask(`Discord Bot Token [${existing.botToken ? '기존값 유지' : '없음'}]: `)).trim() || existing.botToken || '';
  const channelId = (await ask(`Discord Channel ID [${existing.channelId ? '기존값 유지' : '없음'}]: `)).trim() || existing.channelId || '';
  const httpPort = parseInt((await ask(`HTTP Port [${existing.httpPort || 47391}]: `)).trim()) || existing.httpPort || 47391;
  const claudePath = (await ask(`Claude CLI 경로 [${existing.claudePath || 'claude'}]: `)).trim() || existing.claudePath || 'claude';

  // 프로젝트 설정
  const projects = existing.projects || {};
  console.log('\n--- 프로젝트 등록 (빈 입력으로 종료) ---');
  if (Object.keys(projects).length > 0) {
    console.log('기존 프로젝트:', Object.entries(projects).map(([k, v]) => `${k}=${v}`).join(', '));
  }

  while (true) {
    const name = (await ask('프로젝트 이름 (빈 입력=종료): ')).trim();
    if (!name) break;
    const dir = (await ask(`  ${name} 경로: `)).trim();
    if (dir) projects[name] = dir;
  }

  const projectNames = Object.keys(projects);
  let defaultProject = existing.defaultProject || '';
  if (projectNames.length > 0) {
    const dp = (await ask(`기본 프로젝트 [${defaultProject || projectNames[0]}]: `)).trim();
    defaultProject = dp || defaultProject || projectNames[0];
  }

  const config = { botToken, channelId, httpPort, projects, defaultProject, claudePath };
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + '\n');
  console.log(`\n✅ config.json 저장됨: ${CONFIG_PATH}`);

  if (!botToken || !channelId) {
    console.log('\n⚠️  botToken과 channelId는 필수입니다. config.json을 직접 수정하세요.');
  }

  // npm install
  console.log('\n📦 의존성 설치 중...');
  const { execSync } = require('child_process');
  try {
    execSync('npm install', { cwd: __dirname, stdio: 'inherit' });
    console.log('✅ 설치 완료');
  } catch {
    console.log('⚠️  npm install 실패. 수동으로 실행하세요: cd scripts && npm install');
  }

  console.log('\n🚀 Bot 실행: node scripts/bot.js');
  console.log('📖 자세한 설정은 SKILL.md를 참고하세요.\n');

  rl.close();
})();
