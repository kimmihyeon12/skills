---
type: product-backlog
project: <project-name>
epic_count: N
story_count: N
cancelled_count: 0
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

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

| Story ID | Story명 | Epic | 타입 | 우선순위 | 상태 | 라벨 |
|----------|---------|------|------|---------|------|------|
| [US-001](user-stories/us-001-xxx.md) | Story명 | [EP-001](epics/ep-001-xxx.md) | feature | Must | pending | frontend, backend |
| [US-002](user-stories/us-002-xxx.md) | Story명 | [EP-001](epics/ep-001-xxx.md) | bug | Must | pending | frontend |

## 의존성 맵

| Story | 선행 Story |
|-------|-----------|
| [US-002](user-stories/us-002-xxx.md) | [US-001](user-stories/us-001-xxx.md) |
| [US-005](user-stories/us-005-xxx.md) | [US-003](user-stories/us-003-xxx.md), [US-004](user-stories/us-004-xxx.md) |

## 취소된 스토리

> 방향 변경으로 더 이상 필요 없는 Story를 삭제하지 않고 여기에 보관한다.
> 파일(us-NNN-*.md)은 `state: cancelled`로 변경 후 유지한다. ID는 재사용하지 않는다.

| Story ID | Story명 | 소속 Epic | 취소 사유 | 취소일 |
|----------|---------|-----------|-----------|--------|
| — | — | — | — | — |
