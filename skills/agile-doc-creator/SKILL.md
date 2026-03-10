---
name: agile-doc-creator
description: >
  비정형 정보(기획 메모, 클라이언트 요청, 아이디어, RFP 등) 또는 기존 소스코드·문서를 분석하여
  에자일 문서(Product Brief, Product Backlog, Epic, User Story, DoD)를 생성·관리한다.
  인수 조건은 Given-When-Then 형식으로 작성하고, 7단계 상태로 Story 진행을 추적한다.
  생성 후 다른 에이전트가 이 문서들을 유지·보수하는 방법을 가이드라인으로 함께 준비한다.
  agent-wiki 워크스페이스 내부 또는 독립 디렉토리 모두에서 동작한다.
  트리거: "백로그 만들어줘", "유저스토리 정리", "에픽 뽑아줘", "Product Brief 작성",
  "인수 조건 작성", "agile-doc-creator", "에자일 문서", "요구사항을 스토리로",
  "백로그 업데이트", "스토리 추가해줘", "이슈 정리해줘", "버그 추가해줘", "DoD 만들어줘"
metadata:
  author: dev-goraebap
  version: "1.0"
---

# agile-doc-creator

비정형 입력 또는 기존 코드·문서에서 **에자일 산출물**을 생성·관리한다.
이 스킬은 **문서 내용** 전문가다. 워크스페이스 git 관리는 `agent-wiki`가 담당한다.

## 동작 환경 감지

실행 전 CWD를 확인하여 작업 위치를 결정한다:

| 조건 | 동작 위치 |
|------|-----------|
| CWD에 `AGENTS.md` 있음 (위키 워크스페이스) | 현재 위치에서 문서 생성 |
| `.gitmodules`에 `*-wiki` 항목 있음 | 서브모듈 경로에서 문서 생성 |
| 위 둘 다 해당 없음 | CWD에 직접 생성 (독립 모드) |

## 산출물 목록

| 문서 | 생성 조건 | 가이드 |
|------|-----------|--------|
| `product-brief.md` | 항상 | `references/product-brief-guide.md` |
| `epics/ep-NNN-[슬러그].md` | 항상 | `references/epic-guide.md` |
| `user-stories/us-NNN-[슬러그].md` | 항상 | `references/user-story-guide.md` |
| `product-backlog.md` | 항상 | `references/product-backlog-guide.md` |
| `definition-of-done.md` | 항상 | `references/dod-guide.md` |
| `CONTRIBUTING.md` | 신규 워크스페이스 | 아래 가이드라인 섹션 참고 |

## 절차

### Step 1 — 입력 처리

모든 입력 원본을 `.sources/v{N}_[슬러그].[확장자]`로 보관한다:

| 파일 형식 | 처리 방법 |
|-----------|-----------|
| `.pdf` | scripts/extract_pdf_text.js로 텍스트 추출 후 `.sources/`에 저장. 원본도 이동 |
| `.txt` / `.md` | Read 후 `.sources/`로 이동 |
| 구두 설명 | `.sources/v{N}_verbal-input.txt`에 저장 |
| 소스코드 | Read하여 도메인·기능·엔드포인트 분석 |
| 그 외 형식 | `.txt` 또는 `.md`로 변환 요청 |

기존 에자일 문서가 있으면 먼저 읽어 현황 파악 (기존 ID 범위, Epic/Story 수).

### Step 2 — 문서 생성 (신규)

`product-brief.md`의 컨텍스트를 반영하여 아래 순서로 문서를 생성한다.
각 문서의 상세 작성 규칙은 `references/` 가이드 참고.

1. `product-brief.md`
2. `epics/ep-NNN-[슬러그].md` (Epic별 파일)
3. `user-stories/us-NNN-[슬러그].md` (Story별 파일)
4. `product-backlog.md` (인덱스)
5. `definition-of-done.md`

플랫폼 유형이 불명확하면 추측하지 않고 사용자에게 확인한다.

`product-backlog.md` 생성 후 사용자에게 리뷰 요청:
> Epic 범위와 Story 우선순위를 검토해주세요. 수정할 내용이 있으면 말씀해주세요.

### Step 3 — 문서 변경 (기존)

기존 에자일 문서가 있는 경우 변경 유형을 분류한다:

```
[추가] 새 Epic, 새 Story, 새 인수 조건
[수정] Story명 변경, 우선순위 변경, AC 수정
[취소] Story 방향 변경 → state: cancelled (삭제 아님)
[삭제] 완전 제거 (중복·오생성에만 사용)
[이동] Story의 Epic 소속 변경 (ID 유지)
```

**ID 처리:**
- 기존 ID는 절대 변경하지 않는다
- 새 Epic은 마지막 EP 번호 다음을 이어서 부여
- 새 Story는 마지막 US 번호 다음을 이어서 부여
- 삭제된 ID는 재사용하지 않는다

**프론트매터 갱신:**
- `updated`: 수정 시마다 오늘 날짜
- `state`, `priority`: 본문과 프론트매터 모두 갱신
- `agent-note`: 상태 전환 시 컨텍스트 기록 (review-needed, blocked, cancelled 전환 시 필수)

### Step 4 — 가이드라인 문서 생성

신규 워크스페이스에서 처음 에자일 문서를 생성하는 경우 `CONTRIBUTING.md`를 함께 생성한다.
이 파일은 **다른 에이전트(또는 사람)가 에자일 문서를 유지·보수하는 방법**을 정의한다:

```markdown
# Contributing to [프로젝트명] Wiki

## 문서 추가 방법
- Epic 추가: references/epic-guide.md 참고
- Story 추가: references/user-story-guide.md 참고
- ID 규칙: EP-NNN, US-NNN (마지막 번호에서 이어서)

## 상태 관리
- 7단계 상태: pending → ready → in-progress → review-needed → blocked → done → cancelled
- 상태 전환 시 agent-note에 컨텍스트 기록 필수

## 수정 원칙
- 기존 ID 변경 금지
- 삭제 대신 cancelled 처리
- product-backlog.md는 항상 최신 상태 유지

## 연관 스킬
- 워크스페이스 관리: /agent-wiki
- IA 문서 추가: /ia-doc-creator
```

### Step 5 — AGENTS.md 갱신

agent-wiki 워크스페이스 내에서 작업하는 경우, 새 에자일 문서가 생성되면 AGENTS.md의 읽기 순서와 구조 설명을 갱신한다.

## 참고 파일

### References

| 파일 | 역할 |
|------|------|
| `references/product-brief-guide.md` | Product Brief 템플릿 + 작성 규칙 |
| `references/product-backlog-guide.md` | Backlog 템플릿 + 소스 이력 + 링크 패턴 |
| `references/epic-guide.md` | Epic 템플릿 + ID/파일명 규칙 |
| `references/user-story-guide.md` | Story 템플릿 + AC(GWT) + 7단계 상태 + agent-note |
| `references/dod-guide.md` | DoD 체크리스트 템플릿 |

### Templates

| 파일 | 역할 |
|------|------|
| `templates/product-brief.md` | Product Brief 양식 |
| `templates/product-backlog.md` | Backlog 양식 |
| `templates/epic.md` | Epic 양식 |
| `templates/user-story.md` | User Story 양식 |
| `templates/definition-of-done.md` | DoD 양식 |
