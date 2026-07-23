// =======================================================
// 🛡️ AI CYBER INTEL – SAFE PLACEHOLDER (NO MODULES)
// =======================================================

console.log("🛡️ AI CYBER INTEL MODULE LOADED");

window.GALAXY_CYBER_INTEL = function (systems = {}) {
  const alerts = [];

  Object.values(systems).forEach(sys => {
    if (!sys) return;

    if (sys.CPU > 90) {
      alerts.push({
        ip: sys.IP,
        level: "CRITICAL",
        reason: "CPU overload detected"
      });
    }

    if (sys.RAM > 95) {
      alerts.push({
        ip: sys.IP,
        level: "CRITICAL",
        reason: "RAM exhaustion risk"
      });
    }
  });

  return alerts;
};
