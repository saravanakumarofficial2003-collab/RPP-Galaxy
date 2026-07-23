// ==========================================================
// 🚀 RPP BEAST GALAXY — ULTIMATE ENTERPRISE NOC SERVER
// ==========================================================

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import fs from "fs";
import path from "path";
import ping from "ping";
import { exec } from "child_process";
import { fileURLToPath } from "url";

import { runSpeedTest } from "./services/networkSpeed.js";
import {
  getISPHealth,
  getServerBandwidth,
  getRouterTraffic
} from "./noc-engine.js";

// ==========================================================
// CONFIG
// ==========================================================

const PORT = 8090;
const SUBNET_PREFIX = "192.168.1.";
const START_IP = 1;
const END_IP = 250;

const GATEWAY_IP = "192.168.1.1";
const MAIN_SERVER_IP = "192.168.1.77";
const AGENT_TIMEOUT = 6000;

// ==========================================================
// PATH
// ==========================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================================
// STORAGE
// ==========================================================

const DATA_DIR = "C:/RPP_GALAXY/ServerData";
const NAME_FILE = path.join(DATA_DIR, "ip-names.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(NAME_FILE)) fs.writeFileSync(NAME_FILE, "{}");

let IP_NAMES = JSON.parse(fs.readFileSync(NAME_FILE));

// ==========================================================
// EXPRESS + SOCKET.IO
// ==========================================================

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

// ==========================================================
// MASTER SYSTEM REGISTRY
// ==========================================================

const SYSTEMS = {};

// ==========================================================
// TELEMETRY INGEST
// ==========================================================

app.post("/telemetry", (req, res) => {

  const d = req.body;
  if (!d?.IP) return res.sendStatus(400);

  SYSTEMS[d.IP] = {
    IP: d.IP,
    Hostname: d.Hostname || d.IP,
    Person: IP_NAMES[d.IP] || "",
    CPU: d.CPU,
    RAM: d.RAM,
    Disk: d.Disk,
    Status: "ONLINE",
    Source: "AGENT",
    lastSeen: Date.now()
  };

  broadcastSystems();
  res.json({ ok: true });
});

// ==========================================================
// LAN DISCOVERY
// ==========================================================

setInterval(async () => {

  for (let i = START_IP; i <= END_IP; i++) {

    const ip = SUBNET_PREFIX + i;

    if (SYSTEMS[ip]?.Source === "AGENT") continue;

    const r = await ping.promise.probe(ip, { timeout: 1 });

    if (r.alive) {
      SYSTEMS[ip] = {
        IP: ip,
        Status: "ONLINE",
        Source: "PING",
        lastSeen: Date.now()
      };
    } else {
      delete SYSTEMS[ip];
    }
  }

  broadcastSystems();

}, 5000);

// ==========================================================
// AGENT OFFLINE CLEANUP
// ==========================================================

setInterval(() => {

  const now = Date.now();

  Object.values(SYSTEMS).forEach(s => {
    if (s.Source === "AGENT" && now - s.lastSeen > AGENT_TIMEOUT)
      delete SYSTEMS[s.IP];
  });

}, 2000);

// ==========================================================
// BROADCAST SYSTEMS
// ==========================================================

function broadcastSystems() {
  io.emit("systems", SYSTEMS);
}

// ==========================================================
// REAL INTERNET SPEED STREAM
// ==========================================================

setInterval(async () => {

  try {
    const speed = await runSpeedTest();
    io.emit("network-speed", speed);
    console.log("⚡ Speed:", speed);
  } catch {}

}, 5000);

// ==========================================================
// ENTERPRISE NOC STREAM
// ==========================================================

setInterval(async () => {

  try {

    const isp = await getISPHealth();
    const serverData = await getServerBandwidth();
    const router = await getRouterTraffic();

    io.emit("noc-live", {
      isp,
      server: serverData,
      router,
      time: Date.now()
    });

    console.log("📡 NOC STREAM");

  } catch {}

}, 3000);

// ==========================================================
// SOCKET CONNECTION
// ==========================================================

io.on("connection", socket => {
  console.log("🟢 Client:", socket.id);
});

// ==========================================================
// START SERVER
// ==========================================================

server.listen(PORT, "0.0.0.0", () => {

  console.log("================================");
  console.log("🚀 GALAXY ENTERPRISE NOC LIVE");
  console.log(`🌐 http://192.168.1.167:${PORT}`);
  console.log("⚡ Internet Speed: ACTIVE");
  console.log("🏢 Enterprise NOC: ACTIVE");
  console.log("🧠 LAN Monitoring: ACTIVE");
  console.log("================================");

});
