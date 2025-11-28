import Result from "../../../../shared/Result";

export interface RoleCreateData {
  name: string;
  description?: string;
}

export interface RoleUpdateData {
  name?: string;
  description?: string;
}

export default interface RoleCommandPort {
  create(data: RoleCreateData): Promise<Result<number>>;
  update(id: number, data: RoleUpdateData): Promise<Result<void>>;
  delete(id: number): Promise<Result<void>>;
}
