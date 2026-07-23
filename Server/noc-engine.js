import si from "systeminformation";
import ping from "ping";

/* ===============================
   ISP HEALTH CHECK
=============================== */
export async function getISPHealth() {

  const host = "8.8.8.8";

  const res = await ping.promise.probe(host, {
    timeout: 2
  });

  return {
    online: res.alive,
    latency: res.time || 0,
    packetLoss: res.packetLoss || 0
  };
}

/* ===============================
   SERVER BANDWIDTH (REAL NIC)
=============================== */
export async function getServerBandwidth() {

  const stats = await si.networkStats();

  if (!stats || !stats[0]) return null;

  return {
    rx: stats[0].rx_sec,
    tx: stats[0].tx_sec
  };
}

/* ===============================
   ROUTER TRAFFIC (GATEWAY LOAD)
=============================== */
export async function getRouterTraffic() {

  const res = await ping.promise.probe("192.168.1.1", {
    timeout: 2
  });

  return {
    reachable: res.alive,
    latency: res.time || 0
  };
}
