import Permission from "../../models/Permission";
import { ApplicationResponse } from "../../../application/shared/ApplicationReponse";

export default interface PermissionPort {
  create(permission: Partial<Permission>): Promise<ApplicationResponse<number>>;
  update(id: number, permission: Partial<Permission>): Promise<ApplicationResponse<void>>;
  delete(id: number): Promise<ApplicationResponse<void>>;
  getById(id: number): Promise<ApplicationResponse<Permission>>;
  getByName(name: string): Promise<ApplicationResponse<Permission | undefined>>;
  getAll(): Promise<ApplicationResponse<Permission[]>>;
}
