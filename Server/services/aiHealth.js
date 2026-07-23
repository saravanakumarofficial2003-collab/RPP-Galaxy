export function analyzeSystem(systems) {

  const total = Object.keys(systems).length;
  const online = Object.values(systems).filter(s => s.Status === "ONLINE").length;

  const load = (online / total) * 100;

  if (load > 80) {
    return {
      root: "System under heavy load",
      prediction: "Service slowdown possible",
      action: ["Reduce CPU load", "Restart heavy apps"]
    };
  }

  return {
    root: "System stable",
    prediction: "No risk detected",
    action: ["Monitoring normal"]
  };
}
