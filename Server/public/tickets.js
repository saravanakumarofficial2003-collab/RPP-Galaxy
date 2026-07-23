async function raiseTicket() {

  const title = document.getElementById("ticketTitle").value
  const device = document.getElementById("ticketDevice").value
  const priority = document.getElementById("ticketPriority").value

  await fetch("/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, device, priority })
  })
}

function renderTickets(tickets) {

  const el = document.getElementById("ticketList")
  el.innerHTML = ""

  tickets.forEach(t => {

    el.innerHTML += `
      <div class="ticket">
        <b>${t.title}</b>
        <br>Device: ${t.device}
        <br>Priority: ${t.priority}
        <br>Status: ${t.status}
        <br>
        <button onclick="updateTicket(${t.id},'In-Progress')">Start</button>
        <button onclick="updateTicket(${t.id},'Resolved')">Resolve</button>
      </div>
      <hr>
    `
  })
}

async function updateTicket(id, status) {
  await fetch("/tickets/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  })
}

// LIVE UPDATE
socket.onmessage = event => {
  const data = JSON.parse(event.data)
  if (data.type === "tickets") renderTickets(data.payload)
}

// LOAD EXISTING
fetch("/tickets")
  .then(r => r.json())
  .then(renderTickets)