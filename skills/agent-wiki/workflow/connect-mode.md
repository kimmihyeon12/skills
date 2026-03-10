# CONNECT 모드 — 서브모듈 연결

기존 위키 리포지토리를 소스코드 프로젝트에 git 서브모듈로 연결한다.

---

## 사전 확인

| 상황 | 처리 |
|------|------|
| CWD에 `AGENTS.md`가 있음 (위키 워크스페이스 자체) | → 중단. 소스코드 프로젝트 디렉토리에서 실행하도록 안내 |
| 소스코드 프로젝트 또는 빈 디렉토리 | → 정상. 진행 |

---

## 연결 절차

```bash
# 서브모듈 추가
git submodule add <remote-url> [project]-wiki

# 서브모듈 초기화 및 내려받기
git submodule update --init
```

연결로 생긴 변경 이력을 커밋한다:

```bash
git add .gitmodules [project]-wiki
git commit -m "chore: add [project]-wiki submodule"
```

---

## 주의사항

- `.gitmodules`는 git이 서브모듈 정보를 추적하는 핵심 파일이다. **`.gitignore`에 추가하지 않는다.**
- 서브모듈 디렉토리(`[project]-wiki/`)는 부모 리포의 특정 커밋을 가리키는 포인터다.
  위키 내용이 업데이트되면 부모 리포의 서브모듈 ref도 함께 갱신해야 한다.

---

## 연결 완료 후

READ 모드로 전환하여 위키 내용을 파악한다 (`workflow/read-mode.md` 참고).

완료 보고:

```
✓ 서브모듈 연결 완료

  위키 경로: [project]-wiki/
  원격: <remote-url>

위키 내용을 파악하려면:
  /agent-wiki 내용 파악해줘
```
