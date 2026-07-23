// =============================================================
// 🟢 GALAXY LAN LIVE METRICS — SINGLE AUTHORITY
// =============================================================

console.log("🧭 LAN LIVE METRICS READY");

(function () {

  const panel = document.getElementById("lanMetricPanel");
  if (!panel) {
    console.warn("❌ lanMetricPanel missing");
    return;
  }

  const ipEl     = document.getElementById("lanMetricIP");
  const hostEl   = document.getElementById("lanMetricHost");
  const ownerEl  = document.getElementById("lanMetricOwner");
  const summary  = document.getElementById("lanLiveSummary");
  const canvas   = document.getElementById("lanMetricChart");
  const closeBtn = document.getElementById("lanMetricClose");

  let selectedIP = null;
  let chart = null;

  // ---------- INIT ----------
  panel.classList.remove("show");
  panel.classList.add("hidden");

  function initChart() {
    if (chart || !canvas) return;

    chart = new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels: [],
        datasets: [
          { label: "CPU %", borderColor: "#22c55e", data: [] },
          { label: "RAM %", borderColor: "#38bdf8", data: [] }
        ]
      },
      options: {
        animation: false,
        scales: { y: { min: 0, max: 100 } }
      }
    });
  }

  // ---------- OPEN ----------
  function openPanel(ip) {
    const sys = window.GALAXY_STATE?.systems?.[ip];
    if (!sys) {
      console.warn("⚠️ No data for", ip);
      return;
    }

    selectedIP = ip;

    ipEl.innerText    = ip;
    hostEl.innerText  = sys.Hostname || "";
    ownerEl.innerText = sys.Person || "";

    panel.classList.remove("hidden");
    requestAnimationFrame(() => panel.classList.add("show"));

    initChart();
    console.log("📊 OPEN LAN METRICS →", ip);
  }

  // ---------- CLOSE ----------
  function closePanel() {
    panel.classList.remove("show");
    setTimeout(() => {
      panel.classList.add("hidden");
      selectedIP = null;
    }, 300);
  }

  closeBtn?.addEventListener("click", closePanel);

  // ---------- LAN NODE CLICK ----------
  document.addEventListener("click", e => {
    const node = e.target.closest(".lan-node");
    if (!node) return;
    openPanel(node.dataset.ip);
  });

  // ---------- LIVE UPDATE ----------
  window.addEventListener("GALAXY_DATA_UPDATE", () => {
    if (!selectedIP || !chart) return;

    const sys = window.GALAXY_STATE?.systems?.[selectedIP];
    if (!sys) return;

    chart.data.labels.push(new Date().toLocaleTimeString());
    chart.data.datasets[0].data.push(sys.CPU || 0);
    chart.data.datasets[1].data.push(sys.RAM || 0);

    if (chart.data.labels.length > 15) {
      chart.data.labels.shift();
      chart.data.datasets.forEach(d => d.data.shift());
    }

    chart.update();

    summary.innerHTML = `
      <b>CPU:</b> ${sys.CPU}% &nbsp; | &nbsp;
      <b>RAM:</b> ${sys.RAM}%
    `;
  });

})();
// 🌐 GLOBAL OPEN API (AUTHORITATIVE)
window.GalaxyOpenLanMetrics = function (ip) {
  if (!ip) return;
  const node = document.querySelector(`.lan-node[data-ip="${ip}"]`);
  if (!node) {
    console.warn("❌ LAN node not found for", ip);
    return;
  }
  node.click(); // reuse existing logic
};
