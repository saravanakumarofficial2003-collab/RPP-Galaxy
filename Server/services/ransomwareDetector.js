export function detectRansomware(data) {

    let score = 0;
    const reasons = [];

    if (data.FileRenameRate > 100) {
        score += 50;
        reasons.push("Mass file renaming");
    }

    if (data.FileWriteRate > 200) {
        score += 40;
        reasons.push("High disk write burst");
    }

    if (data.EntropyIncrease === true) {
        score += 60;
        reasons.push("Encryption entropy detected");
    }

    return { score, reasons };
}
