import { Router } from "express";
import RolePermissionAdapter from "../adapter/data/RolePermissionAdapter";
import RolePermissionService from "../../application/services/RolePermissionService";
import RolePermissionController from "../controller/RolePermissionController";

const adapter = new RolePermissionAdapter();
const service = new RolePermissionService(adapter);
const controller = new RolePermissionController(service);

const router = Router();
router.post("/role-permissions/assign", controller.assign);
router.post("/role-permissions/unassign", controller.unassign);
router.get("/role-permissions/:roleId", controller.listByRole);

export default router;
