#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const http = require('http');
const { spawn } = require('child_process');
const os = require('os');

// 설정 파일 로드
const CONFIG_PATH = path.join(__dirname, '..', 'config.json');
let config = {};
try { config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')); } catch {
  console.error('[Bot] config.json not found. Run setup first.');
  process.exit(1);
}

const BOT_TOKEN = config.botToken;
const CHANNEL_ID = config.channelId;
const HTTP_PORT = config.httpPort || 47391;

if (!BOT_TOKEN || !CHANNEL_ID) {
  console.error('[Bot] botToken and channelId are required in config.json');
  process.exit(1);
}

const PROJECTS = config.projects || {};
const DEFAULT_PROJECT = config.defaultProject || '';
const CLAUDE_PATH = config.claudePath || 'claude';

const pendingRequests = new Map();
const pendingCommands = new Map(); // 프로젝트 선택 대기 중인 명령
const runningTasks = new Map(); // 실행 중인 claude 프로세스 관리
let targetChannel = null;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('ready', async () => {
  console.log(`[Bot] ${client.user.tag} online`);
  try {
    targetChannel = await client.channels.fetch(CHANNEL_ID);
    console.log(`[Bot] Channel: #${targetChannel.name}`);
  } catch (err) {
    console.error(`[Bot] Channel fetch failed:`, err.message);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const customId = interaction.customId;

  // 프로젝트 선택 버튼 처리
  if (customId.startsWith('project:')) {
    const [, projectName, cmdId] = customId.split(':');
    const pending = pendingCommands.get(cmdId);
    if (!pending) {
      await interaction.reply({ content: '이미 처리된 요청입니다.', ephemeral: true });
      return;
    }
    pendingCommands.delete(cmdId);
    pending.resolve(projectName);

    const embed = EmbedBuilder.from(interaction.message.embeds[0])
      .setColor(0x3498DB)
      .setFooter({ text: `\u{1F4C1} ${projectName} 선택됨` });
    try {
      await interaction.update({ embeds: [embed], components: [] });
    } catch {
      try { await interaction.deferUpdate(); } catch {}
    }
    return;
  }

  // 권한 승인/거부 버튼 처리
  const [action, requestId] = customId.split(':');
  const pending = pendingRequests.get(requestId);

  if (!pending) {
    await interaction.reply({ content: '이미 처리된 요청입니다.', ephemeral: true });
    return;
  }

  pending.resolve(action === 'allow' ? 'allow' : 'deny');
  pendingRequests.delete(requestId);

  const isAllow = action === 'allow';

  try {
    const embed = EmbedBuilder.from(interaction.message.embeds[0])
      .setColor(isAllow ? 0x2ECC71 : 0xE74C3C)
      .setFooter({ text: isAllow ? '\u2705 승인됨' : '\u274C 거부됨' });

    await interaction.update({ embeds: [embed], components: [] });
  } catch {
    try { await interaction.deferUpdate(); } catch {}
  }
});

// 디스코드 메시지로 Claude Code 명령 실행
client.on('messageCreate', async (msg) => {
  // 봇 자신의 메시지 무시, 지정된 채널만 처리
  if (msg.author.bot) return;
  if (msg.channel.id !== CHANNEL_ID) return;

  const content = msg.content.trim();

  // !cancel - 실행 중인 작업 취소
  if (content === '!cancel') {
    const task = runningTasks.get(msg.channel.id);
    if (task) {
      task.process.kill();
      runningTasks.delete(msg.channel.id);
      await msg.reply({ embeds: [new EmbedBuilder().setTitle('\u{274C} 작업 취소됨').setColor(0xE74C3C)] });
    } else {
      await msg.reply({ embeds: [new EmbedBuilder().setTitle('\u{2139}\uFE0F 실행 중인 작업이 없습니다').setColor(0x95A5A6)] });
    }
    return;
  }

  // !projects - 등록된 프로젝트 목록
  if (content === '!projects') {
    const list = Object.entries(PROJECTS).map(([name, p]) => `• **${name}**: \`${p}\``).join('\n') || '등록된 프로젝트 없음';
    await msg.reply({ embeds: [new EmbedBuilder().setTitle('\u{1F4C2} 프로젝트 목록').setDescription(list).setColor(0x3498DB)] });
    return;
  }

  // !run [project:] <명령> - Claude Code 실행
  if (!content.startsWith('!run ')) return;

  // 이미 실행 중인 작업 확인
  if (runningTasks.has(msg.channel.id)) {
    await msg.reply({ embeds: [new EmbedBuilder().setTitle('\u{26A0}\uFE0F 이미 작업이 실행 중입니다').setDescription('!cancel로 취소하거나 완료를 기다려주세요').setColor(0xF39C12)] });
    return;
  }

  let command = content.slice(5).trim();
  let projectDir = null;
  let selectedProjectName = null;

  // project: 접두사 파싱
  const projectMatch = command.match(/^(\S+):\s*([\s\S]+)$/);
  if (projectMatch && PROJECTS[projectMatch[1]]) {
    selectedProjectName = projectMatch[1];
    projectDir = PROJECTS[selectedProjectName];
    command = projectMatch[2].trim();
  }

  if (!command) {
    await msg.reply({ embeds: [new EmbedBuilder().setTitle('\u{2753} 사용법').setDescription('`!run <명령>`\n`!run project명: <명령>`\n`!cancel` - 작업 취소\n`!projects` - 프로젝트 목록').setColor(0x3498DB)] });
    return;
  }

  const projectNames = Object.keys(PROJECTS);

  // 프로젝트 미지정 + 여러 개 → 버튼으로 선택
  if (!projectDir && projectNames.length > 1) {
    const cmdId = Date.now().toString(36);
    const selectEmbed = new EmbedBuilder()
      .setTitle('\u{1F4C2} 프로젝트 선택')
      .setDescription('```\n' + command.slice(0, 500) + '\n```')
      .setColor(0x3498DB)
      .setTimestamp();

    const row = new ActionRowBuilder();
    for (const name of projectNames) {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`project:${name}:${cmdId}`)
          .setLabel(name)
          .setStyle(name === DEFAULT_PROJECT ? ButtonStyle.Primary : ButtonStyle.Secondary),
      );
    }

    await msg.reply({ embeds: [selectEmbed], components: [row] });

    // 30초 대기
    selectedProjectName = await new Promise((resolve) => {
      pendingCommands.set(cmdId, { resolve });
      setTimeout(() => {
        if (pendingCommands.has(cmdId)) {
          pendingCommands.delete(cmdId);
          resolve(null);
        }
      }, 30000);
    });

    if (!selectedProjectName) return; // 타임아웃
    projectDir = PROJECTS[selectedProjectName];
  }

  // 프로젝트 1개이거나 기본 프로젝트 사용
  if (!projectDir) {
    selectedProjectName = DEFAULT_PROJECT || projectNames[0];
    projectDir = PROJECTS[selectedProjectName] || process.cwd();
  }

  const startEmbed = new EmbedBuilder()
    .setTitle('\u{1F680} Claude Code 실행 중...')
    .setColor(0x3498DB)
    .addFields(
      { name: '\u{1F4C1} 프로젝트', value: selectedProjectName || path.basename(projectDir), inline: true },
      { name: '\u{1F4DD} 명령', value: '```\n' + command.slice(0, 500) + '\n```' },
    )
    .setTimestamp();

  const statusMsg = await msg.reply({ embeds: [startEmbed] });

  // claude CLI 실행 (Claude 관련 환경변수 모두 제거 - 중첩 세션 방지)
  const cleanEnv = { ...process.env };
  for (const key of Object.keys(cleanEnv)) {
    if (key.startsWith('CLAUDE')) delete cleanEnv[key];
  }
  // 한글 명령어를 임시 파일에 저장해서 전달 (shell 인코딩 문제 방지)
  const tmpFile = path.join(os.tmpdir(), `claude-cmd-${Date.now()}.txt`);
  fs.writeFileSync(tmpFile, command, 'utf8');
  const proc = spawn(process.execPath, [
    path.join(__dirname, 'run-claude.js'),
    tmpFile,
  ], {
    cwd: projectDir,
    env: cleanEnv,
    timeout: 600000,
  });

  runningTasks.set(msg.channel.id, { process: proc, statusMsg });

  let output = '';
  let lastUpdate = 0;
  const UPDATE_INTERVAL = 5000; // 5초마다 업데이트

  const updateProgress = async () => {
    const now = Date.now();
    if (now - lastUpdate < UPDATE_INTERVAL) return;
    lastUpdate = now;

    const preview = output.trim().slice(-1500) || '(대기 중...)';
    const progressEmbed = new EmbedBuilder()
      .setTitle('\u{1F680} Claude Code 실행 중...')
      .setColor(0x3498DB)
      .addFields(
        { name: '\u{1F4C1} 프로젝트', value: selectedProjectName || path.basename(projectDir), inline: true },
        { name: '\u{1F4DD} 명령', value: '```\n' + command.slice(0, 200) + '\n```' },
      )
      .setDescription('```\n' + preview + '\n```')
      .setTimestamp()
      .setFooter({ text: '\u{23F3} 진행 중...' });

    try { await statusMsg.edit({ embeds: [progressEmbed] }); } catch {}
  };

  proc.stdout.on('data', (data) => { output += data.toString(); updateProgress(); });
  proc.stderr.on('data', (data) => { output += data.toString(); updateProgress(); });

  proc.on('close', async (code) => {
    runningTasks.delete(msg.channel.id);

    // 출력이 길면 자르기 (디스코드 제한 4096자)
    const maxLen = 3800;
    let result = output.trim() || '(출력 없음)';
    if (result.length > maxLen) {
      result = result.slice(0, maxLen) + '\n... (생략됨)';
    }

    const color = code === 0 ? 0x2ECC71 : 0xE74C3C;
    const emoji = code === 0 ? '\u2705' : '\u274C';

    const doneEmbed = new EmbedBuilder()
      .setTitle(`${emoji} 작업 완료`)
      .setColor(color)
      .addFields(
        { name: '\u{1F4C1} 프로젝트', value: path.basename(projectDir), inline: true },
        { name: '\u{1F4DD} 명령', value: '```\n' + command.slice(0, 200) + '\n```' },
      )
      .setDescription('```\n' + result + '\n```')
      .setTimestamp()
      .setFooter({ text: `종료 코드: ${code}` });

    try {
      await statusMsg.edit({ embeds: [doneEmbed] });
    } catch {
      await msg.channel.send({ embeds: [doneEmbed] });
    }
  });

  proc.on('error', async (err) => {
    runningTasks.delete(msg.channel.id);
    const errEmbed = new EmbedBuilder()
      .setTitle('\u{274C} 실행 오류')
      .setDescription('```\n' + err.message + '\n```')
      .setColor(0xE74C3C)
      .setTimestamp();
    try {
      await statusMsg.edit({ embeds: [errEmbed] });
    } catch {
      await msg.channel.send({ embeds: [errEmbed] });
    }
  });
});

