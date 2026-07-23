// =============================================================
// 🗺️ GALAXY LAN MAP → MINI GRAPH VIEW (IT COMMAND CENTER)
// CPU / RAM / DISK • LIVE • CLICK DRIVEN
// =============================================================

(function () {
  if (window.__GALAXY_LAN_MINI_GRAPH__) return;
  window.__GALAXY_LAN_MINI_GRAPH__ = true;

  console.log("📊 LAN MAP MINI GRAPH [LIVE] LOADED");

  let chart = null;
  let activeIP = null;
  const HISTORY = {};

  // =============================================================
  // 🧱 PANEL CREATE (ONCE)
  // =============================================================
  function ensurePanel() {
    let panel = document.getElementById("lanMiniGraphPanel");
    if (panel) return panel;

    panel = document.createElement("div");
    panel.id = "lanMiniGraphPanel";
    panel.style.marginTop = "16px";
    panel.style.background = "rgba(2,6,23,.85)";
    panel.style.borderRadius = "14px";
    panel.style.padding = "12px";
    panel.style.boxShadow = "0 0 30px rgba(56,189,248,.25)";
    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <b id="lanGraphTitle">SYSTEM GRAPH</b>
        <button onclick="closeLanMiniGraph()" style="background:none;border:none;color:#38bdf8;cursor:pointer">✖</button>
      </div>
      <canvas id="lanMiniGraphCanvas" height="120"></canvas>
    `;

    const itView = document.getElementById("itView");
    itView.appendChild(panel);

    return panel;
  }

  window.closeLanMiniGraph = function () {
    activeIP = null;
    const panel = document.getElementById("lanMiniGraphPanel");
    if (panel) panel.remove();
    if (chart) {
      chart.destroy();
      chart = null;
    }
  };

  // =============================================================
  // 📈 GRAPH INIT
  // =============================================================
  function initChart() {
    const ctx = document.getElementById("lanMiniGraphCanvas").getContext("2d");

    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "CPU %",
            data: [],
            tension: 0.4,
            borderWidth: 2
          },
          {
            label: "RAM %",
            data: [],
            tension: 0.4,
            borderWidth: 2
          },
          {
            label: "Disk %",
            data: [],
            tension: 0.4,
            borderWidth: 2
          }
        ]
      },
      options: {
        animation: false,
        responsive: true,
        scales: {
          y: {
            min: 0,
            max: 100
          }
        },
        plugins: {
          legend: {
            labels: { color: "#cbd5f5" }
          }
        }
      }
    });
  }

  // =============================================================
  // 🧠 UPDATE HISTORY
  // =============================================================
  function pushHistory(ip, sys) {
    if (!HISTORY[ip]) HISTORY[ip] = [];
    HISTORY[ip].push({
      t: new Date().toLocaleTimeString(),
      cpu: sys.CPU || 0,
      ram: sys.RAM || 0,
      disk: sys.Disk || 0
    });
    if (HISTORY[ip].length > 30) HISTORY[ip].shift();
  }

  // =============================================================
  // 🔄 GRAPH UPDATE
  // =============================================================
  function updateGraph() {
    if (!activeIP || !chart) return;
    const data = HISTORY[activeIP];
    if (!data) return;

    chart.data.labels = data.map(d => d.t);
    chart.data.datasets[0].data = data.map(d => d.cpu);
    chart.data.datasets[1].data = data.map(d => d.ram);
    chart.data.datasets[2].data = data.map(d => d.disk);
    chart.update();
  }

  // =============================================================
  // 🖱️ LAN NODE CLICK HOOK (SAFE)
  // =============================================================
  document.addEventListener("click", e => {
    const node = e.target.closest(".lan-node");
    if (!node || !node.dataset.ip) return;

    activeIP = node.dataset.ip;

    const panel = ensurePanel();
    document.getElementById("lanGraphTitle").innerText =
      `LIVE METRICS — ${activeIP}`;

    if (!chart) initChart();

    updateGraph();
  });

  // =============================================================
  // 📡 LIVE SOCKET BIND
  // =============================================================
  window.addEventListener("GALAXY_DATA_UPDATE", () => {
    if (!activeIP) return;
    const sys = window.GALAXY_STATE?.systems?.[activeIP];
    if (!sys) return;

    pushHistory(activeIP, sys);
    updateGraph();
  });

})();
