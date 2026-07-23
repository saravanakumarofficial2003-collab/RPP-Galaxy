window.LAN_META = {};

async function loadLanMeta() {
  const res = await fetch("/api/lan-meta");
  LAN_META = await res.json();
}

function saveLanMeta(ip, meta) {
  LAN_META[ip] = meta;
  return fetch(`/api/lan-meta/${ip}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(meta)
  });
}
