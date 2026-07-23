// =============================================================
// BEAST GALAXY – LIVE LAN SCANNER
// Author: RPP BEAST GALAXY TEAM
// Purpose:
//  • Scan LAN range continuously
//  • Detect ONLINE / OFFLINE / RECOVERY
//  • Notify server in REAL TIME
// =============================================================

import ping from "ping";
import fs from "fs";
import path from "path";

const SUBNET = "192.168.1";
const START = 1;
const END   = 245;

const DATA_DIR  = "C:/RPP_GALAXY/ServerData";
const STATEFILE = path.join(DATA_DIR, "lan-state.json");

// Ensure storage
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(STATEFILE)) fs.writeFileSync(STATEFILE, "{}");

// Load previous state
let previous = JSON.parse(fs.readFileSync(STATEFILE, "utf8"));

/**
 * Scan LAN and report only CHANGES
 */
export async function scanLAN(broadcast) {
  const current = {};

  for (let i = START; i <= END; i++) {
    const ip = `${SUBNET}.${i}`;

    try {
      const res = await ping.promise.probe(ip, {
        timeout: 1,
        extra: ["-n", "1"]
      });

      const alive = res.alive === true;

      current[ip] = {
        ip,
        alive,
        lastSeen: Date.now()
      };

      const old = previous[ip]?.alive;

      // ==============================
      // STATE CHANGE
      // ==============================
      if (old !== undefined && old !== alive) {
        broadcast(JSON.stringify({
          type: "lan-change",
          ip,
          status: alive ? "ONLINE" : "OFFLINE",
          time: Date.now()
        }));
      }

    } catch (err) {
      current[ip] = {
        ip,
        alive: false,
        lastSeen: Date.now()
      };
    }
  }

  fs.writeFileSync(STATEFILE, JSON.stringify(current, null, 2));
  previous = current;
}
