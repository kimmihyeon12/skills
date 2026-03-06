# HTML/CSS/JS 프리뷰 빌드 패턴

순수 HTML/CSS/JS만 사용한다. 프레임워크, 외부 CDN, 라이브러리 없음.

---

## 기본 원칙

- **인라인**: CSS는 `<style>`, JS는 `<script>`를 각 HTML 파일에 포함. 외부 파일 분리 안 함
- **목업 데이터**: API 연결 없이 JS 변수에 하드코딩
- **해피 패스만**: 에러 처리, 빈 상태, 예외 케이스 없음
- **Form 유효성 없음**: 입력 없이도 다음 화면으로 이동 가능

---

## 기본 HTML 템플릿

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>화면명</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
           background: #f5f5f5; color: #111; min-height: 100vh; }
    .container { max-width: 480px; margin: 0 auto; padding: 24px 16px; }
    /* 화면별 스타일 */
  </style>
</head>
<body>
  <div class="container">
    <!-- UI -->
  </div>
  <script>
    // 목업 데이터 및 화면 전환 로직
  </script>
</body>
</html>
```

---

## 화면 간 이동

```html
<!-- 링크로 이동 -->
<a href="02-list.html">목록 보기</a>

<!-- 버튼으로 이동 -->
<button onclick="location.href='03-detail.html'">상세 보기</button>

<!-- 파라미터 전달 -->
<button onclick="location.href='03-detail.html?id=1'">항목 1 상세</button>

<!-- 뒤로 가기 -->
<button onclick="history.back()">← 뒤로</button>

<!-- index로 돌아가기 -->
<button onclick="location.href='index.html'">홈으로</button>
```

**파라미터 읽기:**
```javascript
const params = new URLSearchParams(location.search);
const id = params.get('id'); // '1'
```

---

## Form 처리 (유효성 검사 없음)

입력 내용에 관계없이 버튼 클릭 시 즉시 다음 화면으로 이동한다.

```html
<form onsubmit="return false;">
  <div class="field">
    <label>이메일</label>
    <input type="email" placeholder="example@email.com">
  </div>
  <div class="field">
    <label>비밀번호</label>
    <input type="password" placeholder="비밀번호 입력">
  </div>
  <button type="button" onclick="location.href='02-dashboard.html'">
    로그인
  </button>
</form>
```

---

## 목업 데이터 패턴

```javascript
// 목록 데이터
const items = [
  { id: 1, title: '항목 A', status: '진행중', date: '2025-03-01' },
  { id: 2, title: '항목 B', status: '완료', date: '2025-03-02' },
  { id: 3, title: '항목 C', status: '대기', date: '2025-03-03' },
];

// 상세 데이터
const detail = {
  id: 1, title: '항목 A', description: '상세 설명 텍스트',
  author: '홍길동', createdAt: '2025-03-01'
};
```

---

## 목록 동적 렌더링

```html
<ul id="list"></ul>
<script>
  const items = [
    { id: 1, title: '항목 A' },
    { id: 2, title: '항목 B' },
  ];

  document.getElementById('list').innerHTML = items.map(item => `
    <li onclick="location.href='03-detail.html?id=${item.id}'"
        style="padding:12px; border-bottom:1px solid #eee; cursor:pointer;">
      ${item.title}
    </li>
  `).join('');
</script>
```

---

## index.html — 화면 목록 허브

모든 화면으로 가는 진입점. 첫 화면이 명확하면 그 화면을 보여주고, 명확하지 않으면 허브로 사용한다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>프리뷰</title>
  <style>
    body { font-family: sans-serif; max-width: 400px; margin: 40px auto; padding: 0 16px; }
    h1 { font-size: 18px; margin-bottom: 24px; color: #333; }
    a { display: block; padding: 12px 16px; margin: 8px 0;
        background: #fff; border: 1px solid #ddd; border-radius: 8px;
        text-decoration: none; color: #111; }
    a:hover { background: #f0f0f0; }
    .badge { font-size: 11px; color: #888; margin-left: 8px; }
  </style>
</head>
<body>
  <h1>화면 목록</h1>
  <a href="01-login.html">로그인 <span class="badge">SC-01-01</span></a>
  <a href="02-dashboard.html">대시보드 <span class="badge">SC-02-01</span></a>
  <a href="03-list.html">목록 <span class="badge">SC-02-02</span></a>
  <a href="04-detail.html">상세 <span class="badge">SC-02-03</span></a>
</body>
</html>
```

---

## 파일 구조

```
preview/
├── index.html          ← 허브 (화면 목록)
├── 01-login.html
├── 02-dashboard.html
├── 03-list.html
├── 04-detail.html
└── extracted/          ← PDF 입력 시만
    └── source.txt
```

파일명: `[전체순번]-[영문화면명].html` (2자리 zero-padding)

---

## 자주 쓰는 UI 컴포넌트 패턴

### 상단 네비게이션 바

```html
<nav style="background:#fff; border-bottom:1px solid #eee; padding:12px 16px;
            display:flex; align-items:center; gap:12px;">
  <button onclick="history.back()"
          style="background:none; border:none; font-size:18px; cursor:pointer;">←</button>
  <span style="font-weight:600;">화면 제목</span>
</nav>
```

### 카드

```html
<div style="background:#fff; border-radius:12px; padding:16px;
            box-shadow:0 1px 4px rgba(0,0,0,0.08); margin-bottom:12px;">
  <h3 style="font-size:15px; margin-bottom:6px;">카드 제목</h3>
  <p style="color:#666; font-size:13px;">카드 내용</p>
</div>
```

### 주요 버튼

```html
<button onclick="location.href='next.html'"
        style="width:100%; padding:14px; background:#111; color:#fff;
               border:none; border-radius:8px; font-size:15px; cursor:pointer;">
  다음으로
</button>
```

### 탭

```html
<div style="display:flex; border-bottom:1px solid #eee; margin-bottom:16px;">
  <button onclick="showTab('a')"
          style="flex:1; padding:10px; border:none; background:none;
                 border-bottom:2px solid #111; font-weight:600; cursor:pointer;">
    탭 A
  </button>
  <button onclick="showTab('b')"
          style="flex:1; padding:10px; border:none; background:none; cursor:pointer;">
    탭 B
  </button>
</div>
<script>
  function showTab(name) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.getElementById('tab-' + name).style.display = 'block';
  }
</script>
```
