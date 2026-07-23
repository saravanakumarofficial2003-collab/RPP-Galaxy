/* =========================================
   🚀 GLOBAL LIVE AMC TIMER ENGINE
   ========================================= */

function formatCountdown(ms){

  if(!ms || isNaN(ms)) return "—";
  if(ms <= 0) return "EXPIRED";

  const total = Math.floor(ms / 1000);

  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  return `${d}D ${h}H ${m}M ${s}S`;
}


function updateAmcTimers(){

  const now = Date.now();

  document.querySelectorAll(".amc-countdown").forEach(el => {

    const expiry = Number(el.dataset.expiry);

    if(!expiry){
      el.innerText = "—";
      return;
    }

    const diff = expiry - now;
    el.innerText = formatCountdown(diff);

  });

}


/* ---------- RUN FOREVER ---------- */
setInterval(updateAmcTimers, 1000);
updateAmcTimers();


/* ---------- RESTART AFTER AMC RENDER ---------- */
document.addEventListener("click", ()=>{
  setTimeout(updateAmcTimers, 50);
});