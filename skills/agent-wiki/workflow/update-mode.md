# UPDATE 모드 — 문서 변경

기존 위키 워크스페이스의 문서를 변경하는 전체 흐름.

---

## UPDATE-step1 — READ 먼저 실행

변경 전 항상 READ 모드(`workflow/read-mode.md`)로 현황을 파악한다.

파악해야 할 것:
- 워크스페이스 구조 (어떤 파일이 있는가)
- 기존 파일들의 패턴 (채번 규칙, 파일명 규칙, 마크다운 형식 등)
- AGENTS.md의 작업 안내 (가이드라인 문서 참조 포함)

---

## UPDATE-step2 — 변경 내용 파악

사용자 지시에서 변경 유형을 분류한다:

```
[추가] 새 파일 생성
[수정] 기존 파일 내용 변경
[취소/비활성화] 완전 삭제 대신 상태 변경 (해당하는 경우)
[삭제] 파일 제거 (드문 경우 — 중복·오생성에만 사용)
[구조 변경] 디렉토리 구조 또는 파일명 변경
```

**가이드라인 확인:**
- 변경할 파일 유형에 대한 가이드라인이 AGENTS.md에서 언급된 경우 반드시 읽는다
- 기존 파일 2~3개를 읽어 형식과 패턴을 파악한 뒤 동일하게 적용한다

**애매한 부분은 작업 전 사용자에게 확인한다.**

---

## UPDATE-step3 — 파일 수정

- 기존 파일 패턴과 일치하는 형식으로 작성
- 가이드라인이 있으면 그것을 우선 따름
- ID/채번 규칙이 있으면 마지막 번호에서 이어서 부여
- 삭제는 되도록 피하고 상태 변경으로 처리
- 변경으로 인해 AGENTS.md의 읽기 순서나 구조 설명이 바뀌면 함께 갱신

---

## UPDATE-step4 — 커밋 및 원격 반영

### 위키 워크스페이스 직접 (Mode A)

```bash
git add -A
git commit -m "docs: {변경 요약}"
git push
```

```
✅ 위키 업데이트 완료

[수정된 파일]
- {파일명}: {변경 내용 한 줄}
- ...
```

### 서브모듈 환경 (Mode B)

**Step 1 — 서브모듈 경로 확인**

```bash
git config --file .gitmodules --get-regexp path | grep wiki
# 예: submodule.my-wiki.path = my-wiki
```

비어 있다면: `git submodule update --init`

**Step 2 — 브랜치 생성 및 변경**

```bash
cd $WIKI_PATH
git checkout -b contrib/{프로젝트슬러그}-{변경설명}
# 파일 수정 (UPDATE-step3 내용)
git add -A
git commit -m "[{프로젝트슬러그}] 변경 요약"
git push origin contrib/{프로젝트슬러그}-{변경설명}
```

push 인증 오류 시 → 사용자에게 git 인증 설정 안내 (SSH 키 또는 git credential manager).

**Step 3 — 부모 프로젝트 서브모듈 ref 갱신**

```bash
cd <소스프로젝트-루트>
git add {WIKI_PATH}
git commit -m "chore: update wiki ref"
```

**Step 4 — 결과 안내**

```
✅ 변경사항이 push되었습니다.

브랜치: contrib/{슬러그}-{설명}

PR/MR 생성:
  GitHub: https://github.com/{repo}/compare/contrib/{브랜치명}?expand=1
  GitLab: {url}/-/merge_requests/new?merge_request[source_branch]=contrib/{브랜치명}

Merge 후 서브모듈을 최신화하려면:
  git submodule update --remote {WIKI_PATH}
  git add {WIKI_PATH} && git commit -m "chore: update wiki ref"
```

**무조건 원격 리포지토리에 반영되어야 한다.** 로컬 커밋만으로 종료하지 않는다.
