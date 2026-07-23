// ==============================================================
// 🚀 RPP BEAST GALAXY – ENTERPRISE NOC SERVER (FINAL PRODUCTION)
// ==============================================================

import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import cors from "cors";
import fs from "fs";
import path from "path";
import ping from "ping";
import { exec } from "child_process";
import { fileURLToPath } from "url";

import { analyzeThreat } from "./services/threatAnalyzer.js";
import { killProcess, isolateHost } from "./services/autoResponse.js";
import { logSecurityEvent } from "./services/securityLog.js";
import { getISPHealth, getServerBandwidth, getRouterTraffic } from "./noc-engine.js";
import { getStorageStatus } from "./services/storageMonitor.js";
import { analyzeSystem } from "./services/aiHealth.js";
import { getRealInternetSpeed } from "./services/realSpeedTest.js";
import { getLiveBandwidth } from "./services/liveBandwidth.js";
import { analyzeCyberThreat } from "./services/aiCyberBrain.js";
import { captureForensics } from "./services/forensicCapture.js";
import { blockIP } from "./services/firewallBlocker.js";
import { quarantineFile } from "./services/fileQuarantine.js";

import lanMetaAPI from "./api/lan-meta.mjs";

// ==============================================================
// CONFIG
// ==============================================================

const PORT = 8090;
const SUBNET_PREFIX = "192.168.1.";
const START_IP = 1;
const END_IP = 250;
const AGENT_TIMEOUT = 6000;

// ==============================================================
// PATH
// ==============================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==============================================================
// STORAGE
// ==============================================================

const DATA_DIR = "C:/RPP_GALAXY/ServerData";
const NAME_FILE = path.join(DATA_DIR, "ip-names.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(NAME_FILE)) fs.writeFileSync(NAME_FILE, "{}");

let IP_NAMES = JSON.parse(fs.readFileSync(NAME_FILE, "utf8"));

// ==============================================================
// EXPRESS
// ==============================================================

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

app.use("/api", lanMetaAPI);

// ==============================================================
// HTTP + WS
// ==============================================================

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// ==============================================================
// SYSTEM REGISTRY
// ==============================================================

const SYSTEMS = {};

// ==============================================================
// TELEMETRY INGEST
// ==============================================================

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
  res.json({ status: "OK" });
});
// ==============================================================
// ⭐ AI CYBER DEFENSE + WARFARE ENGINE (SINGLE ROUTE)
// ==============================================================

app.post("/security", (req, res) => {

    const data = req.body;

    console.log("⚠ SECURITY EVENT:", data.Hostname);

    const result = analyzeCyberThreat(data.Hostname, data);

    logSecurityEvent({
        host: data.Hostname,
        ip: data.IP,
        risk: result.riskScore,
        reasons: result.reasons
    });

    // 🚨 AUTONOMOUS CONTAINMENT
    if (result.riskScore >= 80) {

        captureForensics(data.Hostname);

        data.SuspiciousProcesses?.forEach(p => killProcess(p));
        data.AttackerIPs?.forEach(ip => blockIP(ip));
        data.SuspiciousFiles?.forEach(f => quarantineFile(f));

        isolateHost(data.IP);
    }

    // 🧠 CYBER WARFARE ANALYSIS
    const warfare = runCyberWarfareAnalysis(
        data.Hostname,
        data,
        result
    );

    broadcastLive("securityUpdate", { ...data, ...result });
    broadcastLive("cyberWarfare", warfare);

    res.sendStatus(200);
});
// ==============================================================
// LAN DISCOVERY
// ==============================================================

setInterval(async () => {

  for (let i = START_IP; i <= END_IP; i++) {

    const ip = SUBNET_PREFIX + i;
    if (SYSTEMS[ip]?.Source === "AGENT") continue;

    const result = await ping.promise.probe(ip, { timeout: 1 });

    if (result.alive) {
      SYSTEMS[ip] = {
        IP: ip,
        Hostname: ip,
        Person: IP_NAMES[ip] || "",
        Status: "ONLINE",
        Source: "PING",
        latency: Number(result.time) || 0,
        lastSeen: Date.now()
      };
    } else {
      delete SYSTEMS[ip];
    }
  }

  broadcastSystems();

}, 3000);

