import { Router } from "express";
import SongAdapter from "../adapter/data/SongAdapter";
import SongService from "../../application/services/SongService";
import authenticateToken from "../middleware/authMiddleware";

const router = Router();
const service = new SongService(new SongAdapter());

router.get("/", async (req, res) => {
  try {
    const { query = "", page = "1", limit = "20" } = req.query as Record<string, string>;
    const result = await service.search(String(query), Number(page), Number(limit));
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e?.message ?? "Bad request" });
  }
});

router.get("/mine/list", authenticateToken, async (req: any, res) => {
  try {
    console.log("[songs] mine/list userId=", req.userId, "query=", req.query);
    const userId = Number(req.userId);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { page = "1", limit = "20" } = req.query as Record<string, string>;
    const data = await service.getMine(userId, Number(page), Number(limit));
    return res.json({ success: true, data });
  } catch (e: any) {
    console.error("[songs] mine/list error:", e);
    return res.status(400).json({ error: e?.message ?? "Bad request" });
  }
});

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

router.post("/", authenticateToken, async (req: any, res) => {
  try {
    const body = req.body ?? {};
    const created = await service.create({
      ...body,
      userId: body.userId ?? req.userId ?? null,
    });
    res.status(201).json(created);
  } catch (e: any) {
    res.status(400).json({ error: e?.message ?? "Bad request" });
  }
});

router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updated = await service.update(id, req.body ?? {});
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (e: any) {
    res.status(400).json({ error: e?.message ?? "Bad request" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
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
