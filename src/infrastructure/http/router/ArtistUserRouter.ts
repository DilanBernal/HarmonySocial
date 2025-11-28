import { Router } from "express";
import authenticateToken from "../middleware/authMiddleware";
import ArtistUserService from "../../../application/services/ArtistUserService";
import UserQueryAdapter from "../../adapter/data/seg/queries/UserQueryAdapter";
import UserRoleAdapter from "../../adapter/data/seg/UserRoleAdapter";
import LoggerAdapter from "../../adapter/utils/LoggerAdapter";
import ArtistUserController from "../../controller/ArtistUserController";

const router = Router();
const logger = new LoggerAdapter();
const userRoleAdapter = new UserRoleAdapter();
const userAdapter = new UserQueryAdapter();
const service = new ArtistUserService(userRoleAdapter, userAdapter, logger);
const controller = new ArtistUserController(service, logger);

router.get("/", authenticateToken, (req, res) => controller.list(req, res));

export default router;
