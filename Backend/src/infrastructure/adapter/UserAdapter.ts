import { EntityNotFoundError, FindOptionsWhere, In, Not, QueryFailedError, Repository } from "typeorm";
import UserPort from "../../domain/ports/data/UserPort";
import UserEntity from "../entities/UserEntity";
import { AppDataSource } from "../config/con_database";
import User, { UserInstrument, UserStatus } from "../../domain/models/User";
import { ApplicationResponse } from "../../application/shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../../application/shared/errors/ApplicationError";


export default class UserAdapter implements UserPort {

  private userRepository: Repository<UserEntity>;
  private negativeStatus: Array<UserStatus> = [UserStatus.BLOCKED, UserStatus.DELETED, UserStatus.SUSPENDED];
  private positiveStatus: Array<UserStatus> = [UserStatus.ACTIVE, UserStatus.FROZEN];

  constructor() {
    this.userRepository = AppDataSource.getRepository(UserEntity);
  }

  private toDomain(user: UserEntity): User {
    const userDomain: User = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      password: user.password,
      status: user.status,
      username: user.username,
      profile_image: user.profile_image,
      learning_points: user.learning_points,
      favorite_instrument: user.favorite_instrument,
      is_artist: user.is_artist,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
    return userDomain;
  }
  private toEntity(user: Omit<User, "id">): UserEntity {
    const userEntity: UserEntity = new UserEntity();
    userEntity.full_name = user.full_name;
    userEntity.email = user.email;
    userEntity.password = user.password;
    userEntity.status = user.status;
    userEntity.created_at = user.created_at;
    userEntity.updated_at = user.updated_at;
    userEntity.username = user.username;
    userEntity.profile_image = user.profile_image;
    userEntity.learning_points = user.learning_points;
    userEntity.favorite_instrument = user.favorite_instrument;
    userEntity.is_artist = user.is_artist;
    return userEntity;
  }

