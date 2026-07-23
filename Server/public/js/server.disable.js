// =======================================================
// 🌌 RPP BEAST GALAXY – MAIN SERVER (HTTP + WS)
// =======================================================

const express = require("express");
const http = require("http");
const path = require("path");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 8090;

// =======================================================
// 🔧 MIDDLEWARE
// =======================================================
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// =======================================================
// 🧠 IN-MEMORY TELEMETRY STORE
// =======================================================
const systems = {};

// =======================================================
// 📡 TELEMETRY INGEST (FROM AGENTS)
// =======================================================
app.post("/telemetry", (req, res) => {
  const { IP, Hostname, CPU, RAM, Disk, Timestamp } = req.body;

  if (!IP) {
    return res.status(400).json({ error: "Missing IP" });
  }

  systems[IP] = {
    IP,
    Hostname,
    CPU,
    RAM,
    Disk,
    lastSeen: Timestamp || Date.now()
  };

  // 🔔 Broadcast to all dashboard clients
  const payload = JSON.stringify({
    type: "systems",
    payload: {
      [IP]: systems[IP]
    }
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });

  res.sendStatus(200);
});

// =======================================================
// 🌐 WEBSOCKET CONNECTION
// =======================================================
wss.on("connection", ws => {
  console.log("🟢 Dashboard connected via WebSocket");

  // Send full state on connect
  ws.send(JSON.stringify({
    type: "systems",
    payload: systems
  }));
});

// =======================================================
// 🚀 START SERVER
// =======================================================
server.listen(PORT, () => {
  console.log(`🌌 Galaxy Server LIVE → http://localhost:${PORT}`);
});
