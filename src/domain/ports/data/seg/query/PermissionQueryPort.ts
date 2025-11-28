import Result from "../../../../shared/Result";
import Permission from "../../../../models/seg/Permission";
import PermissionFilters from "../../../../valueObjects/PermissionFilters";

export default interface PermissionQueryPort {
  findById(id: number): Promise<Result<Permission | null>>;
  findByName(name: string): Promise<Result<Permission | null>>;
  findByFilters(filters: PermissionFilters): Promise<Result<Permission | null>>;
  list(): Promise<Result<Permission[]>>;
  existsById(id: number): Promise<Result<boolean>>;
  existsByName(name: string): Promise<Result<boolean>>;
}