  async createUser(user: Omit<User, "id">): Promise<ApplicationResponse<number>> {
    try {
      const newUser = this.toEntity(user);
      const savedUser = await this.userRepository.save(newUser);
      return ApplicationResponse.success(savedUser.id);
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        throw ApplicationResponse.failure(new ApplicationError("Ocurrio un error al crear el usuario", ErrorCodes.DATABASE_ERROR, error.message, error));
      }
      if (error instanceof Error) {
        throw ApplicationResponse.failure(new ApplicationError("Ocurrio un error al crear el usuario",
          ErrorCodes.DATABASE_ERROR,
          { errorName: error.name, errorMessage: error.message },
          error
        ));
      }
      throw error;
    }
  }
  async updateUser(id: number, user: Partial<User>): Promise<ApplicationResponse> {
    try {
      const whereCondition: FindOptionsWhere<UserEntity>[] = [
        { id: id, status: Not(In(this.negativeStatus)) }
      ];

      const existingUser = await this.userRepository.findOneOrFail({ where: whereCondition });
      if (!existingUser) {
        throw ApplicationResponse.failure(new ApplicationError("El usuario no fue encontrado", ErrorCodes.VALUE_NOT_FOUND));
      }
      Object.assign(existingUser, {
        full_name: user.full_name ?? existingUser.full_name,
        email: user.email ?? existingUser.email,
        password: user.password ?? existingUser.password,
        status: user.status ?? existingUser.status,
        username: user.username ?? existingUser.username,
        profile_image: user.profile_image ?? existingUser.profile_image,
        learning_points: user.learning_points ?? existingUser.learning_points,
        favorite_instrument: user.favorite_instrument ?? existingUser.favorite_instrument,
        is_artist: user.is_artist ?? existingUser.is_artist,
        created_at: existingUser.created_at,
        updated_at: user.updated_at ?? new Date(Date.now()),
      });
      await this.userRepository.save(existingUser);
      return ApplicationResponse.emptySuccess();
    } catch (error: unknown) {
      if (error instanceof EntityNotFoundError) {
        throw ApplicationResponse.failure(new ApplicationError("El usuario no fue encontrado", ErrorCodes.VALUE_NOT_FOUND, error.message, error));
      }
      if (error instanceof QueryFailedError) {
        throw ApplicationResponse.failure(new ApplicationError("Ocurrio un error con la DB", ErrorCodes.DATABASE_ERROR, error.message, error));
      }
      if (error instanceof Error) {
        throw ApplicationResponse.failure(new ApplicationError("Ocurrio un error al actualizar el usuario",
          ErrorCodes.DATABASE_ERROR, { errorName: error.name, errorMessage: error.message }, error));
      }
      throw error;
    }
  }

  async deleteUser(id: number): Promise<ApplicationResponse> {
    try {
      const existingUser = await this.userRepository.findOneOrFail({ where: { id: id, status: Not(In(this.positiveStatus)) } });

      if (!existingUser) {
        throw new EntityNotFoundError(UserEntity, "No existe el usuario");
      }

      Object.assign(existingUser, {
        status: UserStatus.DELETED,
        password: null,
        updated_at: new Date()
      });
      await this.userRepository.save(existingUser);
      return ApplicationResponse.emptySuccess();
    } catch (error: unknown) {
      if (error instanceof EntityNotFoundError) {
        throw ApplicationResponse.failure(new ApplicationError("No se encontro el usuario a eliminar",
          ErrorCodes.VALUE_NOT_FOUND, { errorName: error.name, errorMessage: error.message }, error));
      }
      if (error instanceof QueryFailedError) {
        throw ApplicationResponse.failure(new ApplicationError("Ocurrio un error con la DB",
          ErrorCodes.DATABASE_ERROR,
          { errorName: error.name, errorMessage: error.message },
          error
        ));
      }
      if (error instanceof Error) {
        throw ApplicationResponse.failure(new ApplicationError("Ocurrio un error al actualizar el usuario",
          ErrorCodes.DATABASE_ERROR,
          { errorName: error.name, errorMessage: error.message },
          error
        ));
      }
      throw error;
    }
  }

  async getAllUsers(): Promise<ApplicationResponse<Array<User>>> {
    try {
      const whereCondition: FindOptionsWhere<UserEntity>[] = [
        { status: Not(In(this.negativeStatus)) }
      ];

      const users = await this.userRepository.find({ where: whereCondition });
      return ApplicationResponse.success(users.map(this.toDomain));
    } catch (error) {
      console.error(error);
      throw new Error("No se pudo crear el ususario");
    }
  }
  async getUserById(id: number): Promise<ApplicationResponse<User>> {
    try {
      const whereCondition: FindOptionsWhere<UserEntity>[] = [
        { id: id, status: Not(In(this.negativeStatus)) }
      ];

      const user = await this.userRepository.findOneOrFail({ where: whereCondition });
      if (user)
        return ApplicationResponse.success(user);
      throw ApplicationResponse.failure<User>(new ApplicationError("No se encontraron usuarios", ErrorCodes.VALUE_NOT_FOUND))
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ApplicationResponse.failure<User>(new ApplicationError("No se encontraron usuarios", ErrorCodes.VALUE_NOT_FOUND))
      }
      throw ApplicationResponse.failure(new ApplicationError("Error en userAdapter", ErrorCodes.DATABASE_ERROR));
    }
  }
  async getUserByEmail(email: string): Promise<ApplicationResponse<User>> {
    try {
      const whereCondition: FindOptionsWhere<UserEntity>[] = [
        { email: email, status: Not(In(this.negativeStatus)) }
      ];

      const user = await this.userRepository.findOneOrFail({ where: whereCondition });
      return ApplicationResponse.success(this.toDomain(user));
    } catch (error) {
      console.error(error);
      throw new Error("No se pudo encontrar el ususario");
    }
  }

  async getUserByEmailOrUsername(email: string, username: string): Promise<ApplicationResponse<User>> {
    try {
      const whereCondition: FindOptionsWhere<UserEntity>[] = [
        { email: email, status: Not(In(this.negativeStatus)) },
        { username: username, status: Not(In(this.negativeStatus)) }
      ];

      const user = await this.userRepository.findOneOrFail({ where: whereCondition });
      return ApplicationResponse.success(user);
    } catch (error) {
      throw error;
    }
  }

  //Seccion de validaciones

  /**
   * @param email
   * @param username 
   * @returns Variable tipo boolean que determina si ya existia un usuario con los parametros email o username.
   */
  async existsUserByEmailOrUsername(email: string, username: string): Promise<ApplicationResponse<boolean>> {
    try {
      const whereCondition: FindOptionsWhere<UserEntity>[] = [
        { email: email, status: Not(In(this.negativeStatus)) },
        { username: username, status: Not(In(this.negativeStatus)) }
      ];

      const userExists = await this.userRepository.findOneOrFail({ where: whereCondition });
      return ApplicationResponse.success(userExists != null);
    } catch (error: unknown) {
      if (error instanceof EntityNotFoundError) {
        throw ApplicationResponse.failure(new ApplicationError("No se encontro el usuario", ErrorCodes.VALUE_NOT_FOUND, { errorName: error.name, errorMessage: error.message }, error));
      } else {
        throw error;
      }
    }
  }
  async existsUserById(id: number): Promise<ApplicationResponse<boolean>> {
    try {
      const whereCondition: FindOptionsWhere<UserEntity>[] = [
        { id: id, status: Not(In(this.negativeStatus)) }
      ];
      const userExists = await this.userRepository.findOneOrFail({ where: whereCondition });

      return ApplicationResponse.success(userExists != null);
    } catch (error: unknown) {
      if (error instanceof EntityNotFoundError) {
        throw error;
      }
      throw error;
    }
  }
}