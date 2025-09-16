import { Router } from "express";
import ArtistAdapter from "../adapter/data/ArtistAdapter";
import ArtistService from "../../application/services/ArtistService";
import LoggerAdapter from "../adapter/utils/LoggerAdapter";
import ArtistController from "../controller/ArtistController";
import { validateRequest } from "../middleware/validateRequest";
import artistCreateSchema from "../validator/ArtistCreateValidator";
import artistUpdateSchema from "../validator/ArtistUpdateValidator";

const router = Router();

const adapter = new ArtistAdapter();
const logger = new LoggerAdapter();
const service = new ArtistService(adapter, logger);
const controller = new ArtistController(service, logger);

router.post("/", validateRequest(artistCreateSchema), (req, res) => controller.create(req, res));
router.get("/", (req, res) => controller.search(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
router.put("/:id", validateRequest(artistUpdateSchema), (req, res) => controller.update(req, res));
router.delete("/:id", (req, res) => controller.logicalDelete(req, res));
router.put("/:id/accept", (req, res) => controller.accept(req, res));
router.put("/:id/reject", (req, res) => controller.reject(req, res));

export default router;
