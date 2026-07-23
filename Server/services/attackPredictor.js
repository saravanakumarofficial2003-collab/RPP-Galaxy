// ==============================================================
// AI ATTACK PREDICTION ENGINE
// Predict next attacker move based on behaviour
// ==============================================================

export function predictNextAttack(riskScore, reasons = []) {

    if (riskScore >= 90)
        return "Full system takeover attempt imminent";

    if (reasons.includes("Internal scanning behavior"))
        return "Likely lateral movement across LAN";

    if (reasons.includes("Mass file renaming"))
        return "Ransomware encryption phase starting";

    if (reasons.includes("Credential dumping"))
        return "Privilege escalation attempt";

    if (reasons.includes("Command & control beacon"))
        return "Remote attacker active session";

    return "Monitoring attacker behaviour";
}
