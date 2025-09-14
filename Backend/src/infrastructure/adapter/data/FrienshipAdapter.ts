// Backend/src/infrastructure/adapter/data/FriendshipAdapter.ts
import { FriendshipPort } from "../../../domain/ports/data/FriendshipPort";
import { Friendship } from "../../../domain/models/Friendship";
import { DataSource, Repository } from "typeorm";
import FriendshipEntity from "../../entities/FriendshipEntity";

/**
 * Adapter que usa TypeORM para persistir relaciones de amistad.
 * - Recibe un DataSource (TypeORM) por inyección.
 */
export class FriendshipAdapter implements FriendshipPort {
  private repo: Repository<FriendshipEntity>;

  constructor(private dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(FriendshipEntity);
  }

  private toDomain(entity: FriendshipEntity): Friendship {
    return Friendship.fromPersistence({
      id: entity.id,
      followerId: entity.followerId,
      followedId: entity.followedId,
      createdAt: entity.createdAt,
    });
  }

  async followUser(friendship: Friendship): Promise<Friendship> {
    // crea y guarda; el índice único evita duplicados, pero
    // manejamos la excepción para retornar el existente.
    try {
      const entity = this.repo.create({
        followerId: friendship.followerId,
        followedId: friendship.followedId,
      } as Partial<FriendshipEntity>);
      const saved = await this.repo.save(entity);
      return this.toDomain(saved);
    } catch (err: any) {
      // Si el error es por índice único (duplicate), retornamos el existente
      // (adaptar según driver/DB error codes)
      const existing = await this.repo.findOne({
        where: {
          followerId: friendship.followerId,
          followedId: friendship.followedId,
        },
      });
      if (existing) return this.toDomain(existing);
      throw err;
    }
  }

  async unfollowUser(id: number): Promise<void> {
    await this.repo.delete({ id });
  }

  async getFollowers(userId: number): Promise<Friendship[]> {
    const rows = await this.repo.find({ where: { followedId: userId }, order: { createdAt: "DESC" } });
    return rows.map((r) => this.toDomain(r));
  }

  async getFollowing(userId: number): Promise<Friendship[]> {
    const rows = await this.repo.find({ where: { followerId: userId }, order: { createdAt: "DESC" } });
    return rows.map((r) => this.toDomain(r));
  }

  async findByFollowerAndFollowed(followerId: number, followedId: number): Promise<Friendship | null> {
    const row = await this.repo.findOne({ where: { followerId, followedId } });
    return row ? this.toDomain(row) : null;
  }
}
