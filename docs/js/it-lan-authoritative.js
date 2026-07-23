// =============================================================
// 🚀 RPP BEAST GALAXY — IT + LAN COMMAND CENTER (SYNC ONLY)
// NO BUILD • NO DUPLICATES • LIVE UPDATE ONLY
// =============================================================

console.log("🛰️ IT + LAN SYNC MODULE LOADED");

(function () {

  // 🔒 HARD SINGLETON
  if (window.__GALAXY_LAN_SYNC__) {
    console.warn("🛑 IT + LAN sync already running");
    return;
  }
  window.__GALAXY_LAN_SYNC__ = true;

  const tbody  = document.getElementById("itTableBody");
  const lanMap = document.getElementById("lanMap");

  if (!tbody || !lanMap) {
    console.warn("⚠️ IT / LAN elements missing");
    return;
  }

  // ================= CONFIG =================
  const IT_OFFLINE_MS  = 4000;
  const LAN_OFFLINE_MS = 1500;

  // ================= STATE =================
  const LAST_SEEN = {};

  // ================= HEALTH =================
  function health(sys) {
    if (!sys || !sys.lastSeen) return "offline";
    if (Date.now() - sys.lastSeen > IT_OFFLINE_MS) return "offline";
    if (sys.CPU >= 80 || sys.RAM >= 80) return "high";
    if (sys.CPU >= 60 || sys.RAM >= 60) return "medium";
    return "low";
  }

  const color = v =>
    v >= 80 ? "#ef4444" :
    v >= 60 ? "#f59e0b" :
    "#22c55e";

  // ================= LIVE UPDATE =================
  function updateAll() {
    const systems = window.GALAXY_STATE?.systems || {};
    const now = Date.now();

    // ---- IT TABLE ----
    tbody.querySelectorAll("tr").forEach(row => {
      const ip = row.dataset.ip;
      const sys = systems[ip];

      if (sys) LAST_SEEN[ip] = now;

      const state = health(sys);

      const statusEl = row.querySelector(".status");
      const cpuEl    = row.querySelector(".cpu");
      const ramEl    = row.querySelector(".ram");
      const diskEl   = row.querySelector(".disk");
      const healthEl = row.querySelector(".health");

      if (state === "offline") {
        statusEl.innerText = "OFFLINE";
        statusEl.className = "status red";
        healthEl.innerText = "OFFLINE";
        healthEl.className = "health red";
        cpuEl.innerText = ramEl.innerText = diskEl.innerText = "0%";
        return;
      }

      statusEl.innerText = "ONLINE";
      statusEl.className = "status green";

      cpuEl.innerText  = sys.CPU + "%";
      ramEl.innerText  = sys.RAM + "%";
      diskEl.innerText =
        Array.isArray(sys.Disk) ? sys.Disk[0]?.usedPercent + "%" : "0%";

      cpuEl.style.color = color(sys.CPU);
      ramEl.style.color = color(sys.RAM);

      healthEl.innerText = state.toUpperCase();
      healthEl.className =
        "health " + (state === "high" ? "red" : state === "medium" ? "orange" : "green");
    });

    // ---- LAN MAP ----
    lanMap.querySelectorAll(".lan-node").forEach(node => {
      const ip = node.dataset.ip;
      const last = LAST_SEEN[ip];

      if (!last || now - last > LAN_OFFLINE_MS) {
        node.className = "lan-node offline";
      } else {
        node.className = "lan-node online";
      }
    });
  }

  window.addEventListener("GALAXY_DATA_UPDATE", updateAll);

})();
