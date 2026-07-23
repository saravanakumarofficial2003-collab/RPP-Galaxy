// =============================================================
// 🌌 RPP BEAST GALAXY – ULTRA CORE STATE (SINGLE SOURCE)
// =============================================================

(function () {
  if (window.GALAXY_STATE) return;

  window.GALAXY_STATE = {
    systems: {},        // IP -> data (ONLY SOURCE)
    socket: null,
    connected: false,
    lastUpdate: 0
  };

  console.log("🧠 GALAXY CORE ENGINE INITIALIZED");
})();
