// =============================================================
// 🧠 RPP BEAST GALAXY — AI EXECUTIVE SUMMARY (GLOBAL)
// ALL SYSTEMS • SOCKET DRIVEN • NO SERVER TOUCH
// =============================================================

(function () {
  if (window.__GALAXY_AI_EXEC__) return;
  window.__GALAXY_AI_EXEC__ = true;

  console.log("🧠 AI EXECUTIVE SUMMARY — GLOBAL MODE");

  const analysisBox = document.getElementById("aiAnalysisLog");
  const rootBox = document.getElementById("aiRootCause");
  const predictionBox = document.getElementById("aiPrediction");
  const actionBox = document.getElementById("aiActions");

  if (!analysisBox || !rootBox || !predictionBox || !actionBox) {
    console.warn("AI Executive DOM not ready");
    return;
  }

  /* ================= CLASSIFIER ================= */
  function classify(sys) {
    if (!sys || !sys.lastSeen) return "OFFLINE";
    if (sys.CPU >= 85 || sys.RAM >= 85 || sys.Disk >= 90) return "CRITICAL";
    if (sys.CPU >= 70 || sys.RAM >= 70 || sys.Disk >= 80) return "HIGH";
    if (sys.CPU >= 50 || sys.RAM >= 50) return "SLOW";
    return "NORMAL";
  }

  function rootCause(sys) {
    const causes = [];
    if (sys.CPU >= 80) causes.push("High CPU load");
    if (sys.RAM >= 80) causes.push("Memory pressure");
    if (sys.Disk >= 90) causes.push("Disk saturation");
    if (!sys.Internet) causes.push("Internet unreachable");
    return causes.join(" / ") || "No abnormal pattern";
  }

  function prediction(level) {
    switch (level) {
      case "CRITICAL": return "Failure probability very high";
      case "HIGH": return "Performance degradation likely";
      case "SLOW": return "Potential slowdown trend";
      case "OFFLINE": return "System unreachable";
      default: return "Stable";
    }
  }

  function actions(level) {
    switch (level) {
      case "CRITICAL":
        return [
          "Immediate investigation required",
          "Reduce CPU / RAM load",
          "Check hardware & services"
        ];
      case "HIGH":
        return [
          "Monitor resource usage",
          "Check background processes"
        ];
      case "SLOW":
        return [
          "Observe trends",
          "Optimize applications"
        ];
      case "OFFLINE":
        return [
          "Check power",
          "Verify LAN cable",
          "Confirm network switch port"
        ];
      default:
        return ["No action required"];
    }
  }

  /* ================= RENDER ================= */
  function renderAI() {
    const systems = window.GALAXY_STATE?.systems;
    if (!systems) return;

    const now = new Date().toLocaleTimeString();
    analysisBox.innerHTML = "";
    rootBox.innerHTML = "";
    predictionBox.innerHTML = "";
    actionBox.innerHTML = "";

    let anyRisk = false;

    for (const ip in systems) {
      const sys = systems[ip];
      const level = classify(sys);

      if (level === "NORMAL") continue;
      anyRisk = true;

      // === ANALYSIS LOG ===
      const log = document.createElement("div");
      log.textContent =
        `${now} | ${ip} | ${level} | CPU ${sys.CPU}% RAM ${sys.RAM}% DISK ${sys.Disk}%`;
      analysisBox.appendChild(log);

      // === ROOT CAUSE ===
      const rc = document.createElement("div");
      rc.textContent = `${ip}: ${rootCause(sys)}`;
      rootBox.appendChild(rc);

      // === PREDICTION ===
      const pr = document.createElement("div");
      pr.textContent = `${ip}: ${prediction(level)}`;
      predictionBox.appendChild(pr);

      // === ACTIONS ===
      const ul = document.createElement("ul");
      actions(level).forEach(a => {
        const li = document.createElement("li");
        li.textContent = `${ip}: ${a}`;
        ul.appendChild(li);
      });
      actionBox.appendChild(ul);
    }

    if (!anyRisk) {
      analysisBox.textContent = "All systems operating normally";
      rootBox.textContent = "No risk detected";
      predictionBox.textContent = "Stable environment";
      actionBox.textContent = "No actions required";
    }
  }

  /* ================= SOCKET BIND ================= */
  window.addEventListener("GALAXY_DATA_UPDATE", renderAI);

})();
function GALAXY_SIMPLE_AI_REPORT() {
  const systems = window.GALAXY_STATE?.systems || {};
  let report = [];

  for (const ip in systems) {
    const s = systems[ip];
    if (!s) continue;

    if (s.CPU >= 80 || s.RAM >= 80) {
      report.push(
`🔴 ${ip}
Reason: CPU ${s.CPU}% | RAM ${s.RAM}%
Action: Restart service or reduce load`
      );
    }
    else if (s.CPU >= 60 || s.RAM >= 60) {
      report.push(
`🟠 ${ip}
Reason: Moderate load
Action: Monitor system`
      );
    }
  }

  if (!report.length) {
    report.push("🟢 All systems healthy. No action required.");
  }

  document.getElementById("aiRootCause").innerText = report.join("\n\n");
  document.getElementById("aiPrediction").innerText =
    "Prediction: Systems will stabilize after corrective actions.";
  document.getElementById("aiActions").innerText =
    "Recommended: Act only on highlighted IPs.";
}