// ==============================================================
// STORAGE + AI
// ==============================================================

setInterval(() => broadcastLive("storage-status", getStorageStatus()), 5000);
setInterval(() => broadcastLive("ai-health", analyzeSystem(SYSTEMS)), 4000);

app.post("/security", (req, res) => {

    const data = req.body;

    const result = analyzeThreat(data);

    logSecurityEvent({
        host: data.Hostname,
        ip: data.IP,
        risk: result.riskScore,
        reasons: result.reasons
    });

    // ===============================
    // AUTONOMOUS RESPONSE POLICY
    // ===============================

    if (result.riskScore >= 80) {

        console.log("🚨 CRITICAL THREAT");

        data.SuspiciousProcesses?.forEach(p => killProcess(p));
        data.AttackerIPs?.forEach(ip => blockIP(ip));
        data.SuspiciousFiles?.forEach(f => quarantineFile(f));

        isolateHost();
    }

    else if (result.riskScore >= 50) {

        console.log("⚠ HIGH RISK");

        data.SuspiciousProcesses?.forEach(p => killProcess(p));
        data.AttackerIPs?.forEach(ip => blockIP(ip));
    }

    broadcastLive("securityUpdate", { ...data, ...result });

    res.sendStatus(200);
});
// ==============================================================
// ⭐ NETWORK SPEED ENGINE (SINGLE SOURCE OF TRUTH)
// ==============================================================

let currentCapacity = { download: 0, upload: 0, ping: 0 };

// ---------- INITIAL TEST AT STARTUP ----------
async function runInitialSpeedTest() {
    try {
        console.log("⚡ Initial ISP speed test...");
        const result = await getRealInternetSpeed();
        if (result.download > 0) {
            currentCapacity = result;
            broadcastLive("network-speed", currentCapacity);
            console.log("Initial Speed:", result);
        }
    } catch {
        console.log("Initial speed test failed");
    }
}

// ---------- ISP CAPACITY EVERY 2 MIN ----------
setInterval(async () => {

    try {
        console.log("⚡ Measuring ISP capacity...");
        const result = await getRealInternetSpeed();

        if (result.download > 0) {
            currentCapacity = result;
            broadcastLive("network-speed", currentCapacity);
            console.log("Measured:", result);
        }

    } catch {
        console.log("Speed test failed");
    }

}, 120000);

// ---------- LIVE TRAFFIC EVERY SECOND ----------
setInterval(() => {

    try {
        const live = getLiveBandwidth();
        broadcastLive("live-traffic", live);
    } catch {}

}, 1000);

// ==============================================================
// WS CONNECTION
// ==============================================================

wss.on("connection", ws => {
  ws.send(JSON.stringify({ type: "systems", payload: SYSTEMS }));
  ws.send(JSON.stringify({ type: "network-speed", payload: currentCapacity }));
});

// ==============================================================
// BROADCAST HELPERS
// ==============================================================

function broadcastSystems() {
  broadcastRaw({ type: "systems", payload: SYSTEMS });
}

function broadcastLive(type, payload) {
  broadcastRaw({ type, payload });
}

function broadcastRaw(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(ws => {
    if (ws.readyState === 1) ws.send(msg);
  });
}

// ==============================================================
// START SERVER
// ==============================================================

server.listen(PORT, "0.0.0.0", async () => {

  console.log("================================");
  console.log("🚀 GALAXY ENTERPRISE NOC LIVE");
  console.log(`🌐 http://192.168.1.167:${PORT}`);
  console.log("📡 REAL LATENCY ACTIVE");
  console.log("🧠 LIVE LAN MAP ACTIVE");
  console.log("================================");

  await runInitialSpeedTest(); // ⭐ STARTUP SPEED TEST
});
