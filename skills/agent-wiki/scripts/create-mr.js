#!/usr/bin/env node
/**
 * create-mr.js
 *
 * ~/.config/agent-wiki/credentials에서 인증 정보를 읽어
 * GitHub PR 또는 GitLab MR을 생성한다.
 *
 * Usage:
 *   node create-mr.js --skill-name <name> --source-branch <branch> --title <title> [--description <desc>] [--target-branch <branch>]
 *
 * 예시:
 *   node create-mr.js \
 *     --skill-name all-in-one-personal-wiki \
 *     --source-branch contrib/all-in-one-personal-wiki-fix-login \
 *     --title "[all-in-one-personal-wiki] 로그인 버그 수정" \
 *     --description "US-001 추가"
 */

const fs = require("fs");
const path = require("path");

// ─── CLI 인자 파싱 ───

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true;
      args[key] = val;
    }
  }
  return args;
}

const args = parseArgs(process.argv);

if (!args["skill-name"] || !args["source-branch"] || !args["title"]) {
  console.error("Usage: node create-mr.js --skill-name <name> --source-branch <branch> --title <title> [--description <desc>] [--target-branch <branch>]");
  process.exit(1);
}

const skillName = args["skill-name"];
const sourceBranch = args["source-branch"];
const targetBranch = args["target-branch"] || "master";
const title = args["title"];
const description = args["description"] || "";

// ─── Credentials 파싱 ───

function getCredentialsPath() {
  const home = process.env.HOME || process.env.USERPROFILE;
  return path.join(home, ".config", "agent-wiki", "credentials");
}

function parseCredentials(content, skillName) {
  const lines = content.split("\n");
  let currentSection = null;
  let result = null;
  let platform = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // 섹션 헤더: [platform.skill-name]
    const sectionMatch = trimmed.match(/^\[(\w+)\.(.+)\]$/);
    if (sectionMatch) {
      if (result) break; // 이미 찾았으면 종료
      const [, p, name] = sectionMatch;
      if (name === skillName) {
        platform = p;
        currentSection = name;
        result = {};
      } else {
        currentSection = null;
      }
      continue;
    }

    // 키-값 쌍
    if (currentSection && trimmed && !trimmed.startsWith("#")) {
      const kvMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
      if (kvMatch) {
        result[kvMatch[1]] = kvMatch[2].trim();
      }
    }
  }

  if (!result || !platform) return null;
  return { platform, ...result };
}

// ─── API 호출 ───

async function createGitHubPR(creds) {
  const repo = creds.repo;
  const apiUrl = `https://api.github.com/repos/${repo}/pulls`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${creds.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      body: description,
      head: sourceBranch,
      base: targetBranch,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`GitHub API error (${response.status}): ${JSON.stringify(data)}`);
  }

  return data.html_url;
}

async function createGitLabMR(creds) {
  const baseUrl = creds.url.replace(/\/$/, "");
  const projectPath = creds.project;
  const encodedProject = encodeURIComponent(projectPath);
  const apiUrl = `${baseUrl}/api/v4/projects/${encodedProject}/merge_requests`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "PRIVATE-TOKEN": creds.token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      source_branch: sourceBranch,
      target_branch: targetBranch,
      title,
      description,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`GitLab API error (${response.status}): ${JSON.stringify(data)}`);
  }

  return data.web_url;
}

// ─── 메인 ───

async function main() {
  // 1. credentials 읽기
  const credPath = getCredentialsPath();
  if (!fs.existsSync(credPath)) {
    console.error(`credentials 파일을 찾을 수 없습니다: ${credPath}`);
    console.error("");
    console.error("~/.config/agent-wiki/credentials 파일을 생성하세요:");
    console.error(`  [github.${skillName}]`);
    console.error(`  url      = https://github.com`);
    console.error(`  repo     = owner/repo`);
    console.error(`  token    = ghp_xxxx`);
    console.error(`  username = your-username`);
    process.exit(1);
  }

  const content = fs.readFileSync(credPath, "utf-8");
  const creds = parseCredentials(content, skillName);

  if (!creds) {
    console.error(`credentials에서 [*.${skillName}] 섹션을 찾을 수 없습니다.`);
    console.error(`${credPath} 파일에 다음 섹션을 추가하세요:`);
    console.error("");
    console.error(`  [github.${skillName}]`);
    console.error(`  url      = https://github.com`);
    console.error(`  repo     = owner/repo`);
    console.error(`  token    = ghp_xxxx`);
    console.error(`  username = your-username`);
    process.exit(1);
  }

  // 2. 플랫폼별 MR/PR 생성
  let mrUrl;
  try {
    if (creds.platform === "github") {
      mrUrl = await createGitHubPR(creds);
    } else if (creds.platform === "gitlab") {
      mrUrl = await createGitLabMR(creds);
    } else {
      console.error(`지원하지 않는 플랫폼: ${creds.platform}`);
      console.error("지원 플랫폼: github, gitlab");
      process.exit(1);
    }
  } catch (err) {
    console.error(`MR/PR 생성 실패: ${err.message}`);
    process.exit(1);
  }

  // 3. 결과 출력
  console.log(mrUrl);
}

main();
