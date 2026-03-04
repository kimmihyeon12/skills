#!/bin/bash
# WSL 환경: powershell.exe를 통해 Windows BalloonTip 알림 전송
TITLE="${1:-Claude Code}"
MESSAGE="${2:-알림}"

powershell.exe -Command "
  Add-Type -AssemblyName System.Windows.Forms
  \$n = New-Object System.Windows.Forms.NotifyIcon
  \$n.Icon = [System.Drawing.SystemIcons]::Information
  \$n.Visible = \$true
  \$n.ShowBalloonTip(4000, '$TITLE', '$MESSAGE', [System.Windows.Forms.ToolTipIcon]::Info)
  Start-Sleep -Seconds 5
  \$n.Dispose()
" 2>/dev/null &
