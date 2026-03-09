---
name: agent-wiki
description: >
  비정형 정보(기획 메모, 클라이언트 요청, 아이디어, RFP 등)를 받아
  Product Brief와 애자일 문서(Product Backlog, Epic, User Story, Definition of Done)를 자동 생성.
  생성된 문서는 위키 스킬로 활용 가능하며, 에이전트가 제품 컨텍스트(플랫폼, 대상 사용자)와
  요구사항을 참고하여 프로젝트를 수행할 수 있다.
  기존 프로젝트의 이슈(버그, 개선, 기술 부채)도 Story로 관리 가능.
  원격 위키 리포에 MR/PR을 통한 기여를 지원한다.
  트리거: "백로그 만들어줘", "유저스토리 정리", "에픽 뽑아줘", "애자일 문서",
  "agent-wiki", "에이전트 위키", "요구사항을 스토리로", "백로그 업데이트",
  "스토리 추가해줘", "이슈 정리해줘", "버그 추가해줘" 등
allowed-tools: Bash Read Write
metadata:
  author: dev-goraebap
  version: "1.0"
---

# agent-wiki

비정형 정보를 받아 **Product Brief, Product Backlog, Epic, User Story, DoD** 문서를 워크스페이스 루트에 생성한다.

## 산출물 구조

```
<워크스페이스>/
├── SKILL.md                    ← 위키 스킬 메타
├── README.md                   ← 프로젝트 위키 개요
├── CONTRIBUTING.md             ← 문서 수정 규칙
├── .gitignore                  ← .agents/, .claude/ 제외
├── product-brief.md            ← 제품 컨텍스트
├── product-backlog.md          ← 진입점
├── definition-of-done.md
├── epics/ep-NNN-[슬러그].md
├── user-stories/us-NNN-[슬러그].md
└── .sources/v{N}_[슬러그].*   ← 입력 원본 보관
```

지원 입력: `.pdf`, `.txt`, `.md`, 구두 설명(채팅). 그 외는 변환 요청.

---

## 실행 절차

### Step 0 — 모드 감지

- `product-backlog.md` 없음 + 기획서/문서 입력 → **신규 모드** (Step 1~7)
- `product-backlog.md` 없음 + 이슈/변경 요청 → **부트스트랩** 후 업데이트 모드 (`references/update-guide.md` 부트스트랩 참고)
- `product-backlog.md` 있음 → **업데이트 모드** (`references/update-guide.md` 참고)

`product-brief.md` 존재 여부도 확인해둔다 (업데이트 모드에서 역생성 판단에 사용).

### Step 1 — 입력 확인

파일 경로 → 확장자 확인(`.pdf/.txt/.md`만 허용). 구두 설명 → 그대로 사용.

**원격 리포 확인:** 위키를 원격 리포에서 관리할지 사용자에게 확인한다. URL이 있으면 기록해두고, Step 6에서 생성되는 SKILL.md와 CONTRIBUTING.md에 원격 정보를 포함한다.

### Step 2 — 텍스트 추출 및 소스 보관

모든 입력은 `.sources/`에 버전별 보관한다. 파일명: `v{N}_[슬러그].[확장자]`

- `.sources/`가 없거나 비어있으면 v1, 기존 파일이 있으면 마지막 +1
- PDF → 스크립트로 텍스트 추출 후 `.sources/`에 저장, 원본 PDF도 `.sources/`로 이동
- TXT/MD → Read 후 원본을 `.sources/`로 이동
- 구두 설명 → `.sources/v{N}_verbal-input.txt`에 저장

```bash
cd ~/.claude/skills/agent-wiki/scripts && npm install --silent
node ~/.claude/skills/agent-wiki/scripts/extract_pdf_text.js \
  <입력.pdf> -o <워크스페이스>/.sources/v{N}_<슬러그>.txt
```

**원칙:** 워크스페이스 루트에는 산출물만 존재. 워크스페이스 내 입력 파일은 반드시 `.sources/`로 이동. 외부 경로 파일은 이동하지 않는다.

