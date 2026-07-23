// ======================================================
// 🚀 GALAXY REAL-TIME SPEEDOMETER (PURE LIVE)
// ======================================================

console.log("📡 Connecting to Galaxy NOC server...");

const ws = new WebSocket(`ws://${location.host}`);

ws.onopen = () => console.log("🟢 Connected");
ws.onclose = () => console.log("🔴 Disconnected");
ws.onerror = e => console.error("WS error", e);


// ======================================================
// CANVAS SETUP
// ======================================================

const canvas = document.getElementById("speedGauge");
const ctx = canvas.getContext("2d");

const centerX = canvas.width / 2;
const centerY = canvas.height - 10;
const radius = 90;

let currentSpeed = 0;
let liveSpeed = 0;


// ======================================================
// DRAW GAUGE
// ======================================================

function drawGauge(speed){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  // background arc
  ctx.lineWidth = 14;
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.arc(centerX,centerY,radius,Math.PI,0);
  ctx.stroke();

  // speed arc
  const maxSpeed = 500;
  const percent = Math.min(speed/maxSpeed,1);
  const angle = Math.PI * percent;

  const g = ctx.createLinearGradient(0,0,260,0);
  g.addColorStop(0,"#22c55e");
  g.addColorStop(.5,"#38bdf8");
  g.addColorStop(1,"#ef4444");

  ctx.strokeStyle = g;
  ctx.beginPath();
  ctx.arc(centerX,centerY,radius,Math.PI,Math.PI+angle);
  ctx.stroke();
}


// ======================================================
// ULTRA SMOOTH LIVE NEEDLE
// ======================================================

function animate(){

  // FAST response tracking
  currentSpeed += (liveSpeed - currentSpeed) * 0.25;

  drawGauge(currentSpeed);

  document.getElementById("downloadSpeed").innerText =
    currentSpeed.toFixed(2);

  requestAnimationFrame(animate);
}

animate();


// ======================================================
// RECEIVE LIVE DATA FROM SERVER
// ======================================================

ws.onmessage = e => {

  const msg = JSON.parse(e.data);

  if(msg.type === "network-speed"){

    const d = msg.payload;

    // TRUE LIVE SPEED
    liveSpeed = d.download || 0;

    // LIVE TEXT VALUES
    document.getElementById("dlText").innerText =
      d.download.toFixed(2) + " Mbps";

    document.getElementById("ulText").innerText =
      d.upload.toFixed(2) + " Mbps";

    document.getElementById("pingText").innerText =
      d.ping.toFixed(0) + " ms";
  }
};
