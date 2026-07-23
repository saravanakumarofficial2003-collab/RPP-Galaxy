export function detectLateralMovement(data) {

    let score = 0;
    const reasons = [];

    if (data.InternalConnections > 50) {
        score += 40;
        reasons.push("Internal scanning behavior");
    }

    if (data.FailedLogins > 10) {
        score += 30;
        reasons.push("Credential brute force");
    }

    return { score, reasons };
}
