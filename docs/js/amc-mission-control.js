// =============================================================
// 🌌 RPP BEAST GALAXY — AMC MISSION CONTROL v8.3 FINAL
// EXECUTIVE • STABLE • NO HEARTBEAT • NO LIVE DATA TOUCH
// =============================================================

(function () {
  if (window.__GALAXY_AMC_CORE__) return;
  window.__GALAXY_AMC_CORE__ = true;

  const STORE = "GALAXY_AMC_V83";

  /* ================= STORAGE ================= */
  const load = () => {
    try { return JSON.parse(localStorage.getItem(STORE)) || []; }
    catch { return []; }
  };
  const save = d => localStorage.setItem(STORE, JSON.stringify(d));

  /* ================= TIME ================= */
  const fmtDate = ts =>
    new Date(ts).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric"
    });

  function countdown(to) {
    let ms = to - Date.now();
    if (ms <= 0) return "RENEWAL REQUIRED";
    let s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400); s %= 86400;
    const h = Math.floor(s / 3600); s %= 3600;
    const m = Math.floor(s / 60); s %= 60;
    return `${d}D ${h}H ${m}M ${s}S`;
  }

  function progressPct(from, to) {
    const now = Date.now();
    if (now <= from) return 0;
    if (now >= to) return 100;
    return Math.min(
      100,
      Math.max(0, ((now - from) / (to - from)) * 100)
    );
  }

  /* ================= AI FORECAST ================= */
  function aiForecast(from, to) {
    const used = (Date.now() - from) / (to - from);
    if (used > 0.9) return "Renew immediately";
    if (used > 0.75) return "Prepare budget & approval";
    if (used > 0.5) return "Monitor renewal window";
    return "Contract healthy";
  }

  /* ================= RENDER ================= */
  function render() {
    const box = document.getElementById("amcContainer");
    if (!box) return;

    const list = load();

    box.innerHTML = `
      <div class="amc-header">
        <span class="amc-title-main">🛰️ AMC MISSION CONTROL</span>
        <button onclick="AMC_ADD()">＋ ADD AMC</button>
      </div>

      <div class="amc-stack">
        ${list.map((a,i)=>{
          const pct = progressPct(a.from, a.to);
          const spend = a.purchases.reduce((t,p)=>t+Number(p.amount||0),0);
          const costRatio = a.cost ? Math.min(100,(spend/a.cost)*100) : 0;

          return `
          <div class="amc-card">

            <div class="amc-top" onclick="AMC_TOGGLE(${i})">
              <div>
                <div class="amc-name">${a.name}</div>
                <div class="amc-sub">${a.vendor} • SERVICE CONTRACT</div>
              </div>
              <div class="amc-countdown">${countdown(a.to)}</div>
            </div>

            <!-- TIMELINE -->
            <div class="amc-timeline">
              <div class="amc-track">
                <div class="amc-progress" style="transform:scaleX(${pct/100})"></div>
                <span class="amc-mark m25"></span>
                <span class="amc-mark m50"></span>
                <span class="amc-mark m75"></span>
              </div>
            </div>

            <div class="amc-expand ${a.open?'open':''}" onclick="event.stopPropagation()">

              <div class="amc-dates">
                📅 ${fmtDate(a.from)} → ${fmtDate(a.to)}
              </div>

              <div class="amc-analytics">
                <div><b>AI Forecast:</b> ${aiForecast(a.from,a.to)}</div>
                <div><b>Total Spend:</b> ₹${spend}</div>
                <div class="cost-track">
                  <div class="cost-bar" style="width:${costRatio}%"></div>
                </div>
                <small>Cost vs Contract Value</small>
              </div>

            </div>
          </div>`;
        }).join("")}
      </div>
    `;
  }

  /* ================= ACTIONS ================= */
  window.AMC_TOGGLE = i => {
    const d = load();
    d[i].open = !d[i].open;
    save(d); render();
  };

  window.AMC_ADD = () => {
    const name = prompt("AMC Name");
    const vendor = prompt("Vendor");
    const months = Number(prompt("Duration (months)"));
    if (!name || !months) return;

    const from = Date.now();
    const to = from + months * 30 * 86400000;

    const d = load();
    d.push({
      id: Date.now(),
      name,
      vendor,
      from,
      to,
      cost: 0,
      purchases: [],
      open: false
    });
    save(d); render();
  };

  /* ================= LIVE TIMER ================= */
  render();
  setInterval(render, 1000);

})();
