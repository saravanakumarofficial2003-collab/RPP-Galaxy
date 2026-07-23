console.log("📡 Connecting to NOC server...");

const socket = io();

socket.on("connect", () => {
  console.log("🟢 Connected:", socket.id);
});

socket.on("noc-live", data => {
  console.log("📡 NOC DATA:", data);

  const speed = data.server?.download || 0;

  document.getElementById("downloadSpeed").innerText = speed.toFixed(2);
  document.getElementById("dlText").innerText = speed + " Mbps";
  document.getElementById("ulText").innerText = data.server?.upload + " Mbps";
  document.getElementById("pingText").innerText = data.server?.ping + " ms";

  drawSpeedGauge(speed);
});
