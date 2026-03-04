---
name: vscode-claude-notify
description: "VSCode Claude 익스텐션은 알림 hook이 Windows/macOS 모두에서 발화하지 않는 알려진 버그가 있다. 이 스킬은 OS 네이티브 알림(Windows BalloonTip, macOS 알림 센터)으로 우회하여 작업 완료·오류 발생 시 알림을 받을 수 있도록 hooks를 설정한다. 사용자가 'Claude 알림 설정', '작업 완료 알림', 'VSCode 알림 안 와요', 'hooks 알림', 'Claude 끝나면 알려줘' 등을 언급하면 이 스킬을 사용한다. Windows(WSL 포함)와 macOS 모두 지원한다."
---

# VSCode Claude Code 알림 설정

VSCode Claude 익스텐션은 `Notification` hook이 Windows/macOS 모두에서 발화하지 않는 버그가 있다.
이 스킬은 OS 네이티브 알림으로 우회해 `Stop`(작업 완료)과 `PostToolUseFailure`(오류) 이벤트를 알려준다.

스킬 `scripts/` 폴더에 플랫폼별 알림 스크립트가 번들되어 있다.
설치 경로: `~/.claude/skills/vscode-claude-notify/scripts/`
hooks에서 이 경로를 직접 참조하므로 별도 파일 복사가 필요 없다.

---

## 1단계: 환경 확인

```bash
uname -s && uname -r
```

| 출력 | 환경 | 사용 스크립트 |
|------|------|--------------|
| `Linux` + `microsoft` 포함 | WSL | `notify-wsl.sh` |
| `Darwin` | macOS | `notify-mac.sh` |
| Windows PowerShell / Git Bash | Windows native | `notify-windows.ps1` |

---

## 2단계: 실행 권한 부여

WSL / macOS에서 한 번만 실행:

```bash
chmod +x ~/.claude/skills/vscode-claude-notify/scripts/notify-wsl.sh
chmod +x ~/.claude/skills/vscode-claude-notify/scripts/notify-mac.sh
```

---

## 3단계: hooks 설정

전역 또는 프로젝트 범위를 선택한다. 별도 언급 없으면 전역을 기본으로 한다.

| 범위 | 파일 위치 | 설명 |
|------|-----------|------|
| **전역** (기본) | `~/.claude/settings.json` | 모든 프로젝트에 적용 |
| **프로젝트** | `.claude/settings.json` | 현재 프로젝트만 적용 |

플랫폼별 hooks JSON은 `references/hooks-config.md` 참고.
기존 `settings.json`이 있으면 `hooks` 키만 병합하고 다른 설정은 건드리지 않는다.

---

## 4단계: 동작 확인

```bash
# WSL
~/.claude/skills/vscode-claude-notify/scripts/notify-wsl.sh "Claude Code" "테스트 알림"

# macOS
~/.claude/skills/vscode-claude-notify/scripts/notify-mac.sh "Claude Code" "테스트 알림"
```

알림이 뜨면 성공이다.

---

## 5단계: VSCode 재시작

hooks 설정 반영을 위해 VSCode를 재시작한다.

```
Ctrl+Shift+P  →  "Developer: Reload Window"  →  Enter
```
