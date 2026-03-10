---
type: user-flows
project: <project-name>
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# User Flows

> 페르소나별 핵심 태스크 흐름. User Story의 AC(인수 조건)에서 도출한다.
> 화면명은 [sitemap.md](sitemap.md)와 일치시킨다.

---

## [페르소나명] — [태스크명] (예: 비회원 — 회원가입 후 첫 구매)

관련 Story: [US-NNN](user-stories/us-NNN-xxx.md), [US-NNN](user-stories/us-NNN-xxx.md)

```mermaid
flowchart TD
    A([시작: 진입점]) --> B[화면명]
    B --> C{조건}
    C -->|조건 A| D[화면명]
    C -->|조건 B| E[화면명 - 에러]
    D --> F[화면명]
    F --> G([종료: 태스크 완수])
```

| 단계 | 화면 | 사용자 행동 | 다음 화면 |
|------|------|------------|----------|
| 1 | (화면명) | (행동 설명) | (다음 화면명) |
| 2 | (화면명) | (행동 설명) | (다음 화면명) |
| 3 | (화면명) | (행동 설명) | 완료 |

---

## [페르소나명] — [태스크명] (예: 로그인 사용자 — 재구매)

관련 Story: [US-NNN](user-stories/us-NNN-xxx.md)

```mermaid
flowchart TD
    A([시작: 홈 또는 직접 URL]) --> B[화면명]
    B --> C[화면명]
    C --> D([종료: 태스크 완수])
```

| 단계 | 화면 | 사용자 행동 | 다음 화면 |
|------|------|------------|----------|
| 1 | (화면명) | (행동 설명) | (다음 화면명) |
| 2 | (화면명) | (행동 설명) | 완료 |

---

## [페르소나명] — [태스크명] (예: 관리자 — 콘텐츠 관리)

관련 Story: [US-NNN](user-stories/us-NNN-xxx.md)

```mermaid
flowchart TD
    A([시작: 관리자 로그인]) --> B[화면명]
    B --> C{콘텐츠 유형}
    C -->|유형 A| D[화면명]
    C -->|유형 B| E[화면명]
    D --> F([종료])
    E --> F
```

| 단계 | 화면 | 사용자 행동 | 다음 화면 |
|------|------|------------|----------|
| 1 | (화면명) | (행동 설명) | (다음 화면명) |

---

## 관련 문서

- [Sitemap](sitemap.md) — 전체 화면 계층 구조
- [Product Backlog](product-backlog.md)
