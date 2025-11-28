import Result from "../../../../shared/Result";
import Role from "../../../../models/seg/Role";

export default interface UserRoleQueryPort {
  listRolesForUser(userId: number): Promise<Result<Role[]>>;
  listUsersForRole(roleName: string): Promise<Result<number[]>>;
  userHasRole(userId: number, roleName: string): Promise<Result<boolean>>;
}
