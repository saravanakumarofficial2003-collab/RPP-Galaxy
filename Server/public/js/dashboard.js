// =============================================================
// 🚀 RPP BEAST GALAXY – DASHBOARD (SINGLE AUTHORITY)
// MD • CEO • IT • AI • LAN MAP
// SOCKET-DRIVEN • NO INTERVAL FIGHTING
// =============================================================

console.log("🚀 GALAXY DASHBOARD — SINGLE AUTHORITY LOADED");

// =============================================================
// 🧠 DISK HELPERS (SAFE)
// =============================================================
function GALAXY_DISK_PERCENT(sys) {
  if (!sys || !Array.isArray(sys.Disk)) return 0;
  let max = 0;
  sys.Disk.forEach(d => {
    if (d.totalGB > 0) {
      const p = Math.round((d.usedGB / d.totalGB) * 100);
      if (p > max) max = p;
    }
  });
  return max;
}

function GALAXY_DISK_TEXT(sys) {
  if (!sys || !Array.isArray(sys.Disk)) return "0%";
  return sys.Disk
    .map(d => `${d.drive}: ${Math.round((d.usedGB / d.totalGB) * 100)}%`)
    .join(" | ");
}

// =============================================================
// 🧠 CLASSIFIER — SINGLE RULE ENGINE
// =============================================================
function GALAXY_CLASSIFY(sys) {
  if (!sys) return "offline";

  const now = Date.now();
  if (!sys.lastSeen || now - sys.lastSeen > 3000) return "offline";

  const diskP = GALAXY_DISK_PERCENT(sys);

  if (sys.CPU >= 80 || sys.RAM >= 80 || diskP >= 80) return "critical";
  if (sys.CPU >= 60 || sys.RAM >= 60 || diskP >= 60) return "slow";

  return "online";
}
window.GALAXY_CLASSIFY = GALAXY_CLASSIFY;

// =============================================================
// 🌐 GLOBAL COUNTER — FIXED 250 IP SPACE
// =============================================================
window.GALAXY_COUNT = function () {
  const systems = window.GALAXY_STATE?.systems || {};
  let online = 0, slow = 0, critical = 0;

  for (const ip in systems) {
    const s = GALAXY_CLASSIFY(systems[ip]);
    if (s === "online") online++;
    else if (s === "slow") slow++;
    else if (s === "critical") critical++;
  }

  return {
    online,
    slow,
    critical,
    offline: 250 - (online + slow + critical)
  };
};

// =============================================================
// 📊 GLOBAL HEALTH UI
// =============================================================
window.GALAXY_UPDATE_GLOBAL_UI = function () {
  const c = GALAXY_COUNT();

  document.querySelectorAll("[data-online]").forEach(e => e.innerText = c.online);
  document.querySelectorAll("[data-offline]").forEach(e => e.innerText = c.offline);
  document.querySelectorAll("[data-slow]").forEach(e => e.innerText = c.slow);
  document.querySelectorAll("[data-critical]").forEach(e => e.innerText = c.critical);

  const active = c.online + c.slow + c.critical;
  const risk = active ? Math.round(((c.slow + c.critical) / active) * 100) : 0;

  const riskBox = document.getElementById("mdRisk");
  if (riskBox) riskBox.innerText = `${risk}%`;

  const cover = document.getElementById("mdCompletion");
  if (cover) cover.innerText = `${Math.round((active / 250) * 100)}% LAN COVERED`;
};

// =============================================================
// 🧾 IT COMMAND CENTER — STATIC TABLE
// =============================================================
(function BUILD_IT_TABLE() {
  const tbody = document.getElementById("itTableBody");
  if (!tbody) return;

  for (let i = 1; i <= 250; i++) {
    const ip = `192.168.1.${i}`;
    const tr = document.createElement("tr");
    tr.dataset.ip = ip;
    tr.innerHTML = `
      <td>${ip}</td>
      <td class="host" contenteditable="true"></td>
      <td class="status red">OFFLINE</td>
      <td class="cpu">0%</td>
      <td class="ram">0%</td>
      <td class="disk">0%</td>
      <td class="health green">LOW</td>
      <td class="owner" contenteditable="true"></td>
    `;
    tbody.appendChild(tr);
  }
})();

