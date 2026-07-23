// =======================================================
// 🧠 RPP BEAST GALAXY — RISK ENGINE (BROWSER SAFE)
// SINGLE AUTHORITY • NO MODULES • NO EXPORTS
// =======================================================

console.log("🧠 GALAXY RISK ENGINE LOADED");

// -------------------------------------------------------
// GLOBAL RISK CALCULATOR
// Used by: AI View, IT View, Executive Summary
// -------------------------------------------------------
window.calculateRisk = function (sys) {
  if (!sys) {
    return { risk: 0, reasons: [] };
  }

  let risk = 0;
  let reasons = [];

  // ---------------- CPU ----------------
  if (sys.CPU >= 85) {
    risk += 30;
    reasons.push("CPU usage above 85%");
  }

  // ---------------- RAM ----------------
  if (sys.RAM >= 90) {
    risk += 40;
    reasons.push("RAM utilization exceeds safe threshold");
  }

  // ---------------- DISK ----------------
  if (typeof sys.Disk === "number" && sys.Disk >= 90) {
    risk += 20;
    reasons.push("Disk space critically low");
  }

  if (Array.isArray(sys.Disk)) {
    sys.Disk.forEach(d => {
      if (d.usedPercent >= 90) {
        risk += 20;
        reasons.push(`Disk ${d.drive} nearly full`);
      }
    });
  }

  // ---------------- OFFLINE ----------------
  if (sys.Status === "OFFLINE") {
    risk += 10;
    reasons.push("System unreachable / offline");
  }

  // ---------------- FINAL CLAMP ----------------
  risk = Math.min(risk, 100);

  return {
    risk,
    reasons
  };
};
