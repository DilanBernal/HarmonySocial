import { Router } from "express";
import RoleAdapter from "../adapter/data/RoleAdapter";
import UserRoleAdapter from "../adapter/data/UserRoleAdapter";
import RoleService from "../../application/services/RoleService";
import UserRoleService from "../../application/services/UserRoleService";
import LoggerAdapter from "../adapter/utils/LoggerAdapter";
import RoleController from "../controller/RoleController";
import { validateRequest } from "../middleware/validateRequest";
import roleCreateSchema from "../validator/RoleCreateValidator";
import roleUpdateSchema from "../validator/RoleUpdateValidator";
import authenticateToken from "../middleware/authMiddleware";

const router = Router();
const roleAdapter = new RoleAdapter();
const userRoleAdapter = new UserRoleAdapter();
const logger = new LoggerAdapter();
const service = new RoleService(roleAdapter, userRoleAdapter, logger);
const controller = new RoleController(service, logger);

router.post("/", authenticateToken, validateRequest(roleCreateSchema), (req, res) =>
  controller.create(req, res),
);
router.get("/", authenticateToken, (req, res) => controller.list(req, res));
router.get("/:id", authenticateToken, (req, res) => controller.getById(req, res));
router.put("/:id", authenticateToken, validateRequest(roleUpdateSchema), (req, res) =>
  controller.update(req, res),
);
router.delete("/:id", authenticateToken, (req, res) => controller.delete(req, res));

export default router;
