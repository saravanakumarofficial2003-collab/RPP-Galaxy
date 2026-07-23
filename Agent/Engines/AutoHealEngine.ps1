# ===============================================================
# BEAST GALAXY – AUTOHEAL ENGINE V2 (ENTERPRISE)
# Author: S. Saravana Kumar
# Description:
#   Full self-healing engine for Windows systems.
#   Designed for BEAST Galaxy Telemetry Platform.
# ===============================================================

$ErrorActionPreference = "SilentlyContinue"

# ---------------- CONFIG ----------------
$BasePath   = "C:\RPP_GALAXY\Agent"
$LogFile    = "$BasePath\AutoHeal.log"
$ReportFile = "$BasePath\AutoHealReport.json"

# ---------------- LOGGING ----------------
function Write-Log {
    param([string]$Message)
    $time = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $LogFile -Value "$time  $Message"
}

Write-Log "================ AUTOHEAL CYCLE STARTED ================"

# ---------------- SYSTEM INFO ----------------
$OS = Get-CimInstance Win32_OperatingSystem
$CS = Get-CimInstance Win32_ComputerSystem

$TotalRAMMB = [math]::Round($OS.TotalVisibleMemorySize / 1024, 2)
$FreeRAMMB  = [math]::Round($OS.FreePhysicalMemory / 1024, 2)
$UsedRAMMB  = $TotalRAMMB - $FreeRAMMB
$RAMPercent = [math]::Round(($UsedRAMMB / $TotalRAMMB) * 100, 2)

$CPUCounter = Get-Counter '\Processor(_Total)\% Processor Time'
$CPUPercent = [math]::Round($CPUCounter.CounterSamples[0].CookedValue, 2)

$BootTime   = $OS.LastBootUpTime
$UptimeHrs  = [math]::Round((New-TimeSpan -Start $BootTime).TotalHours, 2)

Write-Log "CPU: $CPUPercent% | RAM: $RAMPercent% | Uptime: $UptimeHrs hrs"

# ---------------- HEALTH FLAGS ----------------
$ActionsTaken = @()
$RiskLevel    = "NORMAL"

# ===============================================================
# RAM AUTOHEAL STRATEGY
# ===============================================================
if ($RAMPercent -ge 85) {

    Write-Log "RAM threshold breached ($RAMPercent%)"
    $RiskLevel = "HIGH"

    # 1. Clear TEMP
    Write-Log "Clearing TEMP files"
    Get-ChildItem "$env:TEMP" -Recurse -Force |
        Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
    $ActionsTaken += "TempCleanup"

    # 2. Garbage Collection
    Write-Log "Forcing .NET Garbage Collection"
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    $ActionsTaken += "GarbageCollection"

    # 3. Restart memory-heavy services (safe ones only)
    $ServicesToRestart = @("Spooler", "wuauserv")
    foreach ($svc in $ServicesToRestart) {
        if (Get-Service -Name $svc -ErrorAction SilentlyContinue) {
            Write-Log "Restarting service: $svc"
            Restart-Service -Name $svc -Force
            $ActionsTaken += "ServiceRestart:$svc"
        }
    }
}

# ===============================================================
# CPU AUTOHEAL STRATEGY
# ===============================================================
if ($CPUPercent -ge 90) {

    Write-Log "CPU threshold breached ($CPUPercent%)"
    $RiskLevel = "CRITICAL"

    $TopCPU = Get-Process |
        Sort-Object CPU -Descending |
        Select-Object -First 3

    foreach ($proc in $TopCPU) {
        Write-Log "High CPU Process: $($proc.Name) PID=$($proc.Id) CPU=$($proc.CPU)"
    }

    $ActionsTaken += "CPUAnalysisOnly"
}

# ===============================================================
# DISK PRESSURE STRATEGY
# ===============================================================
$SystemDrive = Get-PSDrive C
$DiskUsedPct = [math]::Round((($SystemDrive.Used / $SystemDrive.Size) * 100), 2)

if ($DiskUsedPct -ge 90) {
    Write-Log "Disk pressure high ($DiskUsedPct%)"
    $RiskLevel = "HIGH"

    Write-Log "Running disk cleanup (basic)"
    cleanmgr /verylowdisk | Out-Null
    $ActionsTaken += "DiskCleanup"
}

# ===============================================================
# UPTIME SAFETY
# ===============================================================
if ($UptimeHrs -ge 240) {
    Write-Log "System uptime very high ($UptimeHrs hrs)"
    $ActionsTaken += "RestartRecommended"
}

# ===============================================================
# FINAL HEALTH ASSESSMENT
# ===============================================================
$FailureAction =
    if ($ActionsTaken.Count -eq 0) { "None" }
    else { $ActionsTaken -join "," }

Write-Log "Actions Taken: $FailureAction"
Write-Log "Risk Level: $RiskLevel"

# ===============================================================
# OUTPUT REPORT (FOR TELEMETRY SERVER)
# ===============================================================
$Report = @{
    Hostname       = $env:COMPUTERNAME
    CPUPercent     = $CPUPercent
    RAMPercent     = $RAMPercent
    DiskUsedPct    = $DiskUsedPct
    UptimeHours    = $UptimeHrs
    RiskLevel      = $RiskLevel
    FailureAction  = $FailureAction
    Timestamp      = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
}

$Report | ConvertTo-Json -Depth 4 | Set-Content $ReportFile

Write-Log "================ AUTOHEAL CYCLE COMPLETED ================"

# RETURN OBJECT (PIPELINE READY)
$Report
