# CREATE 모드 — 워크스페이스 초기화

정보가 모여있는 폴더(또는 빈 폴더)를 git 기반 워크스페이스로 만들고,
CWD를 스캔하여 **그 워크스페이스에 맞는** AGENTS.md를 동적으로 생성한다.

---

## CREATE-step1 — 환경 확인

| 상황 | 처리 |
|------|------|
| CWD에 이미 `AGENTS.md` 있음 | → 중단. UPDATE 모드(`workflow/update-mode.md`) 안내 |
| CWD가 소스코드 프로젝트 (`.gitmodules`, `src/`, `package.json`, `pom.xml` 등 존재) | → 중단. 위키 전용 폴더에서 실행하거나 CONNECT 모드 사용하도록 안내 |
| 빈 폴더이거나 문서/데이터 파일이 있는 폴더 | → 진행 |

---

## CREATE-step2 — 워크스페이스 스캔

CWD의 파일/폴더 구조를 파악한다:

```bash
find . -not -path './.git/*' -not -name '.DS_Store' -not -name 'Thumbs.db' | sort
```

스캔 결과를 분석하여 다음을 파악한다:

| 파악 항목 | 목적 |
|-----------|------|
| 존재하는 파일 유형과 역할 | 어떤 문서들이 있는가 |
| 중심 문서 (가장 먼저 읽어야 할 파일) | 읽기 순서 결정 |
| 디렉토리 구조 | 구조 설명 작성 |
| 기존 패턴 (채번, 파일명, 마크다운 형식) | 작업 안내 작성 |

워크스페이스가 비어있으면 스캔 결과는 "빈 워크스페이스"로 처리한다.

---

## CREATE-step3 — AGENTS.md 동적 생성

스캔 결과를 기반으로 **이 워크스페이스에 맞는** AGENTS.md를 작성한다.
`templates/agents-md.md` 구조를 참고하되, 실제 내용은 스캔 결과 기반으로 작성.

**AGENTS.md 작성 원칙:**
- 짧게 — 내용을 담는 곳이 아니라 **길잡이** (100줄 이내 목표)
- 읽기 순서 명시 — 에이전트가 어디서 시작할지 바로 알 수 있어야 함
- 구조 설명 — 각 파일/폴더의 역할을 한 줄씩
- 작업 안내 — 이 워크스페이스의 규칙·패턴 (파악된 경우)

**비어있는 신규 워크스페이스의 경우:**
"아직 문서가 없음" 상태를 명시하고, 어떤 작업으로 시작할 수 있는지 안내한다.
예: `/agile-doc-creator` 또는 `/ia-doc-creator`로 문서 추가 가능

---

## CREATE-step4 — 기반 파일 생성

```bash
# 기본 디렉토리 및 gitkeep (필요한 경우만)
```

아래 파일이 없으면 템플릿을 참고하여 생성한다. **이미 존재하면 덮어쓰지 않는다.**

| 파일 | 템플릿 |
|------|--------|
| `README.md` | `templates/README.md` |
| `.gitignore` | `templates/.gitignore` |

워크스페이스 이름 규칙은 `references/wiki-agents-guide.md` 참고.

---

## CREATE-step5 — Git 초기화 및 커밋

아직 git 리포가 아닌 경우:

```bash
git init
```

커밋:

```bash
git add -A
git commit -m "chore: 워크스페이스 초기화"
```

완료 후 사용자에게 remote 여부 확인:

> 원격 리포지토리에 연결하시겠습니까? URL을 알려주시면 push까지 완료합니다.

없으면 로컬 커밋만 완료 후 종료.

---

## CREATE-step6 — 원격 연결 및 푸쉬 (선택)

```bash
git remote add origin <url>
git push -u origin main
```

완료 보고:

```
✓ 워크스페이스 초기화 완료

  경로:    {폴더명}
  파일 수: {N}개 스캔됨
  AGENTS.md: 생성됨

다음 단계:
  - 문서 추가:      /agile-doc-creator 또는 /ia-doc-creator
  - 프로젝트 연결:  cd <소스프로젝트> && /agent-wiki <remote-url> 서브모듈 연결해줘
```
