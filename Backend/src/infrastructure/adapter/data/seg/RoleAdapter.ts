import { SqlAppDataSource } from "../../../config/con_database";
import { RoleEntity } from "../../../entities/Sql";
import RolePort, { RoleCreateData, RoleUpdateData } from "../../../../domain/ports/data/seg/RolePort";
import Role from "../../../../domain/models/seg/Role";

export default class RoleAdapter implements RolePort {
  private repo = SqlAppDataSource.getRepository(RoleEntity);

  async create(data: RoleCreateData): Promise<number> {
    const entity = this.repo.create({ name: data.name, description: data.description });
    const saved = await this.repo.save(entity);
    return saved.id;
  }

  async update(id: number, data: RoleUpdateData): Promise<boolean> {
    await this.repo.update(id, { ...data });
    return true;
  }

  async delete(id: number): Promise<boolean> {
    await this.repo.delete(id);
    return true;
  }

  async findById(id: number): Promise<Role | null> {
    const r = await this.repo.findOne({ where: { id } });
    return r
      ? {
        id: r.id,
        name: r.name,
        description: r.description ?? undefined,
        created_at: r.created_at,
        updated_at: r.updated_at ?? undefined,
      }
      : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const r = await this.repo.findOne({ where: { name } });
    return r
      ? {
        id: r.id,
        name: r.name,
        description: r.description ?? undefined,
        created_at: r.created_at,
        updated_at: r.updated_at ?? undefined,
      }
      : null;
  }

  async list(): Promise<Role[]> {
    const rows = await this.repo.find();
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description ?? undefined,
      created_at: r.created_at,
      updated_at: r.updated_at ?? undefined,
    }));
  }
}
