# 공유 — 링크 만들기

만든 것을 링크 하나로 전달한다. 상황에 맞는 방법을 고른다.

---

## 상황별 빠른 선택

| 상황 | 방법 | 소요 시간 |
|------|------|-----------|
| 로컬 서버 실행 중, 지금 바로 링크 필요 | cloudflared 터널 | ~10초 |
| 단일 HTML 파일 | CodePen 붙여넣기 | ~30초 |
| 빌드된 정적 파일, 기억하기 쉬운 URL | Surge.sh | ~1분 |
| 프레임워크 프로젝트, 자동 빌드 배포 | Vercel CLI | ~2분 |
| GitHub 레포가 있음 | StackBlitz 링크 | 즉시 |

---

## 방법별 상세

### cloudflared — 로컬 서버를 즉시 외부 공개

가입 불필요. 대역폭 무제한. 인터스티셜 없음.

```bash
# 설치 (최초 1회)
npm install -g cloudflared
# 또는 npx로 설치 없이 실행
npx cloudflared tunnel --url localhost:3000

# 실행 (PORT는 로컬 서버 포트)
cloudflared tunnel --url localhost:PORT
```

터미널에 출력된 `https://xxxx.trycloudflare.com` URL을 공유한다.

**주의**: 서버를 끄면 URL도 사라진다. 회의 중 실시간 데모에 적합하다.

---

### CodePen — 단일 HTML 파일을 브라우저에서 바로 공유

```
1. codepen.io 접속 → "Create Pen"
2. HTML 패널에 파일 내용 붙여넣기
3. Save → 우측 상단 Share → "Copy Link"
```

URL 형태: `https://codepen.io/username/pen/xYzAbC`

**주의**: 로그인하지 않으면 URL이 영구적으로 유지되지 않을 수 있다.

---

### Surge.sh — 빌드된 파일을 영구 URL로 배포

정적 파일 전용. 도메인을 직접 지정할 수 있어 기억하기 쉽다.

```bash
# 설치 (최초 1회)
npm install -g surge

# 배포 (최초 실행 시 이메일/비밀번호 등록)
surge ./dist my-prototype.surge.sh

# 삭제
surge teardown my-prototype.surge.sh
```

URL 형태: `https://my-prototype.surge.sh`

**팁**: 도메인 이름에 프로젝트명이나 날짜를 넣으면 구분하기 쉽다.
예: `surge ./dist onboarding-v2-0227.surge.sh`

---

### Vercel CLI — 프레임워크 프로젝트 자동 빌드 배포

React, Vue, Svelte, Next.js 등 프레임워크를 자동 감지해 빌드하고 배포한다.

```bash
# 설치 (최초 1회)
npm install -g vercel

# 로그인 (최초 1회)
vercel login

# 프로젝트 루트에서 실행 (프레임워크 자동 감지)
vercel

# 이미 빌드된 폴더만 배포
vercel ./dist
```

URL 형태: `https://project-name-xxx.vercel.app`

---

### StackBlitz — GitHub 레포를 링크 하나로 공유

GitHub에 레포가 있으면 URL만 바꿔서 즉시 공유한다.

```
https://stackblitz.com/github/[username]/[repo]
```

예:
```
https://stackblitz.com/github/my-org/onboarding-prototype
```

---

## 공유 전 체크리스트

- [ ] 링크를 직접 열어서 제대로 보이는지 확인했다
- [ ] 모바일로 확인이 필요하면 실제 기기에서 열어봤다
- [ ] 보는 사람이 별도 설치나 로그인 없이 볼 수 있다
- [ ] 링크와 함께 "이게 뭔지" 한 줄 설명을 붙였다
