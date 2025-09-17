import PermissionPort from "../../domain/ports/data/PermissionPort";
import RolePermissionPort from "../../domain/ports/data/RolePermissionPort";
import { ApplicationResponse } from "../shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../shared/errors/ApplicationError";
import Permission, { CorePermission } from "../../domain/models/Permission";

export default class PermissionService {
  constructor(private permissionPort: PermissionPort) {}

  async create(name: string, description?: string) {
    if (!name || name.length < 3) {
      return ApplicationResponse.failure(
        new ApplicationError("Nombre de permiso inválido", ErrorCodes.VALIDATION_ERROR),
      );
    }
    const existing = await this.permissionPort.getByName(name);
    if (existing.success && existing.data) {
      return ApplicationResponse.failure(
        new ApplicationError("El permiso ya existe", ErrorCodes.USER_ALREADY_EXISTS),
      );
    }
    return this.permissionPort.create({ name, description });
  }

  async update(id: number, data: Partial<Permission>) {
    if (!id || id <= 0) {
      return ApplicationResponse.failure(
        new ApplicationError("ID inválido", ErrorCodes.VALIDATION_ERROR),
      );
    }
    return this.permissionPort.update(id, data);
  }

  async delete(id: number) {
    if (!id || id <= 0) {
      return ApplicationResponse.failure(
        new ApplicationError("ID inválido", ErrorCodes.VALIDATION_ERROR),
      );
    }
    return this.permissionPort.delete(id);
  }

  async getAll() {
    return this.permissionPort.getAll();
  }
}