function UPDATE_IT_VIEW() {
  const systems = window.GALAXY_STATE?.systems || {};

  document.querySelectorAll("#itTableBody tr").forEach(tr => {
    const ip = tr.dataset.ip;
    const sys = systems[ip];
    const state = GALAXY_CLASSIFY(sys);

    const status = tr.querySelector(".status");
    const health = tr.querySelector(".health");
    const cpuEl = tr.querySelector(".cpu");
    const ramEl = tr.querySelector(".ram");
    const diskEl = tr.querySelector(".disk");

    if (state === "offline") {
      status.innerText = "OFFLINE";
      status.className = "status red";
      cpuEl.innerText = ramEl.innerText = diskEl.innerText = "0%";
      health.innerText = "LOW";
      health.className = "health green";
      return;
    }

    const diskP = GALAXY_DISK_PERCENT(sys);
    status.innerText = "ONLINE";
    status.className = "status green";

    cpuEl.innerText = `${sys.CPU}%`;
    ramEl.innerText = `${sys.RAM}%`;
    diskEl.innerText = GALAXY_DISK_TEXT(sys);

    cpuEl.style.color = sys.CPU >= 80 ? "#ef4444" : "#4ade80";
    ramEl.style.color = sys.RAM >= 80 ? "#ef4444" : "#4ade80";
    diskEl.style.color = diskP >= 80 ? "#ef4444" : "#4ade80";

    if (state === "critical") {
      health.innerText = "HIGH";
      health.className = "health red";
    } else if (state === "slow") {
      health.innerText = "MEDIUM";
      health.className = "health orange";
    } else {
      health.innerText = "LOW";
      health.className = "health green";
    }
  });
}

// =============================================================
// 🗺️ LAN MAP — STATIC GRID
// =============================================================
(function BUILD_LAN_MAP() {
  const lan = document.getElementById("lanMap");
  if (!lan) return;

  for (let i = 1; i <= 250; i++) {
    const node = document.createElement("div");
    node.className = "lan-node offline";
    node.dataset.ip = `192.168.1.${i}`;
    node.innerText = i;
    lan.appendChild(node);
  }
})();

function UPDATE_LAN_MAP() {
  const systems = window.GALAXY_STATE?.systems || {};
  document.querySelectorAll(".lan-node").forEach(n => {
    n.className = "lan-node " + GALAXY_CLASSIFY(systems[n.dataset.ip]);
  });
}

// =============================================================
// 🧠 AI EXECUTIVE SUMMARY — MERGED OPS LAYER
// =============================================================
(function GALAXY_AI_EXEC() {
  const root = document.getElementById("aiRootCause");
  const pred = document.getElementById("aiPrediction");
  const act  = document.getElementById("aiActions");
  if (!root || !pred || !act) return;

  function explain(level) {
    if (level === "critical") {
      return {
        root: "System is under heavy load",
        pred: "Service slowdown may happen",
        act: "• Reduce CPU/RAM load\n• Restart heavy apps\n• Check disk usage"
      };
    }
    if (level === "slow") {
      return {
        root: "System resources are getting busy",
        pred: "May slow down if usage increases",
        act: "• Monitor usage\n• Close unused programs"
      };
    }
    return {
      root: "All systems are working normally",
      pred: "No problems expected",
      act: "• No action needed"
    };
  }

  function updateAI() {
    const systems = window.GALAXY_STATE?.systems || {};
    let level = "online";

    for (const ip in systems) {
      const s = GALAXY_CLASSIFY(systems[ip]);
      if (s === "critical") { level = s; break; }
      if (s === "slow") level = s;
    }

    const t = explain(level);
    root.innerText = t.root;
    pred.innerText = t.pred;
    act.innerText  = t.act;
  }

  window.GALAXY_AI_UPDATE = updateAI;
})();

// =============================================================
// 📡 LIVE EVENT BIND — SINGLE POINT
// =============================================================
window.addEventListener("GALAXY_DATA_UPDATE", () => {
  GALAXY_UPDATE_GLOBAL_UI();
  UPDATE_IT_VIEW();
  UPDATE_LAN_MAP();
  if (window.GALAXY_AI_UPDATE) window.GALAXY_AI_UPDATE();
});

// =============================================================
// 🚀 INITIAL SYNC
// =============================================================
setTimeout(() => {
  if (window.GALAXY_STATE?.systems) {
    GALAXY_UPDATE_GLOBAL_UI();
    UPDATE_IT_VIEW();
    UPDATE_LAN_MAP();
    if (window.GALAXY_AI_UPDATE) window.GALAXY_AI_UPDATE();
  }
}, 800);
document.addEventListener("DOMContentLoaded", async () => {
  await loadLanMeta();
});
function openRemoteAccess() {
  if (window.GalaxyAPI && window.GalaxyAPI.openHelpWire) {
    window.GalaxyAPI.openHelpWire();
  } else {
    console.warn("GalaxyAPI not available (browser mode)");
  }
}
