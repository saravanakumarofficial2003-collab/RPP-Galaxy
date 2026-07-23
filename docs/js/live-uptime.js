// =======================================
// 🚀 LIVE MULTI AMC COUNTDOWN ENGINE
// =======================================

function formatCountdown(ms){

  if(ms <= 0) return "EXPIRED";

  const totalSeconds = Math.floor(ms / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days}D ${hours}H ${minutes}M ${seconds}S`;
}


function updateAllCountdowns(){

  const now = Date.now();

  document.querySelectorAll(".amc-countdown").forEach(el => {

    const expiry = new Date(el.dataset.expiry).getTime();
    const diff = expiry - now;

    el.innerText = formatCountdown(diff);

  });

}

updateAllCountdowns();
setInterval(updateAllCountdowns, 1000);