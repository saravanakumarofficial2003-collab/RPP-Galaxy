// ======================================================
// 🌌 GALAXY → HELPWIRE REMOTE ACCESS (SECURE & FINAL)
// ======================================================

// Open HelpWire for a specific IP using saved Galaxy LAN meta
function openHelpWireForIP(ip) {
  // Load saved LAN metadata
  const meta = JSON.parse(localStorage.getItem("GALAXY_LAN_META") || "{}");

  // Use Host name if available, otherwise fallback to IP
  const clientName = meta[ip]?.host || ip;

  // Build HelpWire URL with client search filter
  const helpwireURL =
    "https://www.helpwire.app/account/358025/clients/1052542" +
    "?search=" + encodeURIComponent(clientName);

  // 🔐 MUST open in new tab (Auth0 secure-origin requirement)
  window.open(helpwireURL, "_blank", "noopener,noreferrer");
}

// ======================================================
// 🌌 GALAXY TOP TABS (UI ONLY — NO EMBEDDING)
// ======================================================

function showGalaxy() {
  const galaxyView = document.getElementById("galaxyView");
  const helpwireView = document.getElementById("helpwireView");

  if (galaxyView) galaxyView.style.display = "block";
  if (helpwireView) helpwireView.style.display = "none";

  setActiveTab(0);
}

function showHelpWire() {
  // No iframe, no embedded view
  alert("Remote Access opens in a secure browser tab.");
  setActiveTab(1);
}

function setActiveTab(index) {
  document.querySelectorAll("#tabs .tab").forEach((tab, i) => {
    tab.classList.toggle("active", i === index);
  });
}
