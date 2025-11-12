import { Router } from "express";
import UserRoleAdapter from "../adapter/data/seg/UserRoleAdapter";
import RoleAdapter from "../adapter/data/seg/RoleAdapter";
import LoggerAdapter from "../adapter/utils/LoggerAdapter";
import UserRoleController from "../controller/UserRoleController";
import { validateRequest } from "../middleware/validateRequest";
import userRoleAssignSchema from "../validator/seg/userRole/UserRoleAssignValidator";
import authenticateToken from "../middleware/authMiddleware";
import RoleService from "../../application/services/seg/role/RoleService";
import UserRoleService from "../../application/services/seg/userRole/UserRoleService";

const router = Router();
const logger = new LoggerAdapter();
const roleAdapter = new RoleAdapter();
const userRoleAdapter = new UserRoleAdapter();
const roleService = new RoleService(roleAdapter, userRoleAdapter, logger);
const userRoleService = new UserRoleService(userRoleAdapter, roleAdapter, logger as any);
const controller = new UserRoleController(userRoleService, logger);

router.post("/", authenticateToken, validateRequest(userRoleAssignSchema), (req, res) =>
  controller.assign(req, res),
);
router.delete("/:userId/:roleId", authenticateToken, (req, res) => controller.remove(req, res));
router.get("/roles/:userId", authenticateToken, (req, res) => controller.listRoles(req, res));
router.get("/users/:roleName", authenticateToken, (req, res) => controller.listUsers(req, res));

export default router;
