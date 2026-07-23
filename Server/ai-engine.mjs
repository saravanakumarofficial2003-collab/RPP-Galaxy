// =======================================================
// 🤖 RPP BEAST GALAXY – AI ROOT CAUSE & PREDICTION
// =======================================================

export function analyzeSystem(system) {
  const causes = [];
  let risk = 0;

  if (system.CPU > 85) {
    causes.push("CPU saturation likely due to heavy background processes.");
    risk += 30;
  }

  if (system.RAM > 85) {
    causes.push("Memory pressure detected. Possible application leak.");
    risk += 30;
  }

  if (system.Disk > 90) {
    causes.push("Disk almost full. IO throttling risk.");
    risk += 25;
  }

  if (system.Status === "OFFLINE") {
    causes.push("System not responding on network.");
    risk += 40;
  }

  return {
    risk: Math.min(risk, 100),
    explanation: causes.join(" ")
  };
}

export function predict48H(history = []) {
  if (history.length < 3) {
    return "Insufficient data for prediction.";
  }

  const avgCPU = history.reduce((a, b) => a + b.CPU, 0) / history.length;
  const avgRAM = history.reduce((a, b) => a + b.RAM, 0) / history.length;

  if (avgCPU > 75 || avgRAM > 75) {
    return "High probability of performance degradation within 24–48 hours.";
  }

  return "System expected to remain stable for next 48 hours.";
}
