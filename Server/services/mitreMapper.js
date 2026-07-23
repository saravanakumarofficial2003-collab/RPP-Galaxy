export function mapMitreTechnique(reasons) {

    const map = [];

    if (reasons.includes("Mass file renaming"))
        map.push("T1486 — Data Encrypted for Impact");

    if (reasons.includes("Process memory injection"))
        map.push("T1055 — Process Injection");

    if (reasons.includes("Internal scanning behavior"))
        map.push("T1046 — Network Service Discovery");

    if (reasons.includes("CPU spike anomaly"))
        map.push("T1496 — Resource Hijacking");

    return map;
}
