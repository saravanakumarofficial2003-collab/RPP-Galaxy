# ============================================================
#  BEAST GALAXY – AI PREDICTOR (48 HOURS)
#  File : AIPredictor48H.ps1
#  Role : Predict failure probability within next 48 hours
# ============================================================

Set-StrictMode -Off
$ErrorActionPreference = "SilentlyContinue"

# ------------------------------------------------------------
# LOGGING
# ------------------------------------------------------------
function Write-AIPredictLog {
    param([string]$Message)

    $logPath = "C:\RPP_GALAXY\Logs\AIPredictor48H.log"
    try {
        $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        Add-Content -Path $logPath -Value "$ts | $Message"
    } catch {}
}

# ------------------------------------------------------------
# MAIN AI PREDICTOR FUNCTION
# ------------------------------------------------------------
function Invoke-AI48HPredictor {

    param(
        [int]$CPU = 0,
        [int]$RAM = 0,
        [int]$Disk = 0,
        [int]$Temp = 0,
        [int]$Latency = 0,
        [int]$PacketLoss = 0,
        [int]$BootDays = 0
    )

    $score   = 0
    $reasons = @()
    $actions = @()

    # ---------------- CPU ----------------
    if ($CPU -ge 90) {
        $score += 20
        $reasons += "High CPU load"
        $actions += "Close heavy applications"
    }

    # ---------------- RAM ----------------
    if ($RAM -ge 90) {
        $score += 20
        $reasons += "RAM almost full"
        $actions += "Upgrade RAM or reduce background apps"
    }

    # ---------------- DISK ----------------
    if ($Disk -ge 90) {
        $score += 25
        $reasons += "Disk almost full"
        $actions += "Clean disk or upgrade to SSD"
    }

    # ---------------- TEMP ----------------
    if ($Temp -ge 80) {
        $score += 15
        $reasons += "High temperature"
        $actions += "Check cooling and airflow"
    }

    # ---------------- NETWORK ----------------
    if ($PacketLoss -ge 20) {
        $score += 10
        $reasons += "Packet loss detected"
        $actions += "Check LAN cable or switch port"
    }

    if ($Latency -ge 150) {
        $score += 10
        $reasons += "High network latency"
        $actions += "Investigate network congestion"
    }

    # ---------------- BOOT AGE ----------------
    if ($BootDays -ge 14) {
        $score += 10
        $reasons += "System not restarted recently"
        $actions += "Schedule system restart"
    }

    if ($score -gt 100) { $score = 100 }

    # --------------------------------------------------------
    # FAILURE WINDOW DECISION (ASCII ONLY — NO DASH BUG)
    # --------------------------------------------------------
    $window = "STABLE"

    if ($score -ge 80) {
        $window = "FAILURE LIKELY IN 12 TO 24 HOURS"
    }
    elseif ($score -ge 60) {
        $window = "FAILURE POSSIBLE IN 24 TO 48 HOURS"
    }
    elseif ($score -ge 40) {
        $window = "DEGRADATION POSSIBLE"
    }

    if ($reasons.Count -eq 0) {
        $reasons += "No major risk indicators"
        $actions += "System healthy"
    }

    Write-AIPredictLog "Score=$score Window=$window"

    return @{
        Engine          = "AIPredictor48H"
        RiskScore       = $score
        FailureWindow   = $window
        Reasons         = ($reasons -join "; ")
        Recommendations = ($actions -join "; ")
        Timestamp       = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    }
}

# ------------------------------------------------------------
# SELF TEST
# ------------------------------------------------------------
function Test-AI48HPredictor {
    Invoke-AI48HPredictor `
        -CPU 92 `
        -RAM 88 `
        -Disk 91 `
        -Temp 82 `
        -Latency 160 `
        -PacketLoss 15 `
        -BootDays 20
}

Write-Host "AI Predictor 48H Engine Loaded Successfully" -ForegroundColor Green
