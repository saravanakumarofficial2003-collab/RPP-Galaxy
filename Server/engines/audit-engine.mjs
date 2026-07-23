// =============================================================
// BEAST GALAXY – AUDIT & REPORT ENGINE (STEP 11)
// =============================================================

import fs from "fs";
import path from "path";
import XLSX from "xlsx";

const REPORT_DIR = "C:/RPP_GALAXY/Reports";

if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

// =============================================================
// GENERATE AUDIT DATA
// =============================================================
export function generateAuditData(systems) {
  const list = Object.values(systems);

  const summary = {
    total: list.length,
    online: list.filter(s => s.status === "ONLINE").length,
    offline: list.filter(s => s.status === "OFFLINE").length,
    critical: list.filter(
      s => (s.metrics?.CPU || 0) > 85 || (s.metrics?.RAM || 0) > 85
    ).length,
    generatedAt: new Date().toISOString()
  };

  const rows = list.map(s => ({
    IP: s.ip,
    Hostname: s.hostname || "",
    Status: s.status,
    CPU: s.metrics?.CPU || 0,
    RAM: s.metrics?.RAM || 0,
    Disk: s.metrics?.Disk || 0,
    LastSeen: new Date(s.lastSeen || 0).toLocaleString(),
    Source: s.source || "UNKNOWN"
  }));

  return { summary, rows };
}

// =============================================================
// SAVE EXCEL REPORT
// =============================================================
export function saveExcelReport(data) {
  const wb = XLSX.utils.book_new();

  const summarySheet = XLSX.utils.json_to_sheet([data.summary]);
  const detailSheet = XLSX.utils.json_to_sheet(data.rows);

  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");
  XLSX.utils.book_append_sheet(wb, detailSheet, "Systems");

  const file = path.join(
    REPORT_DIR,
    `BEAST_GALAXY_AUDIT_${Date.now()}.xlsx`
  );

  XLSX.writeFile(wb, file);
  return file;
}

// =============================================================
// SAVE JSON REPORT
// =============================================================
export function saveJsonReport(data) {
  const file = path.join(
    REPORT_DIR,
    `BEAST_GALAXY_AUDIT_${Date.now()}.json`
  );

  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return file;
}
