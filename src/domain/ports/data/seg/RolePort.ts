import Role from "../../../models/seg/Role";

export interface RoleCreateData {
  name: string;
  description?: string;
}
export interface RoleUpdateData {
  name?: string;
  description?: string;
}

export default interface RolePort {
  create(data: RoleCreateData): Promise<number>;
  update(id: number, data: RoleUpdateData): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  findById(id: number): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  list(): Promise<Role[]>;
}