### Step 3 — Product Brief 생성

`references/product-brief-guide.md`를 참고하여 입력에서 제품 컨텍스트를 도출한다.

- 제품명, 한 줄 설명, 제품 비전
- 대상 사용자 (페르소나 1~3개)
- 플랫폼 유형 및 기술 제약
- 핵심 목표
- 성공 지표 (입력에 있는 경우만)

**플랫폼 유형이 불명확하면 사용자에게 확인을 요청한다** — 추측하지 않는다.

출력: `<워크스페이스>/product-brief.md`

### Step 4 — 분석

`product-brief.md`를 먼저 읽어 제품 컨텍스트를 반영한 뒤, 가이드 파일들을 읽어 템플릿/규칙을 확인하고 입력에서 다음을 도출한다:

1. Epic 도출 (기능 영역별, EP-001부터)
2. User Story 도출 ("~로서, ~하고 싶다" 형식, US-001부터 통합 번호)
3. 우선순위 (Must / Should / Could)
4. 타입 (feature, bug, enhancement, tech-debt)
5. 라벨 (frontend, backend, mobile, infra 등)
6. Story 간 의존성 (선행/후행)
7. 인수 조건 (체크리스트)

### Step 5 — Product Backlog 생성

`references/product-backlog-guide.md` 참고. 소스 이력 테이블 포함.

### Step 6 — 문서 생성

| 산출물 | 가이드 | 출력 경로 |
|--------|--------|-----------|
| Product Brief | `references/product-brief-guide.md` | `product-brief.md` |
| Epic | `references/epic-guide.md` | `epics/ep-NNN-[슬러그].md` |
| User Story | `references/user-story-guide.md` | `user-stories/us-NNN-[슬러그].md` |
| DoD | `references/dod-guide.md` | `definition-of-done.md` |
| SKILL.md, README.md, CONTRIBUTING.md, .gitignore | `references/wiki-skill-guide.md` | 워크스페이스 루트 |

모든 문서에 상호 링크 포함 (Backlog ↔ Epic ↔ Story).

**스킬 이름 결정:** `references/wiki-skill-guide.md`의 이름 규칙을 따른다. 워크스페이스 폴더명이 이미 `-wiki`로 끝나면 그대로, 영문+하이픈이면 `{폴더명}-wiki`, 아니면 프로젝트 성격에서 영문 슬러그를 도출하여 `{슬러그}-wiki`로 짓는다.

**스크립트 복사:** 원격 리포 정보가 있으면 `scripts/create-mr.js`를 워크스페이스의 `scripts/`에 복사한다. 이 스크립트는 credentials 읽기와 MR/PR 생성을 자동 처리한다.

### Step 7 — 결과 보고

생성 파일 목록, EP/US 수, ID 범위, 우선순위 분포를 보고.

**폴더명 불일치 시:** 워크스페이스 폴더명과 SKILL.md name이 다르면 피드백을 출력한다 (`references/wiki-skill-guide.md`의 피드백 템플릿 참고).

---

## 참고 파일

| 파일 | 역할 |
|------|------|
| `references/product-brief-guide.md` | Product Brief 템플릿 + 작성 규칙 |
| `references/product-backlog-guide.md` | Backlog 템플릿 + 소스 이력 + 링크 패턴 |
| `references/epic-guide.md` | Epic 템플릿 + ID/파일명 규칙 + 데이터 모델 |
| `references/user-story-guide.md` | Story 템플릿 + AC + 타입/상태/라벨/의존성 + UI/화면 |
| `references/dod-guide.md` | DoD 체크리스트 템플릿 |
| `references/update-guide.md` | 업데이트 모드 + 부트스트랩 + 원격 워크스페이스 절차 |
| `references/wiki-skill-guide.md` | SKILL.md/README/CONTRIBUTING/.gitignore 템플릿 + 스킬 이름 규칙 |
| `references/credentials-guide.md` | 원격 기여 인증 정보 형식 + 설정 방법 |
| `references/remote-contrib-guide.md` | 원격 기여 절차 (R-Step 1~5) |
