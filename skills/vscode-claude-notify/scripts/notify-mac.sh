#!/bin/bash
# macOS 환경: osascript를 통해 네이티브 알림 전송
TITLE="${1:-Claude Code}"
MESSAGE="${2:-알림}"

osascript -e "display notification \"$MESSAGE\" with title \"$TITLE\" sound name \"Glass\""
