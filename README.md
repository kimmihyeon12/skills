# dev-goraebap/skills

## 스킬 목록

| 스킬 | 설명 |
|------|------|
| [agent-wiki](./skills/agent-wiki/) | 어떤 정보 공간이든 git 기반 워크스페이스로 만들고 관리. AGENTS.md를 동적 생성하여 에이전트 길잡이 역할 |
| [agile-doc-creator](./skills/agile-doc-creator/) | 비정형 정보·소스코드에서 Product Brief, Backlog, Epic, User Story, DoD 생성·관리 |
| [ia-doc-creator](./skills/ia-doc-creator/) | 비정형 정보·소스코드에서 Sitemap, User Flows, IA Audit 생성·관리 |
| [pdf-parser](./skills/pdf-parser/) | PDF 파일에서 텍스트를 추출하여 .txt로 변환 |
| [claude-discord-notify](./skills/claude-discord-notify/) | 작업 완료·확인 필요 시 Discord 웹훅으로 알림 전송 — OS 무관, Node.js만 있으면 동작 |
| [html-prototype](./skills/html-prototype/) | 요구사항 문서·화면설계서에서 순수 HTML/CSS/JS 클릭 가능한 프로토타입 자동 생성 |
| [media-storage](./skills/media-storage/) | 파일 업로드·저장소·첨부 관리 패턴 (R2, blob, 색상 추출) |
| [sveltekit-progressive-architecture](./skills/sveltekit-progressive-architecture/) | SvelteKit 개발 가이드라인 |
| [sveltekit-shadcn-guidline](./skills/sveltekit-shadcn-guidline/) | SvelteKit + shadcn-svelte 컴포넌트 활용 가이드 |

## 설치하기

[skills.sh](https://skills.sh)에서 스킬을 검색하고, 아래 명령으로 설치할 수 있습니다:

```bash
npx skills add dev-goraebap/skills
```

실행하면 단계별로 설치 옵션을 선택할 수 있습니다.

**1. 스킬 선택** — 설치할 스킬을 고릅니다 (스페이스로 토글)

```
◆  Select skills to install (space to toggle)
│  ◻ media-storage
│  ◻ mvp-preview
│  ◻ sveltekit-progressive-architecture
```

**2. 에이전트 선택** — 어떤 에이전트에 설치할지 선택합니다

```
◆  Which agents do you want to install to?
│  Amp, Codex, Gemini CLI, GitHub Copilot, Claude Code, ...
```

Claude Code, Cursor, Gemini CLI, GitHub Copilot 등 24개 이상의 에이전트를 지원합니다.

**3. 설치 범위** — 프로젝트 단위 또는 전역 설치를 선택합니다

```
◆  Installation scope
│  ● Project  (현재 프로젝트에만 설치, git에 포함)
│  ○ Global   (모든 프로젝트에서 사용)
```

**4. 설치 방식** — 심링크(권장) 또는 복사를 선택합니다

```
◆  Installation method
│  ● Symlink  (단일 소스, 업데이트 용이 — 권장)
│  ○ Copy     (각 에이전트 디렉토리에 복사)
```

## Agent Skills

> **Agent Skills**란 AI 에이전트에게 절차적 지식을 제공하는 재사용 가능한 역량 모음입니다. Claude Code, Cursor, GitHub Copilot, Gemini, Windsurf, Cline 등 **24개 이상의 에이전트**에서 동일한 스킬을 사용할 수 있습니다. 자세한 내용은 [agentskills.io](http://agentskills.io)를 참고하세요.

## 스킬 만들기

### 구조

```
skill-name/
├── SKILL.md          # 필수: 메타데이터 + 지시사항
├── scripts/          # 선택: 실행 가능한 스크립트
├── references/       # 선택: 참조 문서
└── assets/           # 선택: 템플릿, 리소스
```

### SKILL.md 포맷

```markdown
---
name: my-skill-name
description: 이 스킬이 무엇을 하는지, 언제 사용하는지 명확하게 설명
---

# 스킬 이름

[에이전트가 따를 지시사항을 여기에 작성]
```

- `name` — 스킬 고유 식별자 (소문자, 하이픈 사용, 폴더명과 일치)
- `description` — 스킬 용도와 사용 시점을 구체적으로 기술 (에이전트가 태스크 매칭에 활용)

상세 레퍼런스나 템플릿은 `references/`, `assets/` 하위 폴더로 분리하고 `SKILL.md`는 500줄 이하로 유지하는 것을 권장합니다.
