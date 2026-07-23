import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TICKET_FILE = path.join(__dirname, "tickets.json")

function readTickets() {
  return JSON.parse(fs.readFileSync(TICKET_FILE, "utf8"))
}

function saveTickets(data) {
  fs.writeFileSync(TICKET_FILE, JSON.stringify(data, null, 2))
}

export function registerTicketRoutes(app, broadcastLive) {

  // ============================
  // CREATE TICKET
  // ============================
  app.post("/tickets", (req, res) => {

    const tickets = readTickets()

   const ticket = {
  id: Date.now(),
  title: req.body.title,
  device: req.body.device,
  priority: req.body.priority || "Medium",
  status: "Open",
  assignedTo: null,
  notes: [],
  timeline: [
    {
      action: "Ticket Created",
      time: new Date().toISOString()
    }
  ],
  created: new Date().toISOString()
}
// =============================
// ADD NOTE / INVESTIGATION UPDATE
// =============================
app.post("/tickets/:id/note", (req, res) => {

  const tickets = readTickets()
  const ticket = tickets.find(t => t.id == req.params.id)

  if (!ticket) return res.sendStatus(404)

  ticket.notes.push({
    text: req.body.text,
    time: new Date().toISOString()
  })

  ticket.timeline.push({
    action: "Investigation update added",
    time: new Date().toISOString()
  })

  saveTickets(tickets)
  broadcastLive("tickets", tickets)

  res.json(ticket)
})
  // ============================
  // GET ALL TICKETS
  // ============================
  app.get("/tickets", (_, res) => {
    res.json(readTickets())
  })

  // ============================
  // UPDATE STATUS
  // ============================
  app.put("/tickets/:id", (req, res) => {

    const tickets = readTickets()

    const ticket = tickets.find(t => t.id == req.params.id)
    if (!ticket) return res.sendStatus(404)

    ticket.status = req.body.status

    saveTickets(tickets)
    broadcastLive("tickets", tickets)

    res.json(ticket)
  })

}