# Product Backlog 가이드

Product Backlog는 agent-wiki 산출물의 **진입점**이다. 모든 Epic과 User Story를 인덱스 테이블로 정리하고, 각 문서로의 상대 링크를 포함한다.

---

## 출력 경로

```
<워크스페이스>/product-backlog.md
```

---

## 템플릿

```markdown
# Product Backlog

## 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | (프로젝트명) |
| Product Brief | [product-brief.md](product-brief.md) |
| 작성일 | YYYY-MM-DD |
| Epic 수 | N |
| Story 수 | N |

## 소스 이력

| 버전 | 파일 | 입력일 | 비고 |
|------|------|--------|------|
| v1 | [rfp-document.txt](.sources/v1_rfp-document.txt) | YYYY-MM-DD | 최초 RFP |
| v2 | [meeting-notes.txt](.sources/v2_meeting-notes.txt) | YYYY-MM-DD | 회의록 반영 |

## Epic 목록

| Epic ID | Epic명 | Story 수 | 우선순위 |
|---------|--------|----------|---------|
| [EP-001](epics/ep-001-xxx.md) | Epic명 | N | Must |
| [EP-002](epics/ep-002-xxx.md) | Epic명 | N | Should |

## User Story 전체 목록

| Story ID | Story명 | Epic | 우선순위 | 상태 | 라벨 |
|----------|---------|------|---------|------|------|
| [US-001](user-stories/us-001-xxx.md) | Story명 | [EP-001](epics/ep-001-xxx.md) | Must | Todo | frontend, backend |
| [US-002](user-stories/us-002-xxx.md) | Story명 | [EP-001](epics/ep-001-xxx.md) | Should | Todo | frontend |

## 의존성 맵

| Story | 선행 Story |
|-------|-----------|
| [US-002](user-stories/us-002-xxx.md) | [US-001](user-stories/us-001-xxx.md) |
| [US-005](user-stories/us-005-xxx.md) | [US-003](user-stories/us-003-xxx.md), [US-004](user-stories/us-004-xxx.md) |
```

의존성이 없는 Story는 의존성 맵 테이블에서 생략한다.

---

## 상대 링크 규칙

Product Backlog에서 다른 문서로의 링크는 반드시 상대 경로를 사용한다:

| 대상 | 링크 패턴 |
|------|-----------|
| Product Brief | `product-brief.md` |
| Epic 문서 | `epics/ep-NNN-[슬러그].md` |
| Story 문서 | `user-stories/us-NNN-[슬러그].md` |
| DoD | `definition-of-done.md` |
| 소스 파일 | `.sources/v{N}_[슬러그].txt` |

---

## 작성 규칙

1. Epic 목록은 EP ID 오름차순으로 정렬
2. Story 전체 목록은 US ID 오름차순으로 정렬
3. 우선순위 컬럼은 MoSCoW 기준: Must / Should / Could
4. 상태 컬럼은: Todo / In Progress / Done
5. 라벨은 쉼표로 구분: frontend, backend, mobile, infra 등
6. 모든 ID는 해당 문서로의 상대 링크를 포함해야 한다
