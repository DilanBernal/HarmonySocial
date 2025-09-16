import { Router } from "express";
import ArtistAdapter from "../adapter/data/ArtistAdapter";
import ArtistService from "../../application/services/ArtistService";
import LoggerAdapter from "../adapter/utils/LoggerAdapter";
import ArtistController from "../controller/ArtistController";
import { validateRequest } from "../middleware/validateRequest";
import { ArtistCreateRequestSchema } from "../../application/dto/requests/ArtistCreateRequest";
import { ArtistUpdateRequestSchema } from "../../application/dto/requests/ArtistUpdateRequest";
import { AppDataSource } from "../config/con_database";
import authenticateToken from "../middleware/authMiddleware";

const router = Router();
const artistAdapter = new ArtistAdapter();
const loggerAdapter = new LoggerAdapter();
const artistService = new ArtistService(artistAdapter, loggerAdapter);
const artistController = new ArtistController(artistService, loggerAdapter);

router.post("/", authenticateToken, validateRequest(ArtistCreateRequestSchema), (req, res) =>
  artistController.createArtist(req, res),
);

router.put("/:id", validateRequest(ArtistUpdateRequestSchema), (req, res) =>
  artistController.updateArtist(req, res),
);

router.delete("/:id", (req, res) => artistController.deleteArtist(req, res));

router.get("/", (req, res) => artistController.searchArtists(req, res));
router.get("/:id", (req, res) => artistController.getArtistById(req, res));

export default router;
