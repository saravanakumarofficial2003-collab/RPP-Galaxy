// =======================================================
// 🌐 RPP BEAST GALAXY – LAN SCANNER ENGINE
// =======================================================

import ping from "ping";
import os from "os";

const SUBNET = "192.168.1.";
const START = 1;
const END = 245;

const LAN_DEVICES = {}; // ip -> device info

export async function scanLAN() {
  for (let i = START; i <= END; i++) {
    const ip = SUBNET + i;

    try {
      const res = await ping.promise.probe(ip, {
        timeout: 1,
        extra: ["-c", "1"]
      });

      if (res.alive) {
        LAN_DEVICES[ip] = {
          IP: ip,
          Hostname: res.host || "UNKNOWN",
          Status: "ONLINE",
          lastSeen: Date.now(),
          Source: "LAN"
        };
      }
    } catch {}
  }
}

export function getLANDevices() {
  const now = Date.now();

  Object.values(LAN_DEVICES).forEach(d => {
    if (now - d.lastSeen > 10000) {
      d.Status = "OFFLINE";
    }
  });

  return LAN_DEVICES;
}
