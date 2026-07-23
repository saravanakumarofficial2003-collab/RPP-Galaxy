import { exec } from "child_process";

export function blockIP(ip) {

    if (!ip) return;

    console.log("🔥 Blocking attacker IP:", ip);

    exec(
        `netsh advfirewall firewall add rule name="BLOCK_${ip}" dir=in action=block remoteip=${ip}`,
        () => {}
    );
}
