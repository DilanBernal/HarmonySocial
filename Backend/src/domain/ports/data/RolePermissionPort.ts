import { ApplicationResponse } from "../../../application/shared/ApplicationReponse";
import Permission from "../../models/Permission";

export default interface RolePermissionPort {
  assign(roleId: number, permissionId: number): Promise<ApplicationResponse<void>>;
  unassign(roleId: number, permissionId: number): Promise<ApplicationResponse<void>>;
  getPermissionsByRole(roleId: number): Promise<ApplicationResponse<Permission[]>>;
  getPermissionsByRoleNames(roleNames: string[]): Promise<ApplicationResponse<Permission[]>>;
}
