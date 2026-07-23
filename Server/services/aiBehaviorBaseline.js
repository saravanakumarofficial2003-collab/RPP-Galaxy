const BASELINES = {};

export function learnBaseline(host, metrics) {

    if (!BASELINES[host]) {
        BASELINES[host] = {
            cpuAvg: metrics.CPU,
            processCount: metrics.ProcessCount,
            networkRate: metrics.NetworkRate
        };
        return;
    }

    const b = BASELINES[host];

    // rolling average learning
    b.cpuAvg = (b.cpuAvg * 0.9) + (metrics.CPU * 0.1);
    b.processCount = (b.processCount * 0.9) + (metrics.ProcessCount * 0.1);
    b.networkRate = (b.networkRate * 0.9) + (metrics.NetworkRate * 0.1);
}

export function getBaseline(host) {
    return BASELINES[host];
}
