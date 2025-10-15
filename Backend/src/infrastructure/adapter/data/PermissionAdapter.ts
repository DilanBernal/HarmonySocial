import { Repository } from "typeorm";
import PermissionPort from "../../../domain/ports/data/seg/PermissionPort";
import { ApplicationResponse } from "../../../application/shared/ApplicationReponse";
import { SqlAppDataSource } from "../../config/con_database";
import PermissionEntity from "../../entities/PermissionEntity";
import Permission from "../../../domain/models/seg/Permission";

export default class PermissionAdapter implements PermissionPort {
  private repo: Repository<PermissionEntity>;
  constructor() {
    this.repo = SqlAppDataSource.getRepository(PermissionEntity);
  }

  async create(permission: Partial<Permission>) {
    const entity = this.repo.create(permission as PermissionEntity);
    const saved = await this.repo.save(entity);
    return ApplicationResponse.success(saved.id);
  }

  async update(id: number, permission: Partial<Permission>) {
    await this.repo.update({ id }, permission);
    return ApplicationResponse.emptySuccess();
  }

  async delete(id: number) {
    await this.repo.delete({ id });
    return ApplicationResponse.emptySuccess();
  }

  async getById(id: number) {
    const found = await this.repo.findOne({ where: { id } });
    return ApplicationResponse.success(found as any);
  }

  async getByName(name: string) {
    const found = await this.repo.findOne({ where: { name } });
    return ApplicationResponse.success(found as any);
  }

  async getAll() {
    const list = await this.repo.find();
    return ApplicationResponse.success(list as any);
  }
}
