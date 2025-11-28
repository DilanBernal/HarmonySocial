import Result from "../../../../shared/Result";

export default interface UserRoleCommandPort {
  assignRoleToUser(userId: number, roleId: number): Promise<Result<void>>;
  removeRoleFromUser(userId: number, roleId: number): Promise<Result<void>>;
}
