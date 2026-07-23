import { exec } from "child_process";

// =============================
// SAFE COMMAND EXECUTOR
// =============================
function runPS(cmd) {
    exec(`powershell -ExecutionPolicy Bypass -Command "${cmd}"`);
}


// =============================
// KILL MALICIOUS PROCESS
// =============================
export function killProcess(processName) {

    if (!processName) return;

    console.log("🛑 Killing process:", processName);

    runPS(`Get-Process -Name "${processName}" -ErrorAction SilentlyContinue | Stop-Process -Force`);
}


// =============================
// FIREWALL BLOCK ATTACKER IP
// =============================
export function blockIP(ip) {

    if (!ip) return;

    console.log("🔥 Blocking IP:", ip);

    runPS(`New-NetFirewallRule -DisplayName "BLOCK_${ip}" -Direction Inbound -RemoteAddress ${ip} -Action Block`);
}


// =============================
// QUARANTINE FILE
// =============================
export function quarantineFile(filePath) {

    if (!filePath) return;

    const quarantineDir = "C:\\RPP_QUARANTINE";

    runPS(`
        if (!(Test-Path "${quarantineDir}")) { New-Item -ItemType Directory -Path "${quarantineDir}" }
        Move-Item -Path "${filePath}" -Destination "${quarantineDir}" -Force
    `);

    console.log("📦 File quarantined:", filePath);
}


// =============================
// NETWORK ISOLATION (SAFE)
// =============================
export function isolateHost() {

    console.log("🚨 Isolating network (temporary)");

    // disable all network adapters except loopback
    runPS(`
        Get-NetAdapter | Where-Object {$_.Status -eq "Up"} | Disable-NetAdapter -Confirm:$false
    `);
}


// =============================
// RESTORE NETWORK (OPTIONAL)
// =============================
export function restoreNetwork() {

    console.log("✅ Restoring network");

    runPS(`
        Get-NetAdapter | Enable-NetAdapter -Confirm:$false
    `);
}
