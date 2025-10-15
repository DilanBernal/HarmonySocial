import { Router } from "express";
import authenticateToken from "../middleware/authMiddleware";
import LoggerAdapter from "../adapter/utils/LoggerAdapter";
import UserRoleAdapter from "../adapter/data/seg/UserRoleAdapter";
import UserAdapter from "../adapter/data/seg/UserAdapter";
import ArtistUserService from "../../application/services/ArtistUserService";
import ArtistUserController from "../controller/ArtistUserController";

const router = Router();
const logger = new LoggerAdapter();
const userRoleAdapter = new UserRoleAdapter();
const userAdapter = new UserAdapter();
const service = new ArtistUserService(userRoleAdapter, userAdapter, logger);
const controller = new ArtistUserController(service, logger);

router.get("/", authenticateToken, (req, res) => controller.list(req, res));

export default router;
