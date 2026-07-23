// =============================================================
// 🛰️ RPP BEAST GALAXY — IT COMMAND CENTER (LIVE SAFE)
// Reads GALAXY_STATE only • No mutation • No socket touch
// =============================================================

(function () {
  if (window.__GALAXY_IT_VIEW__) return;
  window.__GALAXY_IT_VIEW__ = true;

  console.log("🖥️ IT COMMAND CENTER [LIVE SAFE] LOADED");

  const tableBody = document.getElementById("itTableBody");
  if (!tableBody) return;

  // ---------- COLOR LOGIC ----------
  function metricColor(v) {
    if (v >= 90) return "#ef4444";
    if (v >= 75) return "#f59e0b";
    return "#22c55e";
  }

  // ---------- HEALTH ----------
  function health(sys) {
    if (!sys) return "OFFLINE";
    if (sys.CPU >= 90 || sys.RAM >= 90) return "CRITICAL";
    if (sys.CPU >= 75 || sys.RAM >= 80) return "SLOW";
    return "LOW";
  }

  // ---------- DISK NORMALIZER ----------
  function getDiskUsed(sys) {
    let diskUsed = 0;

    if (typeof sys.Disk === "object" && sys.Disk !== null) {
      const vals = Object.values(sys.Disk).filter(v => typeof v === "number");
      if (vals.length) diskUsed = Math.max(...vals);
    } else if (typeof sys.Disk === "number") {
      diskUsed = sys.Disk;
    }

    return diskUsed;
  }

  // ---------- RENDER ----------
  function render() {
    const systems = window.GALAXY_STATE?.systems || {};
    tableBody.innerHTML = "";

    Object.keys(systems).sort().forEach(ip => {
      const sys = systems[ip];
      const tr = document.createElement("tr");

      const cpu = typeof sys.CPU === "number" ? sys.CPU : 0;
      const ram = typeof sys.RAM === "number" ? sys.RAM : 0;
      const disk = getDiskUsed(sys);

      tr.innerHTML = `
        <td>${ip}</td>
        <td>${sys.Hostname || "-"}</td>
        <td>${sys ? "ONLINE" : "OFFLINE"}</td>

        <td style="color:${metricColor(cpu)}">${cpu.toFixed(1)}%</td>
        <td style="color:${metricColor(ram)}">${ram.toFixed(1)}%</td>
        <td style="color:${metricColor(disk)}">${disk.toFixed(1)}%</td>

        <td>${health(sys)}</td>
        <td>${sys.Owner || "-"}</td>
      `;

      tableBody.appendChild(tr);
    });
  }

  // ---------- LIVE BIND ----------
  window.addEventListener("GALAXY_DATA_UPDATE", render);

  // First paint
  render();

})();
