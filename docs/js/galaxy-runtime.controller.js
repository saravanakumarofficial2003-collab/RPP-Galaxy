// =======================================================
// 🌌 GALAXY RUNTIME CONTROLLER — FINAL SINGLE AUTHORITY
// View Control • AMC • AI • LAN • Network
// =======================================================

console.log("🌌 Galaxy Runtime Controller [FINAL AUTHORITY] Loaded");

(function () {

  if (window.__GALAXY_RUNTIME__) return;
  window.__GALAXY_RUNTIME__ = true;

  // ================= VIEW MAP =================
  const VIEW_MAP = {
    md:  "mdView",
    ceo: "mdView",
    it:  "itView",
    ai:  "aiView"
  };

  // ================= MAIN SWITCH =================
  window.GalaxyShowView = function (view) {
    console.log("🔀 GalaxyShowView →", view);

    // Hide all views
    Object.values(VIEW_MAP).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });

    // Show target
    const realId = VIEW_MAP[view] || "mdView";
    const target = document.getElementById(realId);
    if (target) target.style.display = "block";

    // Track state
    window.GALAXY = window.GALAXY || {};
    window.GALAXY.CURRENT_VIEW = view;

    // ================= IT VIEW =================
    if (view === "it") {
      // Wake AMC
      if (typeof window.GalaxyOpenAMC === "function") {
        setTimeout(GalaxyOpenAMC, 50);
      }

      // LAN refresh
      if (window.GALAXY_STATE) {
        window.dispatchEvent(new Event("GALAXY_DATA_UPDATE"));
      }
    }

    // ================= AI VIEW =================
    if (view === "ai") {
      if (typeof window.GALAXY_AI_UPDATE === "function") {
        setTimeout(window.GALAXY_AI_UPDATE, 50);
      }
    }

    // ================= MD VIEW =================
    if (view === "md") {
      if (window.GALAXY_STATE) {
        window.dispatchEvent(new Event("GALAXY_DATA_UPDATE"));
      }
    }
  };

  // ================= BUTTON BINDING =================
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".view-switch button").forEach(btn => {
      const txt = btn.innerText.trim().toUpperCase();
      if (txt.includes("MD"))  btn.onclick = () => GalaxyShowView("md");
      if (txt.includes("CEO")) btn.onclick = () => GalaxyShowView("ceo");
      if (txt.includes("IT"))  btn.onclick = () => GalaxyShowView("it");
      if (txt.includes("AI"))  btn.onclick = () => GalaxyShowView("ai");
    });

    // Default view
    GalaxyShowView("md");
  });

})();
