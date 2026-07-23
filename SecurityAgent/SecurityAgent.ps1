$ServerURL = "http://192.168.1.167:8090/security"

function Get-SuspiciousProcesses {
    Get-Process | Where-Object {
        $_.CPU -gt 200 -or
        $_.ProcessName -match "powershell|cmd|wscript"
    } | Select-Object ProcessName, Id, CPU, StartTime
}

function Get-NetworkConnections {
    Get-NetTCPConnection |
    Where-Object { $_.State -eq "Established" } |
    Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, OwningProcess
}

function Send-Telemetry {
    $data = @{
        Hostname = $env:COMPUTERNAME
        Time = (Get-Date)
        SuspiciousProcesses = Get-SuspiciousProcesses
        NetworkConnections = Get-NetworkConnections
    }

    $json = $data | ConvertTo-Json -Depth 5

    try {
        Invoke-RestMethod -Uri $ServerURL -Method POST -Body $json -ContentType "application/json"
    } catch {}
}

while ($true) {
    Send-Telemetry
    Start-Sleep -Seconds 10
}
