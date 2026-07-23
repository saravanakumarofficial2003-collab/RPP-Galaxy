// =======================================================
// 🚀 GALAXY STARTUP SEQUENCE
// =======================================================

document.addEventListener("DOMContentLoaded", () => {
  const boot = document.getElementById("bootScreen");
  if (!boot) return;

  setTimeout(() => {
    if (window.GalaxyPlayVoice) {
      GalaxyPlayVoice("JARVIS", "BOOT");
    }
  }, 300);

  setTimeout(() => {
    boot.style.opacity = "0";
    setTimeout(() => boot.remove(), 1000);
  }, 4500);
});
