import { getBaseline } from "./aiBehaviorBaseline.js";

export function detectAnomaly(host, metrics) {

    const base = getBaseline(host);
    if (!base) return { score: 0, reasons: [] };

    let score = 0;
    const reasons = [];

    if (metrics.CPU > base.cpuAvg * 2) {
        score += 30;
        reasons.push("CPU spike anomaly");
    }

    if (metrics.ProcessCount > base.processCount * 2) {
        score += 25;
        reasons.push("Process explosion");
    }

    if (metrics.NetworkRate > base.networkRate * 3) {
        score += 35;
        reasons.push("Abnormal network traffic");
    }

    return { score, reasons };
}
