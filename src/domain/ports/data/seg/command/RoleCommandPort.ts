import Result from "../../../../shared/Result";
import RoleCreateData from "./RoleCreateData";
import RoleUpdateData from "./RoleUpdateData";

export default interface RoleCommandPort {
  create(data: RoleCreateData): Promise<Result<number>>;
  update(id: number, data: RoleUpdateData): Promise<Result<void>>;
  delete(id: number): Promise<Result<void>>;
}
