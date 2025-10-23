import { Repository, SelectQueryBuilder } from "typeorm";
import UserPublicProfileQueryPort from "../../../../../domain/ports/data/seg/query/UserPublicProfileQueryPort";
import Result from "../../../../../domain/shared/Result";
import UserFilters from "../../../../../domain/valueObjects/UserFilters";
import UserPublicProfile from "../../../../../domain/valueObjects/UserPublicProfile";
import { SqlAppDataSource } from "../../../../config/con_database";
import { UserEntity } from "../../../../entities/Sql/seg";
import DomainEntityNotFoundError from "../../../../../domain/errors/EntityNotFoundError";

export default class UserPublicProfileQueryAdapter implements UserPublicProfileQueryPort {
  private userRepository: Repository<UserEntity>;

  constructor() {
    this.userRepository = SqlAppDataSource.getRepository(UserEntity);
  }

  async getUserPublicProfileById(id: number): Promise<Result<UserPublicProfile>> {
    try {
      const response: UserEntity = await this.userRepository.findOneOrFail({
        where: { id: id },
        select: {
          id: true,
          username: true,
          profile_image: true,
          learning_points: true,
          favorite_instrument: true,
          created_at: true,
        },
      });

      if (!response) {
        return Result.fail(new DomainEntityNotFoundError({ entity: "usuario" }));
      }

      const userPublicProfile: UserPublicProfile = response.toUserPublicProfile();

      return Result.ok(userPublicProfile);
    } catch (error: unknown) {
      console.error(error);
    }
    throw new Error("Method not implemented.");
  }
  async getUserPublicProfileByFilters(filters: UserFilters): Promise<Result<UserPublicProfile>> {
    throw new Error("Method not implemented.");
  }
  async searchUsersPublicProfileByFilters(
    filters: UserFilters,
  ): Promise<Result<UserPublicProfile[]>> {
    throw new Error("Method not implemented.");
  }

  private applyFilters(filters: UserFilters): SelectQueryBuilder<UserEntity> {
    const queryBuilder: SelectQueryBuilder<UserEntity> =
      this.userRepository.createQueryBuilder("user");

    if (filters.includeFilters) {
      if (filters.id) queryBuilder.andWhere("user.id = :id", { id: filters.id });

      if (filters.email) queryBuilder.andWhere("user.email = :email", { email: filters.email });

      if (filters.username)
        queryBuilder.andWhere("user.username = :username", { username: filters.username });

      if (filters.status)
        queryBuilder.andWhere("user.status = :status", { status: filters.status });
    } else {
      if (filters.id) queryBuilder.orWhere("user.id = :id", { id: filters.id });

      if (filters.email) queryBuilder.orWhere("user.email = :email", { email: filters.email });

      if (filters.username)
        queryBuilder.orWhere("user.username = :username", { username: filters.username });

      if (filters.status) queryBuilder.orWhere("user.status = :status", { status: filters.status });
    }
    return queryBuilder;
  }
}
