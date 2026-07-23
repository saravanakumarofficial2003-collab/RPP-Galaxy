import si from "systeminformation";

let lastRx = 0;
let lastTx = 0;
let lastTime = Date.now();

export async function getLiveBandwidth() {

  const net = await si.networkStats();

  if (!net.length) {
    return { download: 0, upload: 0 };
  }

  const now = Date.now();
  const diffTime = (now - lastTime) / 1000;

  const rx = net[0].rx_bytes;
  const tx = net[0].tx_bytes;

  const download = ((rx - lastRx) * 8 / diffTime) / 1_000_000;
  const upload   = ((tx - lastTx) * 8 / diffTime) / 1_000_000;

  lastRx = rx;
  lastTx = tx;
  lastTime = now;

  return {
    download: Math.max(download, 0),
    upload: Math.max(upload, 0)
  };
}
