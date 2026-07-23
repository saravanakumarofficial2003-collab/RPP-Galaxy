import { mapMitreTechnique } from "./mitreMapper.js";
import { recordAttackEvent } from "./attackTimeline.js";
import { checkThreatIntel } from "./threatIntel.js";
import { detectHoneypotAccess } from "./honeypot.js";
import { predictNextAttack } from "./attackPredictor.js";

export function runCyberWarfareAnalysis(host, data, baseResult) {

    const mitre = mapMitreTechnique(baseResult.reasons);

    const intel = checkThreatIntel(data.AttackerIPs);

    const honeypot = detectHoneypotAccess(data);

    const prediction = predictNextAttack(
        baseResult.riskScore + intel.riskBoost + honeypot.score,
        baseResult.reasons
    );

    recordAttackEvent(host, {
        risk: baseResult.riskScore,
        mitre,
        prediction
    });

    return {
        mitre,
        knownAttackers: intel.knownAttackers,
        prediction
    };
}
