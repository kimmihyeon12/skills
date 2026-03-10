# Product Backlog 가이드

Product Backlog는 agent-wiki 산출물의 **진입점**이다. 모든 Epic과 User Story를 인덱스 테이블로 정리하고, 각 문서로의 상대 링크를 포함한다.

---

## 출력 경로

```
<워크스페이스>/product-backlog.md
```

---

## 템플릿

→ `templates/product-backlog.md` 참고

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
| Sitemap | `sitemap.md` |
| Data Model | `data-model.md` |

---

## 작성 규칙

1. Epic 목록은 EP ID 오름차순으로 정렬
2. Story 전체 목록은 US ID 오름차순으로 정렬
3. 우선순위 컬럼은 MoSCoW 기준: Must / Should / Could
4. 상태 컬럼은: pending / ready / in-progress / blocked / review-needed / done / cancelled
5. 라벨은 쉼표로 구분: frontend, backend, mobile, infra 등
6. 모든 ID는 해당 문서로의 상대 링크를 포함해야 한다
7. 취소된 Story는 "User Story 전체 목록"에서 행을 제거하고 "취소된 스토리" 섹션으로 이동한다. 파일 자체는 삭제하지 않는다
8. `cancelled_count` 프론트매터는 취소된 스토리 수만큼 갱신한다
