import fs from "fs";
import path from "path";
import express from "express";

const router = express.Router();

const DATA_DIR = path.resolve("data");
const FILE = path.join(DATA_DIR, "lan-meta.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "{}");

// GET all metadata
router.get("/lan-meta", (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE, "utf8"));
  res.json(data);
});

// SAVE metadata for one IP
router.post("/lan-meta/:ip", express.json(), (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE, "utf8"));
  data[req.params.ip] = req.body;
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  res.json({ ok: true });
});

export default router;
