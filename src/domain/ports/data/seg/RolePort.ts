import Role from "../../../models/seg/Role";
import RoleCreateData from "./command/RoleCreateData";
import RoleUpdateData from "./command/RoleUpdateData";

export { RoleCreateData, RoleUpdateData };

export default interface RolePort {
  create(data: RoleCreateData): Promise<number>;
  update(id: number, data: RoleUpdateData): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  findById(id: number): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  list(): Promise<Role[]>;
}
