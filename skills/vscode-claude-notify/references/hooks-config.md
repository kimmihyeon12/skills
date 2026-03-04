# Hooks 설정 가이드

스크립트는 `~/.claude/skills/vscode-claude-notify/scripts/`에 번들되어 있다.
별도 파일 복사 없이 이 경로를 hooks에서 직접 참조한다.

---

## WSL 환경

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/skills/vscode-claude-notify/scripts/notify-wsl.sh 'Claude Code'"
          }
        ]
      }
    ],
    "PostToolUseFailure": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/skills/vscode-claude-notify/scripts/notify-wsl.sh 'Claude Code' '도구 실행 중 오류가 발생했습니다'"
          }
        ]
      }
    ]
  }
}
```

---

## macOS 환경

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/skills/vscode-claude-notify/scripts/notify-mac.sh 'Claude Code'"
          }
        ]
      }
    ],
    "PostToolUseFailure": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/skills/vscode-claude-notify/scripts/notify-mac.sh 'Claude Code' '도구 실행 중 오류가 발생했습니다'"
          }
        ]
      }
    ]
  }
}
```

---

## Windows native 환경 (PowerShell / Git Bash)

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "powershell.exe -ExecutionPolicy Bypass -File \"%USERPROFILE%\\.claude\\skills\\vscode-claude-notify\\scripts\\notify-windows.ps1\" -Title \"Claude Code\""
          }
        ]
      }
    ],
    "PostToolUseFailure": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "powershell.exe -ExecutionPolicy Bypass -File \"%USERPROFILE%\\.claude\\skills\\vscode-claude-notify\\scripts\\notify-windows.ps1\" -Title \"Claude Code\" -Message \"오류 발생\""
          }
        ]
      }
    ]
  }
}
```

---

## 범위 선택

기존 `settings.json`이 있으면 `hooks` 키만 병합하고 다른 설정은 건드리지 않는다.

| 범위 | 파일 위치 | 설명 |
|------|-----------|------|
| **전역** (기본) | `~/.claude/settings.json` | 모든 프로젝트에 적용 |
| **프로젝트** | `.claude/settings.json` | 현재 프로젝트만 (Git 커밋 가능) |

---

## 이벤트 설명

| 이벤트 | 발생 시점 | VSCode 지원 |
|--------|-----------|------------|
| `Stop` | Claude 응답 완료 | ✅ |
| `PostToolUseFailure` | 도구 실행 실패 | ✅ |
| `Notification` | 입력 대기, 권한 요청 | ❌ Windows/Mac 모두 버그 |

`Notification`은 CLI 터미널 모드에서는 정상 동작한다.
