import Result from "../../../../shared/Result";
import Permission from "../../../../models/seg/Permission";

export default interface PermissionCommandPort {
  create(permission: Partial<Permission>): Promise<Result<number>>;
  update(id: number, permission: Partial<Permission>): Promise<Result<void>>;
  delete(id: number): Promise<Result<void>>;
}
