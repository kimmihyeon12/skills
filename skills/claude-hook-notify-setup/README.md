# claude-hook-notify-setup

Claude Code가 작업을 마치거나 확인이 필요할 때 OS 네이티브 토스트 알림을 받을 수 있도록 hook을 설정하는 스킬.

[node-notifier](https://github.com/mikaelbr/node-notifier) 기반으로 Windows / macOS / Linux 모두 지원한다.

## 알림 종류

| 상황 | 내용 |
|------|------|
| 작업 완료 | 마지막 응답 요약 (최대 300자) |
| 권한 요청 (Bash 등) | 실행 명령어 |
| 확인 요청 (AskUserQuestion) | 질문 텍스트 |
| 시스템 알림 | 알림 메시지 |

## 설치

### 1. 스크립트 배포

```bash
SKILL_PATH="<this-skill-directory>"
TARGET=~/.claude/skills/claude-hook-notify-setup/scripts

mkdir -p "$TARGET"
cp "$SKILL_PATH/scripts/notify.js" "$TARGET/"
cp "$SKILL_PATH/scripts/package.json" "$TARGET/"
cd "$TARGET" && npm install
```

### 2. `~/.claude/settings.json` 수정

```json
{
  "hooks": {
    "Stop": [
      { "hooks": [{ "type": "command", "command": "node ~/.claude/skills/claude-hook-notify-setup/scripts/notify.js stop" }] }
    ],
    "Notification": [
      { "hooks": [{ "type": "command", "command": "node ~/.claude/skills/claude-hook-notify-setup/scripts/notify.js notification" }] }
    ],
    "PermissionRequest": [
      { "hooks": [{ "type": "command", "command": "node ~/.claude/skills/claude-hook-notify-setup/scripts/notify.js permission" }] }
    ]
  }
}
```

> Windows는 `~` 대신 절대 경로 사용: `C:/Users/<username>/.claude/...`

## 제거

```bash
rm -rf ~/.claude/skills/claude-hook-notify-setup
```

`~/.claude/settings.json`에서 hooks 블록 삭제.

---

> 이 스킬은 [claude-hook-notify-setup](https://github.com/dev-goraebap/skills/blob/master/skills/claude-hook-notify-setup)으로 만들어졌습니다.
