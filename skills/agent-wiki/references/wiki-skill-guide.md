# 위키 스킬 가이드

생성된 위키 문서가 Agent Skill로서 동작하기 위해 필요한 파일들의 템플릿과 규칙을 정의한다.

---

## 스킬 이름 규칙

SKILL.md 프론트매터의 `name`은 **영문 소문자 + 하이픈(-)만** 허용된다.

**이름 결정 방식:**
- 워크스페이스 폴더명이 영문+하이픈이면 → `{폴더명}-wiki`
- 폴더명이 한글이거나 규칙에 맞지 않으면 → 요구사항 분석에서 파악한 프로젝트 성격으로 영문 슬러그 생성 → `{슬러그}-wiki`
  - 예: `연차관리프로그램` → `leave-mgmt-wiki`
  - 예: `My Project!` → `my-project-wiki`

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
