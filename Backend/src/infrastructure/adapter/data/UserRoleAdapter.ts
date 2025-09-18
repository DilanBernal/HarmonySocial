import { AppDataSource } from "../../config/con_database";
import UserRolePort from "../../../domain/ports/data/UserRolePort";
import UserRoleEntity from "../../entities/UserRoleEntity";
import RoleEntity from "../../entities/RoleEntity";
import Role from "../../../domain/models/Role";

export default class UserRoleAdapter implements UserRolePort {
  private repo = AppDataSource.getRepository(UserRoleEntity);
  private roleRepo = AppDataSource.getRepository(RoleEntity);

  async assignRoleToUser(userId: number, roleId: number): Promise<boolean> {
    const role = await this.roleRepo.findOne({ where: { id: roleId } });
    if (!role) return false;
    const existing = await this.repo.findOne({
      where: { user: { id: userId }, role: { id: roleId } },
    });
    if (existing) return true;
    const entity = this.repo.create({ user: { id: userId } as any, role });
    await this.repo.save(entity);
    return true;
  }

  async removeRoleFromUser(userId: number, roleId: number): Promise<boolean> {
    const existing = await this.repo.findOne({
      where: { user: { id: userId }, role: { id: roleId } },
    });
    if (!existing) return false;
    await this.repo.remove(existing);
    return true;
  }

  async listRolesForUser(userId: number): Promise<Role[]> {
    const rows = await this.repo.find({ where: { user: { id: userId } } });
    return rows.map((r) => ({
      id: r.role.id,
      name: r.role.name,
      description: r.role.description ?? undefined,
      created_at: r.role.created_at,
      updated_at: r.role.updated_at ?? undefined,
    }));
  }

  async listUsersForRole(roleName: string): Promise<number[]> {
    const rows = await this.repo
      .createQueryBuilder("ur")
      .leftJoinAndSelect("ur.role", "role")
      .leftJoin("ur.user", "user")
      .where("role.name = :roleName", { roleName })
      .select(["user.id as user_id"]) // projection
      .getRawMany();
    return rows.map((r) => Number(r.user_id));
  }

  async userHasRole(userId: number, roleName: string): Promise<boolean> {
    const row = await this.repo
      .createQueryBuilder("ur")
      .leftJoin("ur.role", "role")
      .leftJoin("ur.user", "user")
      .where("user.id = :userId", { userId })
      .andWhere("role.name = :roleName", { roleName })
      .getOne();
    return !!row;
  }
}
