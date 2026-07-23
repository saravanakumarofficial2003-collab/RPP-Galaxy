// =============================================================
// 📊 GALAXY AI – MINI IP TREND GRAPH (LIVE, SAFE ADD-ON)
// LOW = GOOD (DOWN) | HIGH = RISK (UP)
// Click IP → see trend
// NO socket damage • NO duplication • CLEAN UI
// =============================================================

(function () {
  if (window.__GALAXY_AI_MINI_GRAPH__) return;
  window.__GALAXY_AI_MINI_GRAPH__ = true;

  const HISTORY = {}; // { ip: [score, score, ...] }
  const MAX_POINTS = 30;

  // ---------------------------------------------
  // 🧠 Convert system state → numeric score
  // LOWER = BETTER
  // ---------------------------------------------
  function scoreSystem(sys) {
    if (!sys || !sys.lastSeen) return 100;

    let score = 0;
    score += sys.CPU || 0;
    score += sys.RAM || 0;
    score += sys.Disk || 0;

    return Math.min(100, Math.round(score / 3));
  }

  // ---------------------------------------------
  // 📡 Collect live data (NO new socket)
  // ---------------------------------------------
  function collect() {
    const systems = window.GALAXY_STATE?.systems || {};

    for (const ip in systems) {
      const s = systems[ip];
      const v = scoreSystem(s);

      if (!HISTORY[ip]) HISTORY[ip] = [];
      HISTORY[ip].push(v);

      if (HISTORY[ip].length > MAX_POINTS)
        HISTORY[ip].shift();
    }
  }

  // ---------------------------------------------
  // 📊 Render mini graph (canvas)
  // ---------------------------------------------
  function drawGraph(ip) {
    let box = document.getElementById("aiMiniGraph");
    if (!box) {
      box = document.createElement("div");
      box.id = "aiMiniGraph";
      box.style.marginTop = "12px";
      box.style.padding = "12px";
      box.style.background = "#020617";
      box.style.borderRadius = "10px";
      box.style.border = "1px solid rgba(148,163,184,0.15)";
      document.getElementById("aiPanel")?.appendChild(box);
    }

    box.innerHTML = `
      <div style="font-size:12px;color:#93c5fd;margin-bottom:6px">
        IP Trend: ${ip} (LOW ↓ = GOOD)
      </div>
      <canvas id="aiMiniCanvas" width="260" height="80"></canvas>
    `;

    const canvas = document.getElementById("aiMiniCanvas");
    const ctx = canvas.getContext("2d");
    const data = HISTORY[ip] || [];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (data.length < 2) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((v, i) => {
      // INVERT: low value → lower graph (GOOD)
      const x = (i / (data.length - 1)) * w;
      const y = h - (v / 100) * h;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
  }

  // ---------------------------------------------
  // 🖱️ Click IP from AI timeline
  // ---------------------------------------------
  document.addEventListener("click", e => {
    const t = e.target;
    if (!t || !t.innerText) return;

    const match = t.innerText.match(/192\.168\.1\.\d+/);
    if (match) {
      drawGraph(match[0]);
    }
  });

  // ---------------------------------------------
  // 🔄 Bind to existing live event
  // ---------------------------------------------
  window.addEventListener("GALAXY_DATA_UPDATE", () => {
    collect();
  });

})();