// HTTP Server
const server = http.createServer(async (req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405);
    res.end();
    return;
  }

  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', async () => {
    try {
      const data = JSON.parse(Buffer.concat(chunks).toString());
      const { type, requestId, title, message, toolName } = data;

      const channel = targetChannel;
      if (!channel) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'no channel' }));
        return;
      }

      // 알림 (Stop, Notification)
      if (type === 'notify') {
        const emoji = data.mode === 'notification' ? '\u{1F514}' : '\u2705';
        const color = data.mode === 'notification' ? 0x3498DB : 0x2ECC71;

        const embed = new EmbedBuilder()
          .setTitle(`${emoji} ${title}`)
          .setDescription(message || '')
          .setColor(color)
          .setTimestamp()
          .setFooter({ text: `Claude Code` });

        await channel.send({ embeds: [embed] });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
        return;
      }

      // 권한 요청 (PermissionRequest) - 버튼 포함
      if (type === 'permission') {
        const embed = new EmbedBuilder()
          .setTitle('\u{1F6A8} 권한 요청')
          .setColor(0xFF6B35)
          .addFields(
            { name: '\u{1F4C1} 프로젝트', value: title || 'Claude Code', inline: true },
            { name: '\u{1F527} 도구', value: toolName || '알 수 없음', inline: true },
            { name: '\u{1F4DD} 상세', value: '```\n' + (message || '').slice(0, 900) + '\n```' },
          )
          .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`allow:${requestId}`)
            .setLabel('\u2705 승인')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId(`deny:${requestId}`)
            .setLabel('\u274C 거부')
            .setStyle(ButtonStyle.Danger),
        );

        const sentMsg = await channel.send({ embeds: [embed], components: [row] });

        // CLI에서 직접 승인/거부 시 소켓이 끊김 → 버튼 제거
        let clientDisconnected = false;
        const cleanupOnDisconnect = () => {
          if (pendingRequests.has(requestId)) {
            clientDisconnected = true;
            pendingRequests.delete(requestId);
            const closedEmbed = EmbedBuilder.from(embed)
              .setColor(0x95A5A6)
              .setFooter({ text: '\u{1F5A5}\uFE0F CLI에서 처리됨' });
            sentMsg.edit({ embeds: [closedEmbed], components: [] }).catch(() => {});
          }
        };
        req.on('close', cleanupOnDisconnect);
        req.on('aborted', cleanupOnDisconnect);
        req.socket?.on('close', cleanupOnDisconnect);

        const decision = await new Promise((resolve) => {
          pendingRequests.set(requestId, { resolve });
          setTimeout(() => {
            if (pendingRequests.has(requestId)) {
              pendingRequests.delete(requestId);
              resolve('timeout');
            }
          }, 120000);
        });

        // 타임아웃된 경우 버튼 제거
        if (decision === 'timeout') {
          try {
            const expiredEmbed = EmbedBuilder.from(embed)
              .setColor(0x95A5A6)
              .setFooter({ text: '\u23F0 시간 초과' });
            await sentMsg.edit({ embeds: [expiredEmbed], components: [] });
          } catch {}
        }

        if (clientDisconnected) return;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ decision }));
        return;
      }

      res.writeHead(400);
      res.end();
    } catch (err) {
      console.error('[Bot] Error:', err.message);
      res.writeHead(500);
      res.end();
    }
  });
});

server.listen(HTTP_PORT, '127.0.0.1', () => {
  console.log(`[Bot] HTTP server on port ${HTTP_PORT}`);
});

client.login(BOT_TOKEN);

process.on('SIGINT', () => {
  client.destroy();
  server.close();
  process.exit(0);
});
