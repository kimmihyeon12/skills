---
name: claude-discord-hook
description: >
  Claude Code hook을 Discord Bot과 연동하는 스킬.
  작업 완료 알림, 권한 요청 시 Discord에서 승인/거부 버튼으로 원격 제어 가능.
  Discord에서 !run 명령으로 Claude Code에 직접 명령 전송, 실시간 진행 상황 확인.
  트리거: "디코 알림 설정", "discord hook 설정", "원격 승인 설정", "디스코드 알림"
license: Apache-2.0
compatibility: Claude Code
metadata:
  version: "2.0"
---

# claude-discord-hook

Claude Code의 알림과 권한 요청을 Discord로 받고, 승인/거부를 원격으로 제어한다.
Discord에서 `!run` 명령으로 Claude Code에 직접 명령을 보낼 수도 있다.

## 동작 방식

### Hook 연동

| hook | 발화 시점 | Discord 메시지 |
|------|-----------|---------------|
| `Stop` | Claude 턴 종료 | 프로젝트명 / 마지막 응답 요약 (300자) |
| `Notification` | 시스템 알림 | 알림 메시지 |
| `PermissionRequest` | 도구 실행 권한 요청 시 | 승인/거부 버튼 포함 메시지 |

> 권한 요청 시 Discord에서 120초 내 버튼을 누르지 않으면 로컬 권한 다이얼로그로 폴백.
> CLI에서 직접 승인/거부 시 Discord 버튼은 자동으로 "CLI에서 처리됨"으로 변경.

### Discord → Claude Code 명령 실행

| 명령 | 설명 |
|------|------|
| `!run <명령>` | Claude Code에 명령 전송 (기본 프로젝트) |
| `!run project명: <명령>` | 특정 프로젝트에 명령 전송 |
| `!cancel` | 실행 중인 작업 취소 |
| `!projects` | 등록된 프로젝트 목록 |

- 다중 프로젝트 등록 시 **버튼으로 프로젝트 선택**
- 실행 중 **5초마다 실시간 진행 상황** 업데이트
- 성공/실패 시 **결과 embed**로 표시

## 사전 준비 (Discord Bot 생성)

### 1. Discord 서버 만들기
- Discord 앱에서 좌측 `+` 버튼 → 서버 만들기

### 2. Webhook으로 채널 ID 확인
- 채널 우클릭 → 채널 편집 → 연동 → 웹후크 → 새 웹후크 → 웹후크 URL 복사
- URL에 접속하면 `channel_id` 확인 가능:
  ```bash
  curl -s "YOUR_WEBHOOK_URL"
  ```

### 3. Discord Bot 생성
1. [Discord Developer Portal](https://discord.com/developers/applications) 접속
2. **New Application** → 이름 입력 → Create
3. 왼쪽 **Bot** 메뉴:
   - **Reset Token** → 토큰 복사 (이후 `config.json`에 사용)
   - **MESSAGE CONTENT INTENT** 토글 ON → Save Changes
4. 왼쪽 **OAuth2** 메뉴 → **URL Generator**:
   - SCOPES: `bot` 체크
   - BOT PERMISSIONS: `View Channels`, `Send Messages`, `Read Message History` 체크
   - 생성된 URL을 브라우저에서 열어 서버에 Bot 초대

## 설치

### 1. 스크립트 배포 및 초기 설정

```bash
SKILL_DIR=~/.claude/skills/claude-discord-hook
mkdir -p "$SKILL_DIR/scripts"
cp scripts/bot.js scripts/notify.js scripts/package.json scripts/setup.js "$SKILL_DIR/scripts/"
cp config.example.json "$SKILL_DIR/config.example.json"
cd "$SKILL_DIR" && node scripts/setup.js
```

설정 마법사가 다음을 물어봅니다:
- Discord Bot Token
- Discord Channel ID
- HTTP Port (기본: 47391)
- Claude CLI 경로 (기본: claude)
- 프로젝트 이름과 경로 (여러 개 등록 가능)
- 기본 프로젝트

### 2. config.json 수동 설정 (선택)

설정 마법사 대신 직접 수정할 수도 있습니다:

```json
{
  "botToken": "YOUR_DISCORD_BOT_TOKEN",
  "channelId": "YOUR_DISCORD_CHANNEL_ID",
  "httpPort": 47391,
  "projects": {
    "my-app": "/path/to/my-app",
    "backend": "/path/to/backend"
  },
  "defaultProject": "my-app",
  "claudePath": "claude"
}
```

| 필드 | 설명 | 필수 |
|------|------|------|
| `botToken` | Discord Bot 토큰 | O |
| `channelId` | 알림 받을 채널 ID | O |
| `httpPort` | HTTP 서버 포트 | X (기본 47391) |
| `projects` | 프로젝트 이름 → 경로 매핑 | X |
| `defaultProject` | 기본 프로젝트 이름 | X |
| `claudePath` | Claude CLI 경로 | X (기본 "claude") |

### 3. ~/.claude/settings.json에 hooks 등록

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node <HOME>/.claude/skills/claude-discord-hook/scripts/notify.js stop"
          }
        ]
      }
    ],
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node <HOME>/.claude/skills/claude-discord-hook/scripts/notify.js notification"
          }
        ]
      }
    ],
    "PermissionRequest": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node <HOME>/.claude/skills/claude-discord-hook/scripts/notify.js permission"
          }
        ]
      }
    ]
  }
}
```

> `<HOME>`을 실제 경로로 교체. Windows: `C:/Users/<username>`, macOS/Linux: `/Users/<username>` 또는 `/home/<username>`

### 4. Bot 자동 실행

#### Windows
`shell:startup` 폴더에 `.vbs` 파일 생성:
```vbs
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "node <HOME>\.claude\skills\claude-discord-hook\scripts\bot.js", 0, False
```

#### macOS / Linux
```bash
# systemd, launchd, 또는 crontab @reboot 사용
@reboot node ~/.claude/skills/claude-discord-hook/scripts/bot.js &
```

> **주의**: Claude Code 세션 내에서 Bot을 시작하면 CLAUDE* 환경변수가 상속되어 `!run` 명령이 실패합니다.
> 별도 터미널에서 실행하거나, 자동 시작 스크립트를 사용하세요.

## 수동 Bot 실행

```bash
node ~/.claude/skills/claude-discord-hook/scripts/bot.js
```

## 제거

```bash
rm -rf ~/.claude/skills/claude-discord-hook
```

`~/.claude/settings.json`에서 hooks 블록과 시작 프로그램 스크립트도 함께 삭제.
