export function detectMemoryInjection(data) {

    let score = 0;
    const reasons = [];

    if (data.UnsignedDLLLoaded) {
        score += 40;
        reasons.push("Unsigned DLL injection");
    }

    if (data.CodeInjectionDetected) {
        score += 60;
        reasons.push("Process memory injection");
    }

    return { score, reasons };
}
