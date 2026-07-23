# ==============================================================
# RPP BEAST GALAXY – TELEMETRY AGENT (ULTRA STABLE)
# ==============================================================

Write-Host "Galaxy Telemetry Agent Started" -ForegroundColor Cyan

# --------------------------------------------------------------
# CONFIG
# --------------------------------------------------------------

$SERVER = "http://192.168.1.167:8090/telemetry"
$INTERVAL = 2

# --------------------------------------------------------------
# GET LAN IPv4
# --------------------------------------------------------------

function Get-LanIP {

    $ipObj = Get-NetIPAddress -AddressFamily IPv4 |
        Where-Object {
            $_.IPAddress -notlike "127.*" -and
            $_.IPAddress -notlike "169.254*"
        } |
        Select-Object -First 1

    if ($null -eq $ipObj) {
        return $null
    }

    return $ipObj.IPAddress
}

# --------------------------------------------------------------
# CPU %
# --------------------------------------------------------------

function Get-CPU {

    $cpu = Get-Counter '\Processor(_Total)\% Processor Time'
    return [math]::Round($cpu.CounterSamples[0].CookedValue,2)

}

# --------------------------------------------------------------
# RAM %
# --------------------------------------------------------------

function Get-RAM {

    $os = Get-CimInstance Win32_OperatingSystem

    $total = $os.TotalVisibleMemorySize
    $free = $os.FreePhysicalMemory

    $used = $total - $free

    return [math]::Round(($used / $total) * 100,2)

}

# --------------------------------------------------------------
# DISK %
# --------------------------------------------------------------

function Get-Disk {

    $disk = Get-CimInstance Win32_LogicalDisk -Filter "DeviceID='C:'"

    if ($null -eq $disk) {
        return 0
    }

    $used = $disk.Size - $disk.FreeSpace

    return [math]::Round(($used / $disk.Size) * 100,2)

}

# --------------------------------------------------------------
# TELEMETRY LOOP
# --------------------------------------------------------------

while ($true) {

    try {

        $ip = Get-LanIP

        if ($null -eq $ip) {

            Write-Host "No LAN IP detected" -ForegroundColor Red
            Start-Sleep -Seconds $INTERVAL
            continue

        }

        $cpu  = Get-CPU
        $ram  = Get-RAM
        $disk = Get-Disk

        $payload = @{
            IP       = $ip
            Hostname = $env:COMPUTERNAME
            CPU      = $cpu
            RAM      = $ram
            Disk     = $disk
            Time     = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        } | ConvertTo-Json

        Write-Host "Sending telemetry from $ip ..." -ForegroundColor Yellow

        $response = Invoke-RestMethod `
            -Uri $SERVER `
            -Method POST `
            -Body $payload `
            -ContentType "application/json" `
            -TimeoutSec 5

        Write-Host "Telemetry sent successfully -> $ip" -ForegroundColor Green

    }
    catch {

        Write-Host "Telemetry failed:" $_.Exception.Message -ForegroundColor Red

    }

    Start-Sleep -Seconds $INTERVAL

}