const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
app.use(express.json());

const AGENT_DIR = "C:/RPP_GALAXY/Agent";

app.get("/remote/:ip", (req, res) => {
  const ip = req.params.ip;
  const file = `${AGENT_DIR}/ultraviewer.json`;

  if (!fs.existsSync(file)) {
    return res.status(404).send("UltraViewer data not found");
  }

  const data = JSON.parse(fs.readFileSync(file));

  if (data.IP !== ip) {
    return res.status(404).send("IP mismatch");
  }

  // 🔥 OPEN ULTRAVIEWER ON YOUR PC
  exec(`"C:\\Program Files\\UltraViewer\\UltraViewer.exe"`);

  res.json(data);
});

app.listen(9095, () =>
  console.log("🟢 Galaxy Remote Controller running on 9095...")
);
