# 위키 스킬 가이드

생성된 위키 문서가 Agent Skill로서 동작하기 위해 필요한 파일들의 템플릿과 규칙을 정의한다.

---

## 스킬 이름 규칙

SKILL.md 프론트매터의 `name`은 **영문 소문자 + 하이픈(-)만** 허용된다.

**이름 결정 방식:**
- 워크스페이스 폴더명이 영문+하이픈이고, 이미 `-wiki`로 끝나면 → `{폴더명}` (그대로 사용, `-wiki`를 다시 붙이지 않는다)
- 워크스페이스 폴더명이 영문+하이픈이고, `-wiki`로 끝나지 않으면 → `{폴더명}-wiki`
- 폴더명이 한글이거나 규칙에 맞지 않으면 → 요구사항 분석에서 파악한 프로젝트 성격으로 영문 슬러그 생성 → `{슬러그}-wiki`
  - 예: `연차관리프로그램` → `leave-mgmt-wiki`
  - 예: `My Project!` → `my-project-wiki`
  - 예: `all-in-one-personal-wiki` → `all-in-one-personal-wiki` (이미 `-wiki` 포함)

**폴더명 불일치 피드백:**

스킬 이름과 폴더명이 다를 경우 Step 6 결과 보고에서 다음과 같이 안내한다:

```
⚠️ SKILL.md의 name은 영문과 하이픈(-)만 사용 가능합니다.
현재 폴더명 "{현재폴더명}"과 스킬 name "{생성된name}"이 다릅니다.
폴더명을 스킬 name에 맞추려면: mv {현재폴더명} {생성된name}
이름이 마음에 안 드시면 말씀해주세요. 폴더명과 스킬 name을 맞춰드립니다.
```

---

## SKILL.md 템플릿

```markdown
---
name: {프로젝트슬러그}-wiki
description: >
  {프로젝트명} 프로젝트의 위키 스킬.
  Product Brief, Product Backlog, Epic, User Story, Definition of Done 문서를 포함하며,
  에이전트가 프로젝트를 이해하고 작업할 때 참고 자료로 활용한다.
  이 스킬이 설치된 프로젝트에서 에이전트는 제품 컨텍스트(플랫폼, 대상 사용자),
  요구사항, 우선순위, 인수 조건, 의존성 관계를 파악할 수 있다.
---

# {프로젝트명} Wiki

이 스킬은 {프로젝트명} 프로젝트의 요구사항과 백로그를 구조화한 위키 문서이다.

## 진입점

- [Product Brief](product-brief.md) — 제품 컨텍스트 (플랫폼, 대상 사용자, 기술 제약)
- [Product Backlog](product-backlog.md) — 전체 Epic/Story 인덱스
- [Definition of Done](definition-of-done.md) — 완료 기준

## 문서 구조

- `product-brief.md` — 제품 컨텍스트 (플랫폼, 대상 사용자, 기술 제약)
- `product-backlog.md` — 전체 인덱스 (Epic 목록, Story 전체 목록, 의존성 맵)
- `epics/` — Epic별 상세 문서 (소속 Story 링크, 데이터 모델)
- `user-stories/` — User Story별 상세 문서 (인수 조건, 의존성, UI/화면)
- `definition-of-done.md` — 공통 완료 기준

## 활용 방법

프로젝트 작업 시 이 위키를 참고하면:
- 전체 요구사항과 우선순위를 파악할 수 있다
- 각 Story의 인수 조건(AC)으로 구현 완료 기준을 확인할 수 있다
- Story 간 의존성을 확인하여 작업 순서를 결정할 수 있다

## 원격 리포지토리 (선택)

> 이 섹션은 생성 시 사용자가 원격 리포 정보를 제공한 경우에만 포함한다.

| 항목 | 내용 |
|------|------|
| 플랫폼 | GitHub / GitLab |
| 리포지토리 | {repo-url} |

## 업데이트 절차

이 위키에 이슈 추가, Story 수정 등 변경이 필요할 때:

### 워크스페이스 판단

- **케이스 A: 위키 리포에서 직접 작업** (CWD에 `product-backlog.md`가 있음): 로컬 git으로 브랜치 생성 → 수정 → push → PR. credentials 불필요.
- **케이스 B: 프로젝트에 설치된 스킬로 호출** (`.agents/skills/` 하위): 설치된 로컬 파일을 직접 수정하지 않는다. 아래 원격 절차를 따른다.

### 원격 업데이트 (케이스 B: 설치된 스킬에서 호출 시)

#### 1. 인증 확인

`~/.config/agent-wiki/credentials`에서 `[{platform}.{skill-name}]` 섹션을 읽는다.

```toml
[{platform}.{skill-name}]
url      = {base-url}
repo     = {repo-path}
token    = (발급받은 토큰)
username = (사용자명)
```

섹션이 없으면 사용자에게 credentials 설정을 안내하고 중단한다.

#### 2. 리포지토리 준비

임시 디렉토리에 원격 리포를 clone한다.
기본 브랜치에서 `contrib/{skill-name}-{설명}` 브랜치를 생성한다.

#### 3. 변경 적용

CONTRIBUTING.md의 규칙에 따라 문서를 수정한다:
- 이슈 → Story로 변환 (타입: feature / bug / enhancement / tech-debt)
- 관련 Epic과 product-backlog.md 갱신
- product-brief.md 없으면 부트스트랩 제안

#### 4. MR/PR 생성

커밋 후 push하고, 플랫폼에 맞는 방식으로 MR/PR을 생성한다:
- GitHub: `gh pr create`
- GitLab: REST API로 MR 생성
- 제목: `[{skill-name}] 변경 요약`

MR/PR URL을 사용자에게 보고한다.

## 문서 수정 규칙

문서를 수정할 때는 반드시 [CONTRIBUTING.md](CONTRIBUTING.md)의 규칙을 따른다.
```

