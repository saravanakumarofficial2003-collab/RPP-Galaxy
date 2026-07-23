# ============================================================
#  BEAST GALAXY – GHOST ENGINE
#  File: GhostEngine.ps1
#  Role: Silent auto-healing & auto-fix engine
# ============================================================

Set-StrictMode -Off
$ErrorActionPreference = "SilentlyContinue"

# ------------------------------------------------------------
# LOG FUNCTION
# ------------------------------------------------------------
function Write-GhostLog {
    param([string]$Message)

    $logPath = "C:\RPP_GALAXY\Logs\GhostEngine.log"
    try {
        $time = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        Add-Content -Path $logPath -Value "$time | $Message"
    } catch {}
}

# ------------------------------------------------------------
# MAIN GHOST ENGINE
# ------------------------------------------------------------
function Invoke-GhostEngine {

    param(
        [int]$CPU = 0,
        [int]$RAM = 0,
        [int]$Disk = 0,
        [int]$Temp = 0,
        [int]$Latency = 0
    )

    Write-GhostLog "GhostEngine invoked | CPU=$CPU RAM=$RAM Disk=$Disk Temp=$Temp Latency=$Latency"

    $actions = @()

    # -------------------------------
    # HIGH CPU
    # -------------------------------
    if ($CPU -ge 90) {
        try {
            Get-Process |
                Where-Object { $_.CPU -gt 100 -and $_.ProcessName -notmatch "System|Idle" } |
                Stop-Process -Force
            $actions += "High CPU processes terminated"
        } catch {}
    }

    # -------------------------------
    # HIGH RAM
    # -------------------------------
    if ($RAM -ge 90) {
        try {
            Get-Process |
                Sort-Object WorkingSet -Descending |
                Select-Object -First 5 |
                Stop-Process -Force
            $actions += "RAM pressure reduced"
        } catch {}
    }

    # -------------------------------
    # DISK PRESSURE
    # -------------------------------
    if ($Disk -ge 90) {
        try {
            Get-ChildItem "$env:TEMP" -Recurse -Force |
                Remove-Item -Recurse -Force
            $actions += "Disk cleanup executed"
        } catch {}
    }

    # -------------------------------
    # OVERHEAT
    # -------------------------------
    if ($Temp -ge 80) {
        try {
            powercfg /setactive SCHEME_BALANCED | Out-Null
            $actions += "Power mode reduced due to heat"
        } catch {}
    }

    # -------------------------------
    # NETWORK LATENCY
    # -------------------------------
    if ($Latency -ge 150) {
        try {
            ipconfig /flushdns | Out-Null
            netsh int ip reset | Out-Null
            $actions += "Network stack reset"
        } catch {}
    }

    if ($actions.Count -eq 0) {
        $actions += "No action required"
    }

    Write-GhostLog "Actions: $($actions -join '; ')"

    return @{
        Engine  = "GhostEngine"
        Status  = "COMPLETED"
        Actions = ($actions -join "; ")
        Time    = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    }
}

# ------------------------------------------------------------
# SELF TEST
# ------------------------------------------------------------
function Test-GhostEngine {
    Invoke-GhostEngine -CPU 95 -RAM 92 -Disk 91 -Temp 85 -Latency 180
}

Write-Host "GhostEngine Loaded Successfully" -ForegroundColor Cyan
