import { detectAnomaly } from "./aiAnomalyDetector.js";
import { detectRansomware } from "./ransomwareDetector.js";
import { detectLateralMovement } from "./lateralMovementDetector.js";
import { detectMemoryInjection } from "./memoryInjectionDetector.js";

export function analyzeCyberThreat(host, data) {

    const engines = [
        detectAnomaly(host, data),
        detectRansomware(data),
        detectLateralMovement(data),
        detectMemoryInjection(data)
    ];

    let totalRisk = 0;
    const reasons = [];

    engines.forEach(e => {
        totalRisk += e.score;
        reasons.push(...e.reasons);
    });

    return {
        riskScore: Math.min(totalRisk, 100),
        reasons
    };
}
