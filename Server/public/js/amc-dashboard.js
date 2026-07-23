// =========================================================
// 🛰️ AMC ENTERPRISE DASHBOARD — GIANT FINAL (STABLE)
// Dark UI • Editable • Saveable • INR Format
// AMC • Bank • Purchases • Requests / PO • SLA • Export
// NO AUTO CLOSE • NO WHITE INPUTS • NO FOCUS LOSS
// =========================================================

(function () {
  if (window.__AMC_ENTERPRISE_GIANT_FINAL__) return;
  window.__AMC_ENTERPRISE_GIANT_FINAL__ = true;

  console.log("🛰️ AMC ENTERPRISE GIANT FINAL LOADED");

  const STORE = "AMC_ENTERPRISE_GIANT_FINAL_V1";

  /* ================= STORAGE ================= */
  const load = () => {
    try { return JSON.parse(localStorage.getItem(STORE)) || []; }
    catch { return []; }
  };
  const save = d => localStorage.setItem(STORE, JSON.stringify(d));

  /* ================= UTIL ================= */
  const fmt = ts => new Date(ts).toLocaleDateString("en-GB");

const countdown = ms => {
  if (ms <= 0) return "EXPIRED";
  let total = Math.floor(ms / 1000);
  const d = Math.floor(total / 86400); total %= 86400;
  const h = Math.floor(total / 3600); total %= 3600;
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${d}D ${h}H ${m}M ${s}S`;
};
  const progress = (f, t) =>
    Math.min(100, Math.max(0,
      Math.floor(((Date.now() - f) / (t - f)) * 100)));

  const slaRisk = a => {
    const left = a.to - Date.now();
    if (left <= 0) return "CRITICAL";
    if (left < 7 * 86400000) return "HIGH";
    if (left < 30 * 86400000) return "MEDIUM";
    return "LOW";
  };

  /* ================= INR ================= */
  const formatINR = v =>
    "₹ " + Number(String(v).replace(/[^\d]/g, "") || 0)
      .toLocaleString("en-IN");

  const parseINR = v =>
    Number(String(v).replace(/[^\d]/g, "")) || 0;
// =======================================================
// 🧠 SAFE GLOBAL ACCESS (IMPORTANT)
// =======================================================
function __AMC_GET_DATA() {
  try {
    return JSON.parse(localStorage.getItem("AMC_ENTERPRISE_GIANT_FINAL_V1")) || [];
  } catch {
    return [];
  }
}

function __AMC_SAVE_DATA(d) {
  localStorage.setItem("AMC_ENTERPRISE_GIANT_FINAL_V1", JSON.stringify(d));
}

// =======================================================
// 📅 DATE FORMAT FOR INPUT
// =======================================================
function toInputDate(ts) {
  const d = new Date(ts);
  return d.toISOString().split("T")[0];
}

// =========================================================
// 🛰️ AMC ENTERPRISE DASHBOARD — FINAL (DATE EDIT FIXED)
// =========================================================

(function () {
  if (window.__AMC_FINAL__) return;
  window.__AMC_FINAL__ = true;

  const STORE = "AMC_ENTERPRISE_GIANT_FINAL_V1";

  // ================= STORAGE =================
  function load() {
    try { return JSON.parse(localStorage.getItem(STORE)) || []; }
    catch { return []; }
  }

  function save(d) {
    localStorage.setItem(STORE, JSON.stringify(d));
  }

  // ================= UTIL =================
  function fmt(ts) {
    return new Date(ts).toLocaleDateString("en-GB");
  }

  function toInputDate(ts) {
    const d = new Date(ts);
    return d.toISOString().split("T")[0];
  }

  function progress(f, t) {
    return Math.min(100, Math.max(0,
      Math.floor(((Date.now() - f) / (t - f)) * 100)));
  }

  function countdown(ms) {
    if (ms <= 0) return "EXPIRED";
    let d = Math.floor(ms / 86400000);
    return d + "D";
  }

  // =======================================================
  // ✏️ DATE EDIT (GLOBAL)
  // =======================================================
  window.AMC_EDIT_DATE = function (id) {
    const data = load();
    const amc = data.find(x => x.id === id);
    if (!amc) return;

    const box = document.createElement("div");
    box.className = "amc-date-popup";

    box.innerHTML = `
      <div class="amc-popup-card">
        <h3>Update AMC Dates</h3>

        <label>Start Date</label>
        <input type="date" id="editStart" value="${toInputDate(amc.from)}">

        <label>End Date</label>
        <input type="date" id="editEnd" value="${toInputDate(amc.to)}">

        <div style="margin-top:10px">
          <button onclick="AMC_SAVE_DATE(${id})">Save</button>
          <button onclick="this.closest('.amc-date-popup').remove()">Cancel</button>
        </div>
      </div>
    `;

    document.body.appendChild(box);
  };

  window.AMC_SAVE_DATE = function (id) {
    const data = load();
    const amc = data.find(x => x.id === id);
    if (!amc) return;

    const start = new Date(document.getElementById("editStart").value).getTime();
    const end = new Date(document.getElementById("editEnd").value).getTime();

    if (!start || !end) {
      alert("Invalid date");
      return;
    }

    amc.from = start;
    amc.to = end;

    save(data);

    document.querySelector(".amc-date-popup")?.remove();
    location.reload(); // SAFE REFRESH
  };

  // =======================================================
  // ADD AMC
  // =======================================================
  window.AMC_ADD = function () {
    const box = document.getElementById("amcContainer");

    const p = document.createElement("div");
    p.innerHTML = `
      <input id="amcN" placeholder="Name">
      <input id="amcV" placeholder="Vendor">
      <input id="amcS" type="date">
      <input id="amcE" type="date">
      <button onclick="AMC_ADD_SAVE()">Save</button>
    `;
    box.prepend(p);
  };

  window.AMC_ADD_SAVE = function () {
    const d = load();

    d.push({
      id: Date.now(),
      name: amcN.value,
      vendor: amcV.value,
      from: new Date(amcS.value).getTime(),
      to: new Date(amcE.value).getTime(),
      open: false
    });

    save(d);
    location.reload();
  };

  // =======================================================
  // TOGGLE
  // =======================================================
  window.AMC_TOGGLE = function (i) {
    const d = load();
    d[i].open = !d[i].open;
    save(d);
    render();
  };

  // =======================================================
  // RENDER
  // =======================================================
  function render() {
    const box = document.getElementById("amcContainer");
    if (!box) return;

    const list = load();

    box.innerHTML = list.map((a, i) => `
      <div class="amc-card">

        <div onclick="AMC_TOGGLE(${i})">
          <b>${a.name}</b><br>
          ${a.vendor}
        </div>

        <div class="amc-bar" style="width:${progress(a.from,a.to)}%"></div>

        ${a.open ? `
          <div onclick="event.stopPropagation()">

            <!-- ✅ FIXED DATE BLOCK -->
            <div class="amc-dates">
              📅 ${fmt(a.from)} → ${fmt(a.to)}

              <button
                onclick="event.stopPropagation(); AMC_EDIT_DATE(${a.id})">
                ✏️
              </button>
            </div>

          </div>

  <button class="amc-edit-btn"
    onclick="event.stopPropagation(); AMC_EDIT_DATE(${a.id})">
    ✏️
  </button>
</div>

            <div class="amc-meta">
              💰 Contract Cost
              <input class="dark-input"
                value="${formatINR(a.cost)}"
                oninput="AMC_SET_COST(${i},this.value)">
              ⚠️ SLA
              <b class="risk-${slaRisk(a).toLowerCase()}">${slaRisk(a)}</b>
            </div>

            <div class="amc-section">🏦 Bank Details</div>
            <input class="dark-input" placeholder="Account Name"
              value="${a.bank.accountName}"
              oninput="AMC_BANK(${i},'accountName',this.value)">
            <input class="dark-input" placeholder="Account Number"
              value="${a.bank.accountNumber}"
              oninput="AMC_BANK(${i},'accountNumber',this.value)">
            <input class="dark-input" placeholder="IFSC"
              value="${a.bank.ifsc}"
              oninput="AMC_BANK(${i},'ifsc',this.value)">
            <input class="dark-input" placeholder="Bank Name"
              value="${a.bank.bankName}"
              oninput="AMC_BANK(${i},'bankName',this.value)">

            <div class="amc-section">📦 Purchases</div>
          ${a.purchases.map((p,pi)=>`
  <div class="amc-row">
  <input class="dark-input"
    placeholder="Purchase Name"
    value="${p.name || ""}"
    oninput="AMC_PURCHASE_NAME(${i},${pi},this.value)">

  <input class="dark-input"
    value="${formatINR(p.amount)}"
    oninput="AMC_PURCHASE_SET(${i},${pi},this.value)">

  <span onclick="AMC_PURCHASE_STATUS(${i},${pi})">${p.status}</span>
  ${fmt(p.date)}

  <button onclick="AMC_PURCHASE_DEL(${i},${pi})">❌</button>
</div>

`).join("")}
            <button onclick="event.stopPropagation(); AMC_PURCHASE_ADD(${i})">
  ＋ Purchase
</button>
            <div class="amc-section">🧾 Requests / PO</div>
            ${a.po.map((p,pi)=>`
 <div class="amc-row">
  <input class="dark-input"
    placeholder="Request / PO Name"
    value="${p.name || ""}"
    oninput="AMC_PO_NAME(${i},${pi},this.value)">

  <input class="dark-input"
    value="${formatINR(p.amount)}"
    oninput="AMC_PO_SET(${i},${pi},this.value)">

  <span onclick="AMC_PO_STATUS(${i},${pi})">${p.status}</span>
  ${fmt(p.date)}

  <button onclick="AMC_PO_DEL(${i},${pi})">❌</button>
</div>

`).join("")}
         <button onclick="event.stopPropagation(); AMC_ADD_PO(${i})">
  ＋ Request / PO
</button>

            <div class="amc-actions">
              <button onclick="AMC_DEL(${i})">❌ DELETE AMC</button>
            </div>

          </div>
        </div>
      `).join("")}
      </div>
    `;
  }
/* ================= MUTATORS ================= */

// Toggle AMC open / close
window.AMC_TOGGLE = i => {
  const d = load();
  d[i].open = !d[i].open;
  save(d);
  render();
};

// Contract cost
window.AMC_SET_COST = (i,v) => {
  const d = load();
  d[i].cost = parseINR(v);
  save(d);
};

// Bank fields
window.AMC_BANK = (i,k,v) => {
  const d = load();
  d[i].bank[k] = v;
  save(d);
};

// ================= PURCHASES =================

// Add purchase
window.AMC_PURCHASE_ADD = i => {
  const d = load();
  d[i].purchases.push({
    name: "",
    amount: 0,
    status: "WAITING",
    date: Date.now()
  });
  save(d);
  render();
};

// Set purchase amount
window.AMC_PURCHASE_SET = (i,pi,v) => {
  const d = load();
  d[i].purchases[pi].amount = parseINR(v);
  save(d);
};

// Set purchase name
window.AMC_PURCHASE_NAME = (i,pi,v) => {
  const d = load();
  d[i].purchases[pi].name = v;
  save(d);
};

// Toggle purchase payment status
window.AMC_PURCHASE_STATUS = (i,pi) => {
  const d = load();
  d[i].purchases[pi].status =
    d[i].purchases[pi].status === "PAID" ? "WAITING" : "PAID";
  save(d);
  render();
};

// Delete purchase
window.AMC_PURCHASE_DEL = (i,pi) => {
  const d = load();
  d[i].purchases.splice(pi,1);
  save(d);
  render();
};

// ================= PO / REQUESTS =================

// Add PO / Request
window.AMC_ADD_PO = i => {
  const d = load();
  d[i].po.push({
    name: "",
    amount: 0,
    status: "WAITING",
    date: Date.now()
  });
  save(d);
  render();
};

// Set PO amount
window.AMC_PO_SET = (i,pi,v) => {
  const d = load();
  d[i].po[pi].amount = parseINR(v);
  save(d);
};

// Set PO name
window.AMC_PO_NAME = (i,pi,v) => {
  const d = load();
  d[i].po[pi].name = v;
  save(d);
};

// Toggle PO status
window.AMC_PO_STATUS = (i,pi) => {
  const s = ["WAITING","APPROVED","DELIVERED"];
  const d = load();
  const c = s.indexOf(d[i].po[pi].status);
  d[i].po[pi].status = s[(c + 1) % s.length];
  save(d);
  render();
};

// Delete PO
window.AMC_PO_DEL = (i,pi) => {
  const d = load();
  d[i].po.splice(pi,1);
  save(d);
  render();
};

// ================= DELETE AMC =================

window.AMC_DEL = i => {
  if (!confirm("Delete AMC?")) return;
  const d = load();
  d.splice(i,1);
  save(d);
  render();
};

  /* ================= EXPORT ================= */
  window.AMC_EXPORT_EXCEL = () => {
    const rows=[["Name","Vendor","Start","End","Cost","SLA","Bank","Account","IFSC"]];
    load().forEach(a=>{
      rows.push([
        a.name,a.vendor,fmt(a.from),fmt(a.to),
        a.cost,slaRisk(a),
        a.bank.bankName,a.bank.accountNumber,a.bank.ifsc
      ]);
    });
    const csv=rows.map(r=>r.join(",")).join("\n");
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
    a.download="AMC_Enterprise_Report.csv";
    a.click();
  };

  render();

})();
