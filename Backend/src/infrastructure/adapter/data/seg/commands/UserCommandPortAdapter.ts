import { Repository, EntityNotFoundError, QueryFailedError, Not, In } from "typeorm";
import { SqlAppDataSource } from "../../../../config/con_database";
import { UserEntity } from "../../../../entities/Sql/seg";
import User from "../../../../../domain/models/seg/User";
import Result from "../../../../../domain/shared/Result";
import UserCommandPort from "../../../../../domain/ports/data/seg/command/UserCommandPort";
import DomainEntityNotFoundError from "../../../../../domain/errors/EntityNotFoundError";

export default class UserCommandPortAdapter implements UserCommandPort {
  private userRepository: Repository<UserEntity>;

  constructor() {
    this.userRepository = SqlAppDataSource.getRepository(UserEntity);
  }

  private toEntity(user: Omit<User, "id">): UserEntity {
    const entity = new UserEntity();
    entity.full_name = user.full_name;
    entity.email = user.email;
    entity.password = user.password;
    entity.status = user.status;
    entity.created_at = user.created_at;
    entity.updated_at = user.updated_at;
    entity.username = user.username;
    entity.profile_image = user.profile_image;
    entity.learning_points = user.learning_points;
    entity.favorite_instrument = user.favorite_instrument;
    entity.concurrency_stamp = user.concurrency_stamp;
    entity.security_stamp = user.security_stamp;
    entity.normalized_email = user.normalized_email;
    entity.normalized_username = user.normalized_username;
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
        full_name: user.full_name ?? existing.full_name,
        email: user.email ?? existing.email,
        password: user.password ?? existing.password,
        status: (user as any).status ?? existing.status,
        username: user.username ?? existing.username,
        profile_image: user.profile_image ?? existing.profile_image,
        learning_points: user.learning_points ?? existing.learning_points,
        favorite_instrument: (user as any).favorite_instrument ?? existing.favorite_instrument,
        updated_at: user.updated_at ?? new Date(),
        security_stamp: user.security_stamp ?? existing.security_stamp,
        concurrency_stamp: user.concurrency_stamp ?? existing.concurrency_stamp,
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
