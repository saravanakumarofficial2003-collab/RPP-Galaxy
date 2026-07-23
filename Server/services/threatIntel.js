const KNOWN_BAD_IPS = [
    "185.220.101.1",
    "45.95.147.12"
];

export function checkThreatIntel(ipList = []) {

    const matches = ipList.filter(ip => KNOWN_BAD_IPS.includes(ip));

    return {
        knownAttackers: matches,
        riskBoost: matches.length * 20
    };
}
