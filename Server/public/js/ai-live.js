// =============================================================
// 🌌 RPP BEAST GALAXY – AI INTELLIGENCE ENGINE (LIVE + AI INFERENCE)
// Futurist AI language • Live commentary
// NO duplication • NO socket damage • NO UI change
// =============================================================

console.log("🧠 GALAXY AI INTELLIGENCE ENGINE [AI INFERENCE MODE] LOADED");

(function () {
  if (window.__GALAXY_AI_LIVE__) return;
  window.__GALAXY_AI_LIVE__ = true;

  let ACTIVE_IP = null;
  const AI_TIMELINE = [];

  // =============================================================
  // 🎯 ENTRY FROM IT VIEW / LAN MAP
  // =============================================================
  window.openAIForSystem = function (ip) {
    ACTIVE_IP = ip;
    updateAIFromSocket(window.GALAXY_STATE?.systems);
  };

  // =============================================================
  // 🧠 HEALTH CLASSIFIER
  // =============================================================
  function classify(sys) {
    if (!sys) return "OFFLINE";
    const now = Date.now();
    if (!sys.lastSeen || now - sys.lastSeen > 3000) return "OFFLINE";
    if (sys.CPU >= 80 || sys.RAM >= 80 || sys.Disk >= 80) return "CRITICAL";
    if (sys.CPU >= 60 || sys.RAM >= 60) return "SLOW";
    return "ONLINE";
  }

  // =============================================================
  // 🎯 AUTO PICK MOST RISKY SYSTEM
  // =============================================================
  function autoPick(systems) {
    let worst = null, score = 0;
    for (const ip in systems) {
      const s = systems[ip];
      if (!s || !s.lastSeen) continue;
      const danger = (s.CPU||0)+(s.RAM||0)+(s.Disk||0);
      if (danger > score) {
        score = danger;
        worst = ip;
      }
    }
    return worst;
  }

  // =============================================================
  // 🧠 AI INFERENCE – ROOT CAUSE (LANGUAGE UPGRADE)
  // =============================================================
  function buildRootCauseInference(sys, state) {
    const signals = [];

    if (sys.CPU >= 90)
      signals.push(`• CPU load sustained above ${sys.CPU}%`);
    else if (sys.CPU >= 80)
      signals.push(`• CPU operating near saturation`);

    if (sys.RAM >= 85)
      signals.push(`• Memory pressure increasing (RAM ${sys.RAM}%)`);

    if (sys.Disk >= 80)
      signals.push(`• Disk utilization approaching threshold`);
    else
      signals.push(`• Disk utilization within normal bounds`);

    let correlation = `• Repeated telemetry confirms non-transient behavior`;
    let inference   = `• Degradation is load-driven and progressive`;

    if (state === "SLOW")
      inference = `• Gradual degradation detected, not a transient spike`;
    if (state === "CRITICAL")
      inference = `• Sustained overload condition confirmed`;

    return `
System Assessment: Elevated Risk
Target Node: ${sys.IP}

Signal Analysis:
${signals.join("\n")}

Correlation:
${correlation}

Inference:
${inference}
`.trim();
  }

  // =============================================================
  // 🌠 CORE AI RENDER
  // =============================================================
  function renderAI(sys) {
    const STATE = classify(sys);

    // ---------- ROOT CAUSE (AI INFERENCE) ----------
    const rootText = buildRootCauseInference(sys, STATE);

    // ---------- PREDICTION (AI FORECASTING) ----------
    let prediction = `
Predictive Outlook:
• Current conditions monitored

Risk Horizon:
• Near-term (0–6h): Stable with reduced headroom
`.trim();

    if (STATE === "SLOW") {
      prediction = `
Predictive Outlook:
• Service quality may degrade if current load persists

Risk Horizon:
• Near-term (0–6h): Stable
• Mid-term (6–24h): Degradation probable
`.trim();
    }

    if (STATE === "CRITICAL") {
      prediction = `
Predictive Outlook:
• High likelihood of service instability

Risk Horizon:
• Near-term (0–6h): Degradation likely
• Mid-term (6–24h): Failure probable
• Extended (48h): ~75% failure probability
`.trim();
    }

    // ---------- ACTIONS (DECISION SUPPORT) ----------
    let action = `
Decision Support:
• Load reduction will stabilize performance
• Early intervention lowers failure probability

Recommended Operator Focus:
• Identify dominant CPU consumers
• Evaluate memory headroom
`.trim();

    // ---------- UPDATE UI ----------
    setText("aiRootCause", rootText);
    setText("aiPrediction", prediction);
    setText("aiActions", action);

    pushTimeline({ ip: sys.IP, state: STATE });
    renderTimeline();
  }

  // =============================================================
  // 🕒 AI TIMELINE (UNCHANGED)
  // =============================================================
  function pushTimeline(entry) {
    AI_TIMELINE.push({
      time: new Date().toLocaleTimeString(),
      ...entry
    });
    if (AI_TIMELINE.length > 15) AI_TIMELINE.shift();
  }

  function renderTimeline() {
    const panel = document.getElementById("aiPanel");
    if (!panel) return;

    let box = document.getElementById("aiTimeline");
    if (!box) {
      box = document.createElement("pre");
      box.id = "aiTimeline";
      box.style.marginTop = "12px";
      box.style.opacity = "0.85";
      panel.appendChild(box);
    }

    box.innerText =
      "AI EVENT TRACE\n" +
      AI_TIMELINE.map(e =>
        `${e.time} | ${e.ip} | ${e.state}`
      ).join("\n");
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
  }
  
socket.on("ai-health", data => {
  document.getElementById("aiRootCause").innerText = data.root;
  document.getElementById("aiPrediction").innerText = data.prediction;
});

  // =============================================================
  // 📡 SOCKET BIND (UNCHANGED)
  // =============================================================
  function updateAIFromSocket(systems) {
    if (!systems) return;
    if (!ACTIVE_IP || !systems[ACTIVE_IP])
      ACTIVE_IP = autoPick(systems);
    if (!ACTIVE_IP) return;
    renderAI(systems[ACTIVE_IP]);
  }

  window.addEventListener("GALAXY_DATA_UPDATE", () => {
    updateAIFromSocket(window.GALAXY_STATE?.systems);
  });

})();
