import { In, Repository } from "typeorm";
import RolePermissionPort from "../../../../domain/ports/data/seg/RolePermissionPort";
import { ApplicationResponse } from "../../../../application/shared/ApplicationReponse";
import { SqlAppDataSource } from "../../../config/con_database";
import RolePermissionEntity from "../../../entities/RolePermissionEntity";
import RoleEntity from "../../../entities/RoleEntity";
import PermissionEntity from "../../../entities/PermissionEntity";
import Permission from "../../../../domain/models/seg/Permission";

export default class RolePermissionAdapter implements RolePermissionPort {
  private repo: Repository<RolePermissionEntity>;
  private roleRepo: Repository<RoleEntity>;
  private permRepo: Repository<PermissionEntity>;
  constructor() {
    this.repo = SqlAppDataSource.getRepository(RolePermissionEntity);
    this.roleRepo = SqlAppDataSource.getRepository(RoleEntity);
    this.permRepo = SqlAppDataSource.getRepository(PermissionEntity);
  }

  async assign(roleId: number, permissionId: number) {
    const role = await this.roleRepo.findOne({ where: { id: roleId } });
    const permission = await this.permRepo.findOne({ where: { id: permissionId } });
    if (!role || !permission) return ApplicationResponse.emptySuccess();
    const exists = await this.repo.findOne({
      where: { role: { id: roleId }, permission: { id: permissionId } },
    });
    if (exists) return ApplicationResponse.emptySuccess();
    const entity = this.repo.create({ role, permission });
    await this.repo.save(entity);
    return ApplicationResponse.emptySuccess();
  }

  async unassign(roleId: number, permissionId: number) {
    const exists = await this.repo.findOne({
      where: { role: { id: roleId }, permission: { id: permissionId } },
    });
    if (exists) await this.repo.remove(exists);
    return ApplicationResponse.emptySuccess();
  }

  async getPermissionsByRole(roleId: number) {
    const list = await this.repo.find({ where: { role: { id: roleId } } });
    const perms = list.map((rp) => rp.permission) as any as Permission[];
    return ApplicationResponse.success(perms);
  }

  async getPermissionsByRoleNames(roleNames: string[]) {
    if (!roleNames?.length) return ApplicationResponse.success([]);
    const roles = await this.roleRepo.find({ where: { name: In(roleNames) } });
    if (!roles.length) return ApplicationResponse.success([]);
    const roleIds = roles.map((r) => r.id);
    const list = await this.repo.find({ where: { role: { id: In(roleIds) } } });
    const perms = list.map((rp) => rp.permission) as any as Permission[];
    return ApplicationResponse.success(perms);
  }
}
