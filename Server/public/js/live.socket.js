// ==============================================================
// 🚀 RPP BEAST GALAXY – LIVE SOCKET CORE (AUTHORITATIVE FINAL)
// WebSocket + Network Speed Bridge
// Single Truth • Firewall-Tolerant • Stable LAN
// ==============================================================

console.log("🛰️ GALAXY LIVE SOCKET CORE [AUTHORITATIVE] LOADED");

(function () {
  if (window.__GALAXY_SOCKET_CORE__) return;
  window.__GALAXY_SOCKET_CORE__ = true;

  // ==============================================================
  // 🌐 GLOBAL AUTHORITATIVE STATE (SINGLE SOURCE OF TRUTH)
  // ==============================================================
  window.GALAXY_STATE = {
    systems: {},        // { ip -> system }
    networkSpeed: null, // { download, upload, ping }
    lastUpdate: 0
  };

  // ==============================================================
  // 🔥 OFFLINE POLICY (ONLY PLACE OFFLINE IS DECIDED)
  // ==============================================================
  const OFFLINE_GRACE_MS = 15000; // 15s tolerance
  let lastPacketTime = 0;

  // ==============================================================
  // 🔌 SOCKET.IO (NETWORK SPEED + EVENTS)
  // ==============================================================
  let ioSocket = null;
  try {
    if (typeof io !== "undefined") {
      ioSocket = io();

      ioSocket.on("network-speed", speed => {
        if (!speed) return;
        window.GALAXY_STATE.networkSpeed = speed;
        window.dispatchEvent(new Event("GALAXY_DATA_UPDATE"));
      });

      console.log("🟢 SOCKET.IO CONNECTED (network-speed)");
    }
  } catch (e) {
    console.warn("⚠️ socket.io not available");
  }

  // ==============================================================
  // 🌐 WEBSOCKET (SYSTEM METRICS – AUTHORITATIVE)
  // ==============================================================
  const SOCKET_URL =
    location.protocol === "https:"
      ? `wss://${location.host}`
      : `ws://${location.host}`;

  let ws;

  function connectWS() {
    try {
      ws = new WebSocket(SOCKET_URL);
    } catch (e) {
      console.error("❌ WS INIT FAILED", e);
      return setTimeout(connectWS, 3000);
    }

    ws.onopen = () => {
      console.log("🟢 GALAXY WS CONNECTED");
    };

    ws.onclose = () => {
      console.warn("🔴 GALAXY WS CLOSED – retrying…");
      setTimeout(connectWS, 2000);
    };

    ws.onerror = () => {
      try { ws.close(); } catch {}
    };

    // ============================================================
    // 📡 WS MESSAGE — SYSTEM METRICS PIPE
    // ============================================================
    ws.onmessage = e => {
      let msg;
      try {
        msg = JSON.parse(e.data);
      } catch {
        return;
      }

      if (!msg || msg.type !== "systems") return;

      lastPacketTime = Date.now();
      const incoming = msg.payload || {};
      const now = Date.now();
      const nextState = {};

      // ------------------------------------------------------------
      // ✅ MERGE LIVE SYSTEMS
      // ------------------------------------------------------------
      for (const ip in incoming) {
        const sys = incoming[ip];
        nextState[ip] = {
          ...sys,
          IP: ip,
          lastSeen: now
        };
      }

      // ------------------------------------------------------------
      // 🧠 GRACE PERIOD FOR TEMP LOST SYSTEMS
      // ------------------------------------------------------------
      for (const ip in window.GALAXY_STATE.systems) {
        if (!nextState[ip]) {
          const old = window.GALAXY_STATE.systems[ip];
          if (old && now - old.lastSeen <= OFFLINE_GRACE_MS) {
            nextState[ip] = old;
          }
        }
      }

      // ------------------------------------------------------------
      // 💾 COMMIT STATE
      // ------------------------------------------------------------
      window.GALAXY_STATE.systems = nextState;
      window.GALAXY_STATE.lastUpdate = now;

      // ------------------------------------------------------------
      // 📢 GLOBAL UPDATE EVENT
      // ------------------------------------------------------------
      window.dispatchEvent(new Event("GALAXY_DATA_UPDATE"));
    };
  }

  connectWS();

  // ==============================================================
  // 🧠 WATCHDOG (RENDER KEEP-ALIVE)
  // ==============================================================
  setInterval(() => {
    const now = Date.now();
    if (now - lastPacketTime > OFFLINE_GRACE_MS) {
      window.dispatchEvent(new Event("GALAXY_DATA_UPDATE"));
    }
  }, 3000);

})();
