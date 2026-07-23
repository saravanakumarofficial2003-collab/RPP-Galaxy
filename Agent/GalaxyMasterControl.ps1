# ======================================================================
# RPP BEAST GALAXY – GALAXY MASTER CONTROL (LIVE CORE ONLY)
# ======================================================================

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
$ErrorActionPreference = "SilentlyContinue"

# ---------------- PATHS ----------------
$ROOT  = "C:\RPP_GALAXY"
$AGENT = "$ROOT\Agent"
$LOGS  = "$ROOT\Logs"

$MASTER_LOG = "$LOGS\GalaxyMaster.log"

# ---------------- LOG ----------------
function Write-GalaxyLog {
    param([string]$Message)
    $t = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $MASTER_LOG -Value "$t | $Message"
}

Write-GalaxyLog "GALAXY MASTER CONTROL STARTED (LIVE CORE MODE)"

# ---------------- START TELEMETRY AGENT (ONLY ONE) ----------------
Start-Process powershell `
    -ArgumentList "-ExecutionPolicy Bypass -File `"$AGENT\GalaxyTelemetryAgent.ps1`"" `
    -WindowStyle Hidden

Write-GalaxyLog "LIVE Telemetry Agent launched"

# ---------------- KEEP MASTER ALIVE ----------------
while ($true) {
    Write-GalaxyLog "MASTER HEARTBEAT"
    Start-Sleep -Seconds 30
}
