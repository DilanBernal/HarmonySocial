import { Router } from "express";
import { InMemorySongRepository } from "../persistence/in-memory/InMemorySongRepository";
import { SongService } from "../../application/services/SongService";

const router = Router();
const service = new SongService(new InMemorySongRepository());


service.create({ title: "Midnight City", artist: "M83", genre: "Synthpop", durationSec: 284 }).catch(() => {});

router.get("/", async (req, res) => {
  const { query = "", page = "1", limit = "20" } = req.query as Record<string, string>;
  const result = await service.search(String(query), Number(page), Number(limit));
  res.json(result);
});

router.get("/:id", async (req, res) => {
  const song = await service.getById(req.params.id);
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
  const updated = await service.update(req.params.id, req.body ?? {});
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const ok = await service.delete(req.params.id);
  if (!ok) return res.status(404).json({ error: "Not found" });
  res.status(204).send();
});

export default router;
