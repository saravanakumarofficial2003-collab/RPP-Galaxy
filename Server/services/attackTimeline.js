const TIMELINES = {};

export function recordAttackEvent(host, event) {

    if (!TIMELINES[host])
        TIMELINES[host] = [];

    TIMELINES[host].push({
        time: new Date(),
        ...event
    });
}

export function getTimeline(host) {
    return TIMELINES[host] || [];
}
