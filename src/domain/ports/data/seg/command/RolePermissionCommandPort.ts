import Result from "../../../../shared/Result";

export default interface RolePermissionCommandPort {
  assign(roleId: number, permissionId: number): Promise<Result<void>>;
  unassign(roleId: number, permissionId: number): Promise<Result<void>>;
}
