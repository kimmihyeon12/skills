# Windows native 환경: BalloonTip 알림 전송
param(
    [string]$Title = "Claude Code",
    [string]$Message = "알림"
)

Add-Type -AssemblyName System.Windows.Forms
$n = New-Object System.Windows.Forms.NotifyIcon
$n.Icon = [System.Drawing.SystemIcons]::Information
$n.Visible = $true
$n.ShowBalloonTip(4000, $Title, $Message, [System.Windows.Forms.ToolTipIcon]::Info)
Start-Sleep -Seconds 5
$n.Dispose()
