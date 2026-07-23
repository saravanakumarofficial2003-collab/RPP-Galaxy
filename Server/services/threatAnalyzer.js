export function analyzeThreat(data) {

    let risk = 0;
    const reasons = [];

    // suspicious process
    if (data.SuspiciousProcesses?.length > 0) {
        risk += 40;
        reasons.push("Malicious process detected");
    }

    // unknown external connection
    if (data.ExternalConnections?.length > 5) {
        risk += 30;
        reasons.push("Multiple external connections");
    }

    // high CPU abnormal
    if (data.CPU > 90) {
        risk += 20;
        reasons.push("CPU anomaly");
    }

    return {
        riskScore: risk,
        reasons
    };
}
