// =============================================================
// BEAST GALAXY – AUTO FIX COMMAND ENGINE (STEP 12)
// =============================================================

export function registerAutoFixAPI(app, broadcast) {

  // ===========================================================
  // TRIGGER AUTO FIX ON CLIENT
  // ===========================================================
  app.post("/autofix/run", (req, res) => {
    const { ip, action } = req.body;

    if (!ip || !action) {
      return res.status(400).json({ error: "Missing ip or action" });
    }

    // Broadcast command to Agents via WebSocket
    broadcast({
      type: "autofix",
      ip,
      action,
      time: Date.now()
    });

    res.json({
      status: "SENT",
      ip,
      action
    });
  });
}
