import { exec } from "child_process";

export function captureForensics(host) {

    console.log("📸 Capturing forensic snapshot:", host);

    exec(`powershell Get-Process > C:\\RPP_FORENSICS\\${host}_process.txt`);
    exec(`powershell netstat -ano > C:\\RPP_FORENSICS\\${host}_network.txt`);
    exec(`powershell Get-Service > C:\\RPP_FORENSICS\\${host}_services.txt`);
}
