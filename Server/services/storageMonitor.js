import os from "os";

export function getStorageStatus() {

  const total = os.totalmem();
  const free = os.freemem();

  return {
    ramUsedPercent: ((total - free) / total * 100).toFixed(1),
    ramFreeGB: (free / 1024 / 1024 / 1024).toFixed(2),
    ramTotalGB: (total / 1024 / 1024 / 1024).toFixed(2)
  };
}
