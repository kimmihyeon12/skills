---
type: sitemap
project: <project-name>
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Sitemap

> IA(Information Architecture) 원칙에 따라 설계한 화면 계층 구조.
> User Story에서 도출하며, 페르소나별 네비게이션 경로와 화면 상태를 포함한다.

## 개요

| 항목 | 내용 |
|------|------|
| 총 화면 수 | N |
| MVP 포함 화면 | N |
| 완료된 화면 | N |
| 최대 depth | N |

---

## 네비게이션 계층 구조

```
/ (홈)
├── [섹션명]  (/path)
│   ├── [화면명]  (/path/sub)
│   └── [화면명]  (/path/sub2)
├── [섹션명]  (/path2)
│   ├── [화면명]  (/path2/sub)
│   │   └── [화면명]  (/path2/sub/detail)
│   └── [화면명]  (/path2/sub2)
└── [섹션명]  (/path3)
    └── [화면명]  (/path3/sub)
```

> 같은 화면이 여러 경로에서 접근 가능한 경우 `→` 로 참조 표기:
> `└── [화면명]  → /path/to/screen`

---

## 화면 인벤토리

### [역할/섹션명] (예: 비로그인 사용자)

| 화면명 | 경로 | Depth | MVP | 관련 Story | 상태 |
|--------|------|-------|-----|-----------|------|
| (화면명) | /path | 1 | Y | [US-NNN](user-stories/us-NNN-xxx.md) | pending |

### [역할/섹션명] (예: 로그인 사용자)

| 화면명 | 경로 | Depth | MVP | 관련 Story | 상태 |
|--------|------|-------|-----|-----------|------|
| (화면명) | /path | 2 | Y | [US-NNN](user-stories/us-NNN-xxx.md) | pending |

### [역할/섹션명] (예: 관리자)

| 화면명 | 경로 | Depth | MVP | 관련 Story | 상태 |
|--------|------|-------|-----|-----------|------|
| (화면명) | /admin/path | 2 | N | [US-NNN](user-stories/us-NNN-xxx.md) | pending |

---

## MVP 요약

| 항목 | 내용 |
|------|------|
| MVP 포함 화면 | (화면명 나열) |
| MVP 제외 화면 | (화면명 나열) |

---

## 관련 문서

- [User Flows](user-flows.md) — 페르소나별 태스크 흐름
- [Product Backlog](product-backlog.md)
