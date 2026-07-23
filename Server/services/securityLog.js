import fs from "fs";

const LOG_FILE = "C:/RPP_GALAXY/ServerData/security-events.json";

if (!fs.existsSync(LOG_FILE))
    fs.writeFileSync(LOG_FILE, "[]");

export function logSecurityEvent(event) {

    const logs = JSON.parse(fs.readFileSync(LOG_FILE));
    logs.push({
        ...event,
        time: new Date().toISOString()
    });

    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}
