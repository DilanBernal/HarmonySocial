import Role from "../../../models/seg/Role";

export default interface UserRolePort {
  assignRoleToUser(userId: number, roleId: number): Promise<boolean>;
  removeRoleFromUser(userId: number, roleId: number): Promise<boolean>;
  listRolesForUser(userId: number): Promise<Role[]>;
  listUsersForRole(roleName: string): Promise<number[]>;
  userHasRole(userId: number, roleName: string): Promise<boolean>;
}
