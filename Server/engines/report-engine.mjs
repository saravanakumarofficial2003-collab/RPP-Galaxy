/******************************************************************
 * RPP BEAST GALAXY – EXECUTIVE REPORT ENGINE (ULTIMATE)
 * Purpose: CEO / MD / Board-level intelligence summaries
 ******************************************************************/

import fs from "fs";

const ROOT = "C:/RPP_GALAXY";
const DATA = `${ROOT}/ServerData/state.json`;
const AI_REPORT = `${ROOT}/Reports/AI_Explanation.json`;
const OUTPUT = `${ROOT}/Reports/ExecutiveReport.json`;

function load(path) {
    if (!fs.existsSync(path)) return null;
    return JSON.parse(fs.readFileSync(path, "utf-8"));
}

export function generateExecutiveReport() {
    const systems = load(DATA) || {};
    const ai = load(AI_REPORT) || {};

    const total = Object.keys(systems).length;
    const online = Object.values(systems).filter(s => s.status === "ONLINE").length;
    const offline = total - online;

    const report = {
        date: new Date().toDateString(),
        overview: {
            totalSystems: total,
            online,
            offline,
            healthScore: ai.Severity || "NORMAL"
        },
        aiSummary: ai.HumanExplanation || "System learning phase",
        businessAdvice: ai.RecommendedActions || [],
        generatedBy: "BEAST GALAXY AI"
    };

    fs.writeFileSync(OUTPUT, JSON.stringify(report, null, 2));
}
