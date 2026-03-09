# 원격 기여 가이드

생성된 위키 스킬이 원격 리포지토리에 호스팅될 때, 에이전트가 MR/PR을 통해 기여하는 절차를 정의한다.

이 가이드는 두 곳에서 참조된다:
1. **agent-wiki** — 위키 생성 시, 생성되는 SKILL.md에 업데이트 절차를 포함할 때
2. **생성된 위키 스킬** — 실제 이슈/변경 요청을 처리할 때

---

## R-Step 1 — 인증 확인

`~/.config/agent-wiki/credentials`에서 해당 스킬 이름의 섹션을 찾는다.

```
섹션 헤더: [{platform}.{skill-name}]
예: [github.todo-app-wiki]
```

- 섹션이 있으면 → 인증 정보를 읽고 진행
- 섹션이 없으면 → 사용자에게 credentials 설정을 안내하고 중단

credentials 형식 상세는 `credentials-guide.md` 참고.

---

## R-Step 2 — 플랫폼 판단 및 도구 선택

섹션 헤더의 플랫폼 키로 판단한다:

| 플랫폼 키 | 도구 | 비고 |
|-----------|------|------|
| `github` | `gh` CLI 또는 GitHub API | `gh auth login --with-token` 후 사용 |
| `gitlab` | GitLab REST API (curl) | `PRIVATE-TOKEN` 헤더 사용 |

에이전트가 런타임에 판단하므로 별도 설정 불필요.

---

## R-Step 3 — 리포지토리 준비 및 브랜치 생성

이 가이드는 **프로젝트에 설치된 스킬에서 호출된 경우**(케이스 B)를 대상으로 한다.
위키 리포에서 직접 작업하는 경우(케이스 A)는 일반 git 워크플로우를 따르면 된다.

### 리포지토리 준비

임시 디렉토리에 원격 리포를 clone한다.

```bash
# GitHub 예시
git clone https://{username}:{token}@github.com/{repo}.git /tmp/{skill-name}

# GitLab 예시
git clone https://oauth2:{token}@{gitlab-url}/{project}.git /tmp/{skill-name}
```

### 브랜치 생성

```
브랜치명: contrib/{skill-name}-{짧은-설명}
예: contrib/todo-app-wiki-fix-login-bug
```

- 슬러그 규칙: 소문자 영문 + 하이픈, 40자 이내
- 기본 브랜치(main/master)에서 분기

---

## R-Step 4 — 변경 적용

일반 업데이트 모드와 동일하게 문서를 수정한다:
- Story 추가/수정/삭제
- Epic 갱신
- product-backlog.md 갱신

CONTRIBUTING.md의 문서 규칙(ID, 파일명, 상호 링크)을 준수한다.

---

## R-Step 5 — 커밋 및 MR/PR 생성

### 커밋 및 push

```bash
git add -A
git commit -m "[{skill-name}] 변경 요약"
git push origin contrib/{skill-name}-{설명}
```

### MR/PR 생성

`scripts/create-mr.js` 스크립트를 사용한다. credentials 읽기와 플랫폼별 API 호출을 자동으로 처리한다.

```bash
node scripts/create-mr.js \
  --skill-name {skill-name} \
  --source-branch contrib/{skill-name}-{설명} \
  --title "[{skill-name}] 변경 요약" \
  --description "변경 내용 상세"
```

스크립트가 성공하면 MR/PR URL을 stdout으로 출력한다.

> **주의:** 생성된 위키 스킬에도 `scripts/create-mr.js`가 포함되어 있다.
> 설치된 스킬에서 호출 시에는 스킬 디렉토리의 스크립트를 사용한다:
> `node .agents/skills/{skill-name}/scripts/create-mr.js ...`

### 결과 보고

MR/PR URL을 사용자에게 보고한다:

```
✅ 위키 업데이트 MR/PR 생성 완료

PR: https://github.com/{repo}/pull/42

[변경 내용]
- user-stories/us-014-fix-login-bug.md 추가
- epics/ep-002-user-mgmt.md 갱신
- product-backlog.md 갱신
```
