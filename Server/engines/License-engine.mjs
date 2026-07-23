// =============================================================
// BEAST GALAXY – LICENSE ENGINE (STEP 13)
// =============================================================

import fs from "fs";
import crypto from "crypto";

const LICENSE_FILE = "C:/RPP_GALAXY/ServerData/license.json";

// Default = DEMO MODE
if (!fs.existsSync(LICENSE_FILE)) {
  fs.writeFileSync(LICENSE_FILE, JSON.stringify({
    mode: "DEMO",
    company: "RPP INFRA PROJECTS LIMITED",
    expires: null,
    features: {
      ai: true,
      voice: true,
      autofix: false,
      audit: false,
      market: true
    }
  }, null, 2));
}

export function getLicense() {
  return JSON.parse(fs.readFileSync(LICENSE_FILE, "utf8"));
}

export function validateKey(key) {
  const hash = crypto.createHash("sha256").update(key).digest("hex");

  // Example enterprise hash (you can generate more)
  if (hash.startsWith("a9f")) {
    const lic = {
      mode: "LICENSED",
      company: "RPP INFRA PROJECTS LIMITED",
      expires: "2035-12-31",
      features: {
        ai: true,
        voice: true,
        autofix: true,
        audit: true,
        market: true
      }
    };

    fs.writeFileSync(LICENSE_FILE, JSON.stringify(lic, null, 2));
    return lic;
  }

  return null;
}
