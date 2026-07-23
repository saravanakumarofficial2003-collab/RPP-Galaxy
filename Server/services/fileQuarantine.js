import fs from "fs";
import path from "path";

const QUARANTINE_DIR = "C:/RPP_GALAXY/Quarantine";

if (!fs.existsSync(QUARANTINE_DIR))
    fs.mkdirSync(QUARANTINE_DIR, { recursive: true });

export function quarantineFile(filePath) {

    try {

        if (!fs.existsSync(filePath)) return;

        const name = path.basename(filePath);
        const target = path.join(QUARANTINE_DIR, name);

        fs.renameSync(filePath, target);

        console.log("🧪 Quarantined:", name);

    } catch (e) {
        console.log("Quarantine failed:", e.message);
    }
}
