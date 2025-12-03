import { Repository, EntityNotFoundError, QueryFailedError, Not, In } from "typeorm";
import { SqlAppDataSource } from "../../../../config/con_database";
import { UserEntity } from "../../../../entities/Sql/seg";
import User from "../../../../../domain/models/seg/User";
import Result from "../../../../../domain/shared/Result";
import UserCommandPort from "../../../../../domain/ports/data/seg/command/UserCommandPort";
import DomainEntityNotFoundError from "../../../../../domain/errors/EntityNotFoundError";

export default class UserCommandAdapter implements UserCommandPort {
  private userRepository: Repository<UserEntity>;

  constructor() {
    this.userRepository = SqlAppDataSource.getRepository(UserEntity);
  }

  private toEntity(user: Omit<User, "id">): UserEntity {
    const entity = new UserEntity();
    entity.full_name = user.fullName;
    entity.email = user.email;
    entity.password = user.password;
    entity.status = user.status;
    entity.created_at = user.createdAt;
    entity.updated_at = user.updatedAt;
    entity.username = user.username;
    entity.profile_image = user.profileImage;
    entity.learning_points = user.learningPoints;
    entity.favorite_instrument = user.favoriteInstrument;
    entity.concurrency_stamp = user.concurrencyStamp;
    entity.security_stamp = user.securityStamp;
    entity.normalized_email = user.normalizedEmail;
    entity.normalized_username = user.normalizedUsername;
    return entity;
  }

  async createUser(user: Omit<User, "id" | "updated_at">): Promise<Result<number, Error>> {
    try {
      const entity = this.toEntity(user as any);
      const saved = await this.userRepository.save(entity);
      return Result.ok(saved.id);
    } catch (e: unknown) {
      if (e instanceof QueryFailedError) {
        return Result.fail(e);
      }
      return Result.fail(e as Error);
    }
  }

  async updateUser(id: number, user: Partial<User>): Promise<Result<void, Error>> {
    try {
      const negativeStatus = ["DELETED"] as const;
      const existing = await this.userRepository.findOneByOrFail({
        id,
        status: Not(In(negativeStatus as unknown as any[])) as any,
      });
      Object.assign(existing, {
        full_name: user.fullName ?? existing.full_name,
        email: user.email ?? existing.email,
        password: user.password ?? existing.password,
        status: (user as any).status ?? existing.status,
        username: user.username ?? existing.username,
        profile_image: user.profileImage ?? existing.profile_image,
        learning_points: user.learningPoints ?? existing.learning_points,
        favorite_instrument: (user as any).favorite_instrument ?? existing.favorite_instrument,
        updated_at: user.updatedAt ?? new Date(),
        security_stamp: user.securityStamp ?? existing.security_stamp,
        concurrency_stamp: user.concurrencyStamp ?? existing.concurrency_stamp,
        normalized_email: user.email ? user.email.toUpperCase() : existing.normalized_email,
        normalized_username: user.username
          ? user.username.toUpperCase()
          : existing.normalized_username,
      });
      await this.userRepository.save(existing);
      return Result.ok(undefined);
    } catch (e: unknown) {
      if (e instanceof EntityNotFoundError) {
        return Result.fail(new DomainEntityNotFoundError({ entity: "usuario" }));
      }
      return Result.fail(e as Error);
    }
  }

  async deleteUser(id: number): Promise<Result<void, Error>> {
    try {
      const negativeStatus = ["DELETED"] as const;
      const existing = await this.userRepository.findOneByOrFail({
        id,
        status: Not(In(negativeStatus as unknown as any[])) as any,
      });
      Object.assign(existing, {
        status: "DELETED",
        password: "N/A",
        updated_at: new Date(),
        full_name: "N/A",
        profile_image: "N/A",
      });
      await this.userRepository.save(existing);
      return Result.ok(undefined);
    } catch (e: unknown) {
      if (e instanceof EntityNotFoundError) {
        return Result.fail(new DomainEntityNotFoundError({ entity: "usuario" }));
      }
      return Result.fail(e as Error);
    }
  }
}