---

## README.md 템플릿

```markdown
# {프로젝트명} Wiki

{프로젝트명} 프로젝트의 요구사항을 애자일 문서로 정리한 위키입니다.

## 문서 구조

| 문서 | 설명 |
|------|------|
| [product-brief.md](product-brief.md) | 제품 컨텍스트 — 플랫폼, 대상 사용자, 기술 제약 |
| [product-backlog.md](product-backlog.md) | 전체 인덱스 — Epic/Story 목록, 의존성 맵 |
| [definition-of-done.md](definition-of-done.md) | 공통 완료 기준 |
| [CONTRIBUTING.md](CONTRIBUTING.md) | 문서 수정 규칙 |

### Epic 목록

| Epic ID | Epic명 |
|---------|--------|
| [EP-001](epics/ep-001-xxx.md) | ... |
| [EP-002](epics/ep-002-xxx.md) | ... |

## 이 위키의 용도

이 저장소는 [Agent Skill](https://agentskills.io) 형식으로 구성되어 있습니다.
프로젝트에 설치하면 AI 에이전트가 요구사항, 우선순위, 인수 조건을 참고하여 작업할 수 있습니다.
```

---

## CONTRIBUTING.md 템플릿

```markdown
# Contributing Guide

이 위키의 문서를 수정할 때 반드시 아래 규칙을 따릅니다.

## 기여 방법

이 위키는 에이전트(Claude 등)를 통해 기여할 수 있습니다.
직접 push하지 않고, MR/PR을 통해 리뷰 후 반영합니다.

### Credentials 설정

`~/.config/agent-wiki/credentials` 파일에 인증 정보를 추가합니다:

\```toml
[{platform}.{skill-name}]
url      = {base-url}
repo     = {repo-path}
token    = (발급받은 토큰)
username = (사용자명)
\```

토큰 발급 방법은 각 플랫폼의 Personal Access Token 가이드를 참고하세요.

### 기여 요청

에이전트에게 자연어로 요청합니다:

> "{skill-name} 위키에 로그인 버그 이슈 추가해줘"

에이전트가 자동으로: credentials 읽기 → 브랜치 생성 → 변경 → MR/PR 생성

### 브랜치 / MR/PR 규칙

- 브랜치: `contrib/{skill-name}-{설명}`
- MR/PR 제목: `[{skill-name}] 변경 요약`

## ID 규칙

| 대상 | 패턴 | 예시 |
|------|------|------|
| Epic | EP-NNN (3자리) | EP-001 |
| User Story | US-NNN (3자리) | US-001 |

- 001부터 시작, 3자리 zero-padding
- **기존 ID는 절대 변경하지 않는다** (추적 이력 보존)
- **삭제된 ID는 재사용하지 않는다**
- Story는 Epic 구분 없이 통합 번호 (다른 Epic으로 옮겨도 ID 유지)
- 새 Epic/Story는 마지막 번호 다음부터 부여

## 파일명 규칙

| 대상 | 패턴 | 예시 |
|------|------|------|
| Epic | `ep-NNN-[슬러그].md` | `ep-001-user-mgmt.md` |
| Story | `us-NNN-[슬러그].md` | `us-001-signup.md` |

슬러그: 소문자 영문 + 하이픈, 핵심 키워드만.

## 상호 링크 유지

문서를 추가/수정/삭제할 때 관련 링크를 반드시 갱신한다:

| 변경 유형 | 갱신 대상 |
|-----------|----------|
| Story 추가 | 새 Story 파일 + 소속 Epic 파일 + product-backlog.md |
| Story 삭제 | 소속 Epic 파일 + product-backlog.md |
| Epic 추가 | 새 Epic 파일 + 하위 Story 파일 + product-backlog.md |
| Story 이동 | 기존/새 Epic 파일 + product-backlog.md (Story ID 유지) |

## 상태 값

- 우선순위: `Must` / `Should` / `Could`
- 상태: `Todo` / `In Progress` / `Done`
```

---

## .gitignore 내용

```
.agents/
.claude/
```
