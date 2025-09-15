import { Router } from "express";
import SongAdapter from "../adapter/data/SongAdapter";
import SongService from "../../application/services/SongService";

const router = Router();
const service = new SongService(new SongAdapter());

/** GET /api/songs?query=rock&page=1&limit=20 */
router.get("/", async (req, res) => {
  try {
    const { query = "", page = "1", limit = "20" } = req.query as Record<string, string>;
    const result = await service.search(String(query), Number(page), Number(limit));
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e?.message ?? "Bad request" });
  }
});

/** GET /api/songs/:id */
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const song = await service.getById(id);
    if (!song) return res.status(404).json({ error: "Not found" });
    res.json(song);
  } catch (e: any) {
    res.status(400).json({ error: e?.message ?? "Bad request" });
  }
});

/** POST /api/songs  (JSON)
 *  { title, audioUrl, description?, genre?, userId?, ... }
 */
router.post("/", async (req, res) => {
  try {
    const created = await service.create(req.body ?? {});
    res.status(201).json(created);
  } catch (e: any) {
    res.status(400).json({ error: e?.message ?? "Bad request" });
  }
});

/** PATCH /api/songs/:id  (JSON parcial) */
router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updated = await service.update(id, req.body ?? {});
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (e: any) {
    res.status(400).json({ error: e?.message ?? "Bad request" });
  }
});

/** DELETE /api/songs/:id */
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const ok = await service.delete(id);
    if (!ok) return res.status(404).json({ error: "Not found" });
    res.status(204).send();
  } catch (e: any) {
    res.status(400).json({ error: e?.message ?? "Bad request" });
  }
});

export default router;
