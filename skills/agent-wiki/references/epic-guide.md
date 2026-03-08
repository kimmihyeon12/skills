# Epic 가이드

Epic은 관련 User Story를 묶는 상위 단위다. 기능 영역별로 하나의 Epic을 구성한다.

---

## 출력 경로

```
wikicraft/epics/ep-NNN-[슬러그].md
```

---

## ID 규칙

- 패턴: `EP-NNN` (3자리 zero-padding)
- 시작: EP-001
- 기존 ID 변경 금지
- 삭제된 ID 재사용 금지

---

## 파일명 규칙

- 패턴: `ep-NNN-[슬러그].md`
- 슬러그: 소문자 영문 + 하이픈, 핵심 키워드만
- 예시: `ep-001-user-mgmt.md`, `ep-002-dashboard.md`

---

## 템플릿

```markdown
# [EP-NNN] Epic명

## 기본 정보

| 항목 | 내용 |
|------|------|
| Epic ID | EP-NNN |
| Epic명 | ... |
| 설명 | (이 Epic이 다루는 기능 영역 요약) |
| 우선순위 | Must / Should / Could |
| 상태 | Todo / In Progress / Done |

## 소속 User Story

| Story ID | Story명 | 우선순위 | 상태 |
|----------|---------|---------|------|
| [US-001](../user-stories/us-001-xxx.md) | Story명 | Must | Todo |
| [US-002](../user-stories/us-002-xxx.md) | Story명 | Should | Todo |

## 메모 / 의사결정 기록

| 날짜 | 내용 | 결정 |
|------|------|------|
| | | |

## 데이터 모델 (선택)

> 이 섹션은 선택 사항이다. 입력 문서에서 데이터 구조가 파악되는 경우에만 작성한다.

| 엔티티 | 설명 | 주요 속성 |
|--------|------|-----------|
| ... | ... | ... |

### 엔티티 관계 요약

(텍스트 또는 Mermaid erDiagram)
```

---

## 상대 링크 규칙

Epic 문서에서 다른 문서로의 링크:

| 대상 | 링크 패턴 |
|------|-----------|
| Story 문서 | `../user-stories/us-NNN-[슬러그].md` |
| Product Backlog | `../product-backlog.md` |
| 다른 Epic | `./ep-NNN-[슬러그].md` |

---

## 작성 규칙

1. 소속 Story 테이블은 US ID 오름차순으로 정렬
2. Epic의 우선순위는 소속 Story 중 가장 높은 우선순위를 따른다
3. Epic의 상태는 소속 Story의 상태를 종합하여 판단:
   - 모든 Story가 Todo → Todo
   - 하나 이상 In Progress → In Progress
   - 모든 Story가 Done → Done
4. 메모 / 의사결정 기록은 빈 테이블로 생성 (사용자가 추후 기록)
5. 데이터 모델 섹션은 **선택 사항**이다. 입력에서 데이터 구조가 파악되는 경우에만 작성한다
6. 데이터 모델은 해당 Epic 범위의 엔티티만 포함한다. 다른 Epic의 엔티티는 포함하지 않는다
7. 데이터 모델은 점진적으로 확장 가능하다. 초기에는 주요 엔티티와 속성만 기록하고, 이후 업데이트에서 보완한다
