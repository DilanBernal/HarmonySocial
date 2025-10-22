import {
  EntityNotFoundError,
  FindOptionsWhere,
  In,
  Not,
  Or,
  QueryFailedError,
  Repository,
  ILike,
  Like,
  SelectQueryBuilder,
} from "typeorm";
import DomainEntityNotFoundError from "../../../../../domain/errors/EntityNotFoundError";
import { UserEntity } from "../../../../entities/Sql/seg";
import { SqlAppDataSource } from "../../../../config/con_database";
import User, { UserStatus } from "../../../../../domain/models/seg/User";
import UserSearchParamsRequest from "../../../../../application/dto/requests/User/UserSearchParamsRequest";
import UserQueryPort from "../../../../../domain/ports/data/seg/query/UserQueryPort";
import Response from "../../../../../domain/shared/Result";
import DomainError from "../../../../../domain/errors/DomainError";
import UserFilters from "../../../../../domain/valueObjects/UserFilters";
import {
  ApplicationError,
  ErrorCodes,
} from "../../../../../application/shared/errors/ApplicationError";
import envs from "../../../../config/environment-vars";

export default class UserAdapter implements UserQueryPort {
  private userRepository: Repository<UserEntity>;
  private negativeStatus: Array<UserStatus> = [UserStatus.DELETED];

  constructor() {
    this.userRepository = SqlAppDataSource.getRepository(UserEntity);
  }

  async getUserByFilters(filters: UserFilters): Promise<Response<User>> {
    try {
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

        if (filters.status)
          queryBuilder.orWhere("user.status = :status", { status: filters.status });
      }

      const result = await queryBuilder.getOne();

      if (result) return Response.ok(result.toDomain());
      return Response.fail(new DomainEntityNotFoundError({ entity: "usuario" }));
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        return Response.fail(
          new ApplicationError(
            "Ocurrio un error al procesar la solicitud",
            ErrorCodes.SERVER_ERROR,
            [error.name, error.stack, [error.name, error.stack, envs.ENVIRONMENT === "dev" ? error.query : error.driverError], error],
            error,
          ),
        );
      }
      if (error instanceof Error) {
        throw error;
      }
      throw Error("Ocurrio un error inexplicable");
    }
  }

  async getUsersByIds(ids: number[]): Promise<Response<User[]>> {
    try {
      if (!ids.length) return Response.ok([]);
      const rows = await this.userRepository.find({ where: { id: In(ids) } });
      const mapped = rows.map((r) => r.toDomain());
      return Response.ok(mapped);
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        return Response.fail(new ApplicationError(
          "Ocurrio un error con la db al obtener los usuarios por ids",
          ErrorCodes.DATABASE_ERROR,
          [error.name, error.stack, envs.ENVIRONMENT === "dev" ? error.query : error.driverError],
          error))
      }
      if (error instanceof Error) {
        return Response.fail(new ApplicationError("Ocurrio un error al obtener usuarios por ids", ErrorCodes.DATABASE_ERROR, [error.name], error));
      }
      return Response.fail(new DomainError("Error desconocido"));
    }
  }

  async getUserById(id: number): Promise<Response<User>> {
    try {

      const user = await this.userRepository.findOneOrFail({ where: { id: id } });
      return Response.ok(UserEntity.toDomain(user));
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return Response.fail(
          new DomainEntityNotFoundError({ message: "No se encontraron usuarios" }),
        );
      }
      if (error instanceof QueryFailedError) {
        return Response.fail(new ApplicationError(
          "Ocurrio un error en la query",
          ErrorCodes.DATABASE_ERROR,
          [[error.name, error.stack, envs.ENVIRONMENT === "dev" ? error.query : error.driverError]],
          error));
      }
      if (error instanceof Error) {
        return Response.fail(new ApplicationError("Ocurrio un error al obtener usuarios por ids", ErrorCodes.DATABASE_ERROR, [error.name], error));
      }
      return Response.fail(new DomainError("Error desconocido", error as Error));
    }
  }

  async existsUserById(id: number): Promise<Response<boolean>> {
    try {
      const userExists = await this.userRepository.existsBy({ id: id });

      return Response.ok(userExists != null);
    } catch (error: unknown) {
      if (error instanceof EntityNotFoundError) {
        return Response.ok(false);
      }
      if (error instanceof Error) {
        return Response.fail(
          new ApplicationError(
            "Ocurrio un error al retornar el usuario",
            ErrorCodes.DATABASE_ERROR,
            { errorName: error.name, errorMessage: error.message },
            error,
          ),
        );
      }
      return Response.fail(
        new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR, undefined, undefined),
      );
    }
  }


  searchUsersByFilters(filters: UserFilters): Promise<Response<User[]>> {
    throw new Error("Method not implemented.");
  }
  searchUsersByIds(ids: number[]): Promise<Response<Array<User>>> {
    throw new Error("Method not implemented.");
  }
  existsUserByFilters(filters: UserFilters): Promise<Response<boolean>> {
    throw new Error("Method not implemented.");
  }

  getActiveUserById(id: number): Promise<Response<User>> {
    throw new Error("Method not implemented.");
  }
  getActiveUserByFilters(filters: Omit<UserFilters, "status">): Promise<Response<User>> {
    throw new Error("Method not implemented.");
  }
  searchActiveUserByFilters(filters: Omit<UserFilters, "status">): Promise<Response<User[]>> {
    throw new Error("Method not implemented.");
  }
  searchActiveUsersByIds(ids: number[]): Promise<Response<Array<User>>> {
    throw new Error("Method not implemented.");
  }
  existsActiveUserById(id: number): Promise<Response<boolean>> {
    throw new Error("Method not implemented.");
  }
  existsActiveUserByFilters(filters: Omit<UserFilters, "status">): Promise<Response<boolean>> {
    throw new Error("Method not implemented.");
  }
}
