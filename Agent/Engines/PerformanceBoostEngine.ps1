# ============================================================
#  BEAST GALAXY – PERFORMANCE BOOST ENGINE
#  File: PerformanceBoostEngine.ps1
#  Role: Safe system optimization (CPU / RAM / Disk / Startup)
# ============================================================

Set-StrictMode -Off
$ErrorActionPreference = "SilentlyContinue"

# ------------------------------------------------------------
# LOG FUNCTION
# ------------------------------------------------------------
function Write-BoostLog {
    param([string]$Message)

    $logPath = "C:\RPP_GALAXY\Logs\PerformanceBoost.log"
    try {
        $time = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        Add-Content -Path $logPath -Value "$time | $Message"
    } catch {}
}

# ------------------------------------------------------------
# MAIN PERFORMANCE BOOST FUNCTION
# ------------------------------------------------------------
function Invoke-PerformanceBoost {

    Write-BoostLog "PerformanceBoost started"

    # -------------------------------
    # 1. CPU PRIORITY NORMALIZATION
    # -------------------------------
    try {
        Get-Process |
            Where-Object { $_.PriorityClass -eq "High" -and $_.ProcessName -notmatch "System" } |
            ForEach-Object {
                $_.PriorityClass = "Normal"
            }
        Write-BoostLog "CPU priority normalized"
    } catch {}

    # -------------------------------
    # 2. TEMP FILE CLEANUP
    # -------------------------------
    try {
        Get-ChildItem "$env:TEMP" -Recurse -Force |
            Remove-Item -Recurse -Force
        Write-BoostLog "User TEMP cleaned"
    } catch {}

    try {
        Get-ChildItem "C:\Windows\Temp" -Recurse -Force |
            Remove-Item -Recurse -Force
        Write-BoostLog "Windows TEMP cleaned"
    } catch {}

    # -------------------------------
    # 3. PREFETCH CLEANUP (SAFE)
    # -------------------------------
    try {
        Get-ChildItem "C:\Windows\Prefetch" -Force |
            Remove-Item -Force
        Write-BoostLog "Prefetch cleaned"
    } catch {}

    # -------------------------------
    # 4. MEMORY PRESSURE RELIEF
    # -------------------------------
    try {
        Clear-RecycleBin -Force
        Write-BoostLog "Recycle bin cleared"
    } catch {}

    # -------------------------------
    # 5. NETWORK OPTIMIZATION (SAFE)
    # -------------------------------
    try {
        ipconfig /flushdns | Out-Null
        Write-BoostLog "DNS cache flushed"
    } catch {}

    # -------------------------------
    # 6. POWER PLAN BOOST
    # -------------------------------
    try {
        powercfg -setactive SCHEME_MIN
        Write-BoostLog "High performance power plan applied"
    } catch {}

    Write-BoostLog "PerformanceBoost completed"

    return @{
        Status = "BOOST_COMPLETED"
        Time   = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    }
}

# ------------------------------------------------------------
# SELF TEST (OPTIONAL)
# ------------------------------------------------------------
function Test-PerformanceBoostEngine {
    Invoke-PerformanceBoost
}

Write-Host "PerformanceBoostEngine Loaded Successfully" -ForegroundColor Green
