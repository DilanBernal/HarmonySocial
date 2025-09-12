import { Router } from "express";
import SongAdapter from "../adapter/data/SongAdapter";
import { SongService } from "../../application/services/SongService"; // o default según tu export

const router = Router();
const service = new SongService(new SongAdapter());

// ❌ elimina el seed viejo (usaba artist/durationSec)
// service.create({ title: "Midnight City", audioUrl: "https://example.com/midnight.mp3", genre: "Synthpop", duration: 284 }).catch(() => {});

router.get("/", async (req, res) => {
  const { query = "", page = "1", limit = "20" } = req.query as Record<string, string>;
  const result = await service.search(String(query), Number(page), Number(limit));
  res.json(result);
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const song = await service.getById(id);
  if (!song) return res.status(404).json({ error: "Not found" });
  res.json(song);
});

router.post("/", async (req, res) => {
  try {
    const created = await service.create(req.body ?? {});
    res.status(201).json(created);
  } catch (e: any) {
    res.status(400).json({ error: e.message || "Bad request" });
  }
});

router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const updated = await service.update(id, req.body ?? {});
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const ok = await service.delete(id);
  if (!ok) return res.status(404).json({ error: "Not found" });
  res.status(204).send();
});

export default router;
