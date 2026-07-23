// =============================================================
// 🚀 RPP BEAST GALAXY – IT COMMAND CENTER (FINAL AUTHORITATIVE)
// Socket-only • 3s Offline • No Flicker • Persistent Meta
// =============================================================

(function () {
  if (window.__GALAXY_IT_VIEW__) return;
  window.__GALAXY_IT_VIEW__ = true;

  const tbody = document.getElementById("itTableBody");
  if (!tbody) return;

  const OFFLINE_THRESHOLD = 3000; // ✅ 3 seconds EXACT

  const ROWS = {};
  const LAST_SEEN = {};
  const META_CACHE = {};

  // =============================================================
  // 🔒 META (HOST / OWNER – USER LOCKED)
  // =============================================================
  function loadMeta(ip) {
    if (META_CACHE[ip]) return META_CACHE[ip];
    try {
      META_CACHE[ip] =
        JSON.parse(localStorage.getItem("GALAXY_META_" + ip)) || {};
    } catch {
      META_CACHE[ip] = {};
    }
    return META_CACHE[ip];
  }

  function saveMeta(ip, field, value) {
    const meta = loadMeta(ip);
    meta[field] = value.trim();
    localStorage.setItem("GALAXY_META_" + ip, JSON.stringify(meta));
  }

  // =============================================================
  // 🧠 HEALTH CLASSIFIER (SINGLE SOURCE OF TRUTH)
  // =============================================================
  function health(sys) {
    if (!sys) return "offline";

    const now = Date.now();
    if (!sys.lastSeen || now - sys.lastSeen > OFFLINE_THRESHOLD)
      return "offline";

    if (sys.CPU >= 80 || sys.RAM >= 80 || sys.Disk >= 80) return "high";
    if (sys.CPU >= 60 || sys.RAM >= 60) return "medium";
    return "low";
  }

  function metricColor(v) {
    return v >= 80 ? "red" : "white";
  }
  function getLatencyColor(ms) {

  if (ms <= 5) return "#16a34a";     // green excellent
  if (ms <= 20) return "#22c55e";    // very good
  if (ms <= 50) return "#eab308";    // moderate
  if (ms <= 100) return "#f97316";   // slow
  return "#ef4444";                  // critical
}

  // =============================================================
  // 🧾 BUILD TABLE ONCE (NO REBUILD EVER)
  // =============================================================
  for (let i = 1; i <= 250; i++) {
    const ip = `192.168.1.${i}`;
    const tr = document.createElement("tr");
    tr.dataset.ip = ip;

    tr.innerHTML = `
      <td>${ip}</td>
      <td class="host" contenteditable="true"></td>
      <td class="status green">OFFLINE</td>
      <td class="cpu">0%</td>
      <td class="ram">0%</td>
      <td class="disk">0%</td>
      <td class="health green">LOW</td>
      <td class="owner" contenteditable="true"></td>
    `;

    tbody.appendChild(tr);
    ROWS[ip] = tr;

    const meta = loadMeta(ip);
    tr.querySelector(".host").innerText = meta.host || "";
    tr.querySelector(".owner").innerText = meta.owner || "";

    tr.querySelector(".host").addEventListener("blur", e =>
      saveMeta(ip, "host", e.target.innerText)
    );
    tr.querySelector(".owner").addEventListener("blur", e =>
      saveMeta(ip, "owner", e.target.innerText)
    );
  }

  // =============================================================
  // 🔄 SOCKET UPDATE ONLY (NO INTERVALS)
  // =============================================================
  function updateIT() {
    const systems = window.GALAXY_STATE?.systems || {};
    const now = Date.now();

    for (const ip in ROWS) {
      const row = ROWS[ip];
      const sys = systems[ip];
      const state = health(sys);

      // ---------------- OFFLINE ----------------
      if (state === "offline") {
        const last = LAST_SEEN[ip];
        const age = last ? Math.floor((now - last) / 1000) + "s" : "—";

        row.querySelector(".status").innerText = `OFFLINE (${age})`;
        row.querySelector(".status").className = "status red";
        row.querySelector(".health").innerText = "OFFLINE";
        row.querySelector(".health").className = "health red";
        continue;
      }

      // ---------------- ONLINE ----------------
      LAST_SEEN[ip] = now;

      row.querySelector(".status").innerText = "ONLINE";
      row.querySelector(".status").className = "status green";

      row.querySelector(".cpu").innerText = sys.CPU + "%";
      row.querySelector(".cpu").style.color = metricColor(sys.CPU);

      row.querySelector(".ram").innerText = sys.RAM + "%";
      row.querySelector(".ram").style.color = metricColor(sys.RAM);

      row.querySelector(".disk").innerText = sys.Disk + "%";
      row.querySelector(".disk").style.color = metricColor(sys.Disk);

      const h = row.querySelector(".health");
      if (state === "high") {
        h.innerText = "HIGH";
        h.className = "health red";
      } else if (state === "medium") {
        h.innerText = "MEDIUM";
        h.className = "health orange";
      } else {
        h.innerText = "LOW";
        h.className = "health green";
      }
    }
  }

  // =============================================================
  // 📡 SINGLE EVENT BIND (AUTHORITATIVE)
  // =============================================================
  window.addEventListener("GALAXY_DATA_UPDATE", updateIT);
})();
