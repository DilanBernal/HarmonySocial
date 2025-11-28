import Result from "../../../../shared/Result";
import Permission from "../../../../models/seg/Permission";

export default interface RolePermissionQueryPort {
  getPermissionsByRole(roleId: number): Promise<Result<Permission[]>>;
  getPermissionsByRoleNames(roleNames: string[]): Promise<Result<Permission[]>>;
}
