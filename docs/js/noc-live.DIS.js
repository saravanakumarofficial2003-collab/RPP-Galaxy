const socket = io();

socket.on("noc-live", data => {

  console.log("NOC DATA", data);

  document.getElementById("downloadSpeed").innerText =
    data.server.rx_mbps;

  document.getElementById("ulText").innerText =
    data.server.tx_mbps + " Mbps";

  document.getElementById("pingText").innerText =
    data.isp.latency + " ms";

  drawSpeedGauge(data.server.rx_mbps);
});
