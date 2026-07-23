import fs from "fs";

const FILE = "C:/RPP_GALAXY/Server/data/devices.json";

if (!fs.existsSync(FILE))
  fs.writeFileSync(FILE, "{}");

export function loadDevices() {
  return JSON.parse(fs.readFileSync(FILE));
}

export function saveDevices(devices) {
  fs.writeFileSync(FILE, JSON.stringify(devices, null, 2));
}

export function updateDevice(ip, data) {
  const db = loadDevices();

  db[ip] = {
    ...db[ip],
    ...data,
    lastUpdate: Date.now()
  };

  saveDevices(db);
}
