# ===============================================================
# RPP BEAST GALAXY - IDENTITY AGENT (ULTIMATE SAFE BUILD)
# Company : RPP Infra Projects Limited
# Author  : Saravana Kumar S
# ===============================================================

$ErrorActionPreference = "SilentlyContinue"

# ---------- PATHS ----------
$ROOT = "C:\RPP_GALAXY"
$IDENTITYDIR = "$ROOT\Identity"
$IDENTITYDB = "$IDENTITYDIR\identity.json"
$LOGFILE = "$ROOT\Logs\GalaxyIdentity.log"

if (!(Test-Path $IDENTITYDIR)) {
    New-Item -ItemType Directory -Path $IDENTITYDIR -Force | Out-Null
}

# ---------- LOG ----------
function Write-IdentityLog {
    param([string]$Message)
    $t = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $LOGFILE -Value "$t | $Message"
}

Write-IdentityLog "Identity Agent started"

# ---------- HARDWARE ----------
function Get-HardwareFingerprint {

    $cpu = Get-CimInstance Win32_Processor | Select-Object -First 1
    $bios = Get-CimInstance Win32_BIOS
    $board = Get-CimInstance Win32_BaseBoard
    $os = Get-CimInstance Win32_OperatingSystem
    $disk = Get-CimInstance Win32_LogicalDisk -Filter "DeviceID='C:'"
    $net = Get-NetAdapter | Where-Object { $_.Status -eq "Up" } | Select-Object -First 1

    return @{
        Hostname = $env:COMPUTERNAME
        Username = $env:USERNAME
        CPU_ID = $cpu.ProcessorId
        CPU_Name = $cpu.Name
        BIOS_Serial = $bios.SerialNumber
        Board = $board.Product
        Disk = $disk.VolumeSerialNumber
        MAC = $net.MacAddress
        OS = $os.Caption
        OSVersion = $os.Version
        Arch = $os.OSArchitecture
    }
}

# ---------- GALAXY ID ----------
function New-GalaxyID {
    param($fp)

    $raw = "$($fp.CPU_ID)$($fp.BIOS_Serial)$($fp.Board)$($fp.Disk)$($fp.MAC)"
    $bytes = [Text.Encoding]::UTF8.GetBytes($raw)
    $hash = [Security.Cryptography.SHA256]::Create().ComputeHash($bytes)
    return ([BitConverter]::ToString($hash)).Replace("-", "")
}

# ---------- LOAD OR CREATE ----------
$identity = $null

if (Test-Path $IDENTITYDB) {
    try {
        $identity = Get-Content $IDENTITYDB -Raw | ConvertFrom-Json
        Write-IdentityLog "Existing identity loaded"
    } catch {
        Remove-Item $IDENTITYDB -Force
    }
}

if (!$identity) {
    $fp = Get-HardwareFingerprint
    $gid = New-GalaxyID $fp

    $identity = @{
        GalaxyID = $gid
        Created = (Get-Date)
        Fingerprint = $fp
        Status = "ACTIVE"
    }

    $identity | ConvertTo-Json -Depth 4 | Set-Content $IDENTITYDB -Force
    Write-IdentityLog "New identity created"
}

# ---------- VERIFY ----------
$currentFP = Get-HardwareFingerprint
$currentID = New-GalaxyID $currentFP

if ($currentID -ne $identity.GalaxyID) {
    Write-IdentityLog "WARNING: Hardware change detected"
    $identity.Status = "HARDWARE_CHANGED"
    $identity.LastChange = Get-Date
    $identity | ConvertTo-Json -Depth 4 | Set-Content $IDENTITYDB -Force
} else {
    Write-IdentityLog "Hardware verified"
}

# ---------- EXPORT ----------
if (!$Global:GalaxyContext) { $Global:GalaxyContext = @{} }
$Global:GalaxyContext.Identity = $identity

Write-IdentityLog "Identity injected into GalaxyContext"

# ===============================================================
# 🔴 GALAXY LIVE HEARTBEAT MODULE (SAFE ADD-ON)
# ===============================================================

$SERVER = "http://192.168.1.167:8090/telemetry"
Write-IdentityLog "Live heartbeat module started"

while ($true) {
    try {

        # ---------- CPU ----------
        $cpu = (Get-Counter '\Processor(_Total)\% Processor Time').CounterSamples.CookedValue

        # ---------- RAM ----------
        $os = Get-CimInstance Win32_OperatingSystem
        $ramUsed = (($os.TotalVisibleMemorySize - $os.FreePhysicalMemory) / $os.TotalVisibleMemorySize) * 100

        # ---------- TOP RUNNING PROCESSES ----------
        $topProcesses = Get-Process |
          Where-Object { $_.CPU -ne $null } |
          Sort-Object CPU -Descending |
          Select-Object -First 6 `
            @{n="name";e={$_.ProcessName}},
            @{n="cpu";e={[math]::Round($_.CPU,2)}},
            @{n="ramMB";e={[math]::Round($_.WorkingSet64 / 1MB,1)}}

        # ---------- PAYLOAD ----------
        $payload = @{
            Hostname  = $env:COMPUTERNAME
            GalaxyID = $identity.GalaxyID
            CPU      = [math]::Round($cpu, 1)
            RAM      = [math]::Round($ramUsed, 1)
            Processes = $topProcesses
            Agent    = "GalaxyIdentityAgent"
            Timestamp = (Get-Date).ToUniversalTime()
        } | ConvertTo-Json -Depth 5

        Invoke-RestMethod `
            -Uri $SERVER `
            -Method POST `
            -Body $payload `
            -ContentType "application/json"

        Write-IdentityLog "Heartbeat sent"

    } catch {
        Write-IdentityLog "Heartbeat failed"
    }

    Start-Sleep -Seconds 1
}
