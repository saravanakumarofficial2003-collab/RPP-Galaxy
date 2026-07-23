export function getLanStatus(ip, pingResult) {
  return pingResult.alive ? "ONLINE" : "OFFLINE";
}
