import Result from "../../../../shared/Result";
import Role from "../../../../models/seg/Role";
import RoleFilters from "../../../../valueObjects/RoleFilters";

export default interface RoleQueryPort {
  findById(id: number): Promise<Result<Role | null>>;
  findByName(name: string): Promise<Result<Role | null>>;
  findByFilters(filters: RoleFilters): Promise<Result<Role | null>>;
  list(): Promise<Result<Role[]>>;
  existsById(id: number): Promise<Result<boolean>>;
  existsByName(name: string): Promise<Result<boolean>>;
}
