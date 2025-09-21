import { Request, Response } from "express";
import RolePermissionService from "../../application/services/RolePermissionService";

export default class RolePermissionController {
  constructor(private service: RolePermissionService) {}

  assign = async (req: Request, res: Response) => {
    const { roleId, permissionId } = req.body || {};
    const result = await this.service.assign(Number(roleId), Number(permissionId));
    res.status(result.success ? 200 : 400).json(result);
  };

  unassign = async (req: Request, res: Response) => {
    const { roleId, permissionId } = req.body || {};
    const result = await this.service.unassign(Number(roleId), Number(permissionId));
    res.status(result.success ? 200 : 400).json(result);
  };

  listByRole = async (req: Request, res: Response) => {
    const roleId = Number(req.params.roleId);
    const result = await this.service.listByRole(roleId);
    res.status(result.success ? 200 : 400).json(result);
  };
}
