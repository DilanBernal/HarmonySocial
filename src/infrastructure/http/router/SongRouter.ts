import { Router } from "express";
import SongService from "../../../application/services/SongService";
import SongQueryAdapter from "../../adapter/data/music/SongQueryAdapter";
import SongCommandAdapter from "../../adapter/data/music/SongCommandAdapter";
import SongController from "../../controller/SongController";
import authenticateToken from "../middleware/authMiddleware";

const router = Router();
const songQueryAdapter = new SongQueryAdapter();
const songCommandAdapter = new SongCommandAdapter();
const service = new SongService(songQueryAdapter, songCommandAdapter);
const controller = new SongController(service);

router.get("/", async (req, res) => {
  try {
    await controller.getPagedSongs(req, res);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Bad request" });
  }
});

router.get("/mine/list", authenticateToken, async (req: any, res) => {
  try {
    await controller.getUserSongList(req, res);
  } catch (error: any) {
    res.status(500).json({ error: error?.message ?? "Bad request" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    await controller.getSongById(req, res);
  } catch (error: any) {
    res.status(500).json({ error: error?.message ?? "Bad request" });
  }
});

router.post("/", authenticateToken, async (req: any, res) => {
  await controller.createNewSong(req, res);
});

router.patch("/:id", authenticateToken, async (req, res) => {
  await controller.updateSong(req, res);
});

router.delete("/:id", authenticateToken, async (req, res) => {
  await controller.deleteSong(req, res);
});

export default router;
