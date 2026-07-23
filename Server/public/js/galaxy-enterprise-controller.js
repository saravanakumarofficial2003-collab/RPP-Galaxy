// =====================================================
// 🌌 GALAXY ENTERPRISE CONTROLLER – FINAL
// =====================================================

console.log("🌌 Galaxy Enterprise Controller Loaded");

// =====================================================
// 🛡️ GLOBAL CRASH GUARD
// =====================================================
window.onerror = function (msg, src, line, col, err) {
  console.error("🛡️ Galaxy Guard:", msg, "at", line + ":" + col);
  return true; // prevent UI crash
};

// =====================================================
// 🌐 CONSTANTS
// =====================================================
const IP_RANGE = [];
for (let i = 1; i <= 250; i++) {
  IP_RANGE.push(`192.168.1.${i}`);
}

// =====================================================
// 🧠 PERSISTENT METADATA (HOST + OWNER NEVER RESET)
// =====================================================
const META_KEY = "GALAXY_IP_META";
const META = JSON.parse(localStorage.getItem(META_KEY) || "{}");

function saveMeta() {
  localStorage.setItem(META_KEY, JSON.stringify(META));
}

// =====================================================
// 🧠 HEALTH + AI RISK ENGINE
// =====================================================
function health(sys) {
  if (!sys) return "offline";
  if (sys.Source === "NONE") return "offline";
  if (sys.CPU > 85 || sys.RAM > 85 || sys.Disk > 90) return "critical";
  return "online";
}

function aiExplain(sys) {
  const reasons = [];
  if (sys.CPU > 85) reasons.push(`High CPU usage (${sys.CPU}%)`);
  if (sys.RAM > 85) reasons.push(`High RAM usage (${sys.RAM}%)`);
  if (sys.Disk > 90) reasons.push(`Low disk space (${sys.Disk}%)`);
  if (!reasons.length) reasons.push("System operating within safe limits");

  return reasons.join(" • ");
}

// =====================================================
// 🧾 IT COMMAND CENTER – STATIC ROWS (CREATED ONCE)
// =====================================================
const tbody = document.getElementById("itTableBody");

IP_RANGE.forEach(ip => {
  const tr = document.createElement("tr");
  tr.dataset.ip = ip;

  tr.innerHTML = `
    <td>${ip}</td>
    <td contenteditable="true" class="host"></td>
    <td class="status">OFFLINE</td>
    <td class="cpu">--%</td>
    <td class="ram">--%</td>
    <td class="disk">--%</td>
    <td class="health">OFFLINE</td>
    <td contenteditable="true" class="owner"></td>
  `;

  // restore saved values
  if (META[ip]) {
    tr.querySelector(".host").innerText = META[ip].host || "";
    tr.querySelector(".owner").innerText = META[ip].owner || "";
  }

  tr.querySelector(".host").onblur = () => {
    META[ip] = META[ip] || {};
    META[ip].host = tr.querySelector(".host").innerText;
    saveMeta();
  };

  tr.querySelector(".owner").onblur = () => {
    META[ip] = META[ip] || {};
    META[ip].owner = tr.querySelector(".owner").innerText;
    saveMeta();
  };

  tbody.appendChild(tr);
});

// =====================================================
// 🗺️ LAN MAP – STATIC GRID
// =====================================================
const lan = document.getElementById("lanMap");
IP_RANGE.forEach(ip => {
  const d = document.createElement("div");
  d.className = "lan-node offline";
  d.dataset.ip = ip;
  d.innerText = ip.split(".")[3];
  lan.appendChild(d);
});

// =====================================================
// 🔄 LIVE UPDATE (EVERY DATA PUSH)
// =====================================================
function updateUI(systems) {
  IP_RANGE.forEach(ip => {
    const sys = systems[ip];
    const h = health(sys);

    // ===== IT TABLE UPDATE =====
    const row = tbody.querySelector(`tr[data-ip="${ip}"]`);
    if (!row) return;

    row.querySelector(".status").innerText = sys?.Status || "OFFLINE";
    row.querySelector(".cpu").innerText = (sys?.CPU ?? "--") + "%";
    row.querySelector(".ram").innerText = (sys?.RAM ?? "--") + "%";
    row.querySelector(".disk").innerText = (sys?.Disk ?? "--") + "%";
    row.querySelector(".health").innerText = h.toUpperCase();

    row.className = h;

    // ===== LAN MAP SYNC =====
    const node = lan.querySelector(`[data-ip="${ip}"]`);
    if (node) {
      node.className = "lan-node " + h;
      node.title = aiExplain(sys || {});
    }
  });
}

// =====================================================
// 📡 GALAXY LIVE DATA HOOK
// =====================================================
window.addEventListener("GALAXY_DATA_UPDATE", () => {
  if (!window.GALAXY_STATE?.systems) return;
  updateUI(GALAXY_STATE.systems);
});

// fallback refresh (3 sec safety)
setInterval(() => {
  if (window.GALAXY_STATE?.systems) {
    updateUI(GALAXY_STATE.systems);
  }
}, 3000);

// =====================================================
// 🧠 AI RISK POPUP (CLICK LAN NODE)
// =====================================================
lan.onclick = e => {
  const ip = e.target.dataset.ip;
  if (!ip || !GALAXY_STATE.systems[ip]) return;

  const s = GALAXY_STATE.systems[ip];
  alert(
    `🧠 AI RISK ANALYSIS – ${ip}\n\n` +
    `CPU: ${s.CPU}%\nRAM: ${s.RAM}%\nDisk: ${s.Disk}%\n\n` +
    aiExplain(s)
  );
};
