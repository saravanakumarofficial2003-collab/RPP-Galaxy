export function detectHoneypotAccess(data) {

    if (data.AccessedFakeAdminShare)
        return { triggered: true, score: 80 };

    return { triggered: false, score: 0 };
}
