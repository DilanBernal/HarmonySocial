import {
  EntityNotFoundError,
  FindOptionsWhere,
  In,
  Not,
  QueryFailedError,
  Repository,
} from "typeorm";
import UserPort from "../../../domain/ports/data/UserPort";
import UserEntity from "../../entities/UserEntity";
import { AppDataSource } from "../../config/con_database";
import User, { UserStatus } from "../../../domain/models/User";
import { ApplicationResponse } from "../../../application/shared/ApplicationReponse";
import {
  ApplicationError,
  ErrorCodes,
  ErrorResponse,
} from "../../../application/shared/errors/ApplicationError";
import UserBasicDataResponse from "../../../application/dto/responses/UserBasicDataResponse";
import NotFoundResponse from "../../../application/shared/responses/NotFoundResponse";

export default class UserAdapter implements UserPort {
  private userRepository: Repository<UserEntity>;
  /**
   * @summary Son los estados de cuentas que ya no se pueden reactivar, para que si quiere crear una cuenta de 0 pueda hacerlo
   */
  private negativeStatus: Array<UserStatus> = [UserStatus.DELETED];
  /**
   * @summary Son los estados de cuentas que como tal ya existen, por lo que no se puede crear un usuario con esas credenciales, en el caso de blocked y suspended es para que el usuario que ya fue expulsado no pueda volver a crearse una cuenta con el mismo correo
   */
  private positiveStatus: Array<UserStatus> = [
    UserStatus.ACTIVE,
    UserStatus.FROZEN,
    UserStatus.BLOCKED,
    UserStatus.SUSPENDED,
  ];

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
      security_stamp: user.security_stamp,
      concurrency_stamp: user.concurrency_stamp,
      is_artist: user.is_artist,
      created_at: user.created_at,
      updated_at: user.updated_at,
      normalized_email: user.normalized_email,
      normalized_username: user.normalized_username,
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
    userEntity.concurrency_stamp = user.concurrency_stamp;
    userEntity.security_stamp = user.security_stamp;
    return userEntity;
  }

  /**
   * @param user: Recibe la clase usuario con los campos username, full_name, password, email, profile_image, status, favorite_instrument, is_artist, y valores de observación
   * @returns User ID
   * @summary La función va a transformar el usuario de dominio omitiendo el id a un usuario de entidad, para poder usar typeorm para guardar al usuario en la base de datos y retornar el id si se creo satisfactoriamente, en dado caso que la peticion haya fallado se van a manejar los errores en el trycatch, para lanzar un @ApplicationResponse de falla que tenga la información del error
   */
  async createUser(user: Omit<User, "id">): Promise<ApplicationResponse<number>> {
    try {
      const newUser = this.toEntity(user);
      const savedUser = await this.userRepository.save(newUser);
      return ApplicationResponse.success(savedUser.id);
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "Ocurrio un error al crear el usuario",
            ErrorCodes.DATABASE_ERROR,
            error.message,
            error,
          ),
        );
      }
      if (error instanceof Error) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "Ocurrio un error al crear el usuario",
            ErrorCodes.DATABASE_ERROR,
            { errorName: error.name, errorMessage: error.message },
            error,
          ),
        );
      }
      throw error;
    }
  }
  /**
   * @param id El id del usuario a editar, para poder buscarlo en la base de datos independientemente de los cambios de usuario
   * @param user El usuario de manera parcial, para poder actualizar los datos que se hayan enviado y
   * @returns ApplicationResponse<void> Si se actualizo correctamente traera un ApplicationResponse con un success vacio, si no sale bien va a arrojar un ApplicationResponse con el error
   * @summary La funcion va a buscar el usuario en la db con el id indicado, tambien lo va a filtrar por los estados positivos para que si un usuario ha sido eliminado, se pueda crear otra cuenta desde 0, si el usuario no existe va a lanzar un error ApplicationResponse, con un ApplicationError con un mensaje "El usuario no fue encontrado" y el Error Code de VALUE_NOT_FOUND. va a capturar si existe algun otro error de query para lanzarlo con un Error Code de DATABASE_ERROR, por ultimo si se escapa el error lo va a volver a lanzar.
   */
  async updateUser(id: number, user: Partial<User>): Promise<ApplicationResponse> {
    try {
      const whereCondition: FindOptionsWhere<UserEntity>[] = [
        { id: id, status: Not(In(this.negativeStatus)) },
      ];

      const existingUser = await this.userRepository.findOneOrFail({ where: whereCondition });
      if (!existingUser) {
        return ApplicationResponse.failure(
          new ApplicationError("El usuario no fue encontrado", ErrorCodes.VALUE_NOT_FOUND),
        );
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
        security_stamp: user.concurrency_stamp ?? existingUser.security_stamp,
        concurrency_stamp: user.concurrency_stamp ?? existingUser.concurrency_stamp,
      });
      await this.userRepository.save(existingUser);
      return ApplicationResponse.emptySuccess();
    } catch (error: unknown) {
      if (error instanceof EntityNotFoundError) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "El usuario no fue encontrado",
            ErrorCodes.VALUE_NOT_FOUND,
            error.message,
            error,
          ),
        );
      }
      if (error instanceof QueryFailedError) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "Ocurrio un error con la DB",
            ErrorCodes.DATABASE_ERROR,
            error.message,
            error,
          ),
        );
      }
      if (error instanceof Error) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "Ocurrio un error al actualizar el usuario",
            ErrorCodes.DATABASE_ERROR,
            { errorName: error.name, errorMessage: error.message },
            error,
          ),
        );
      }
      return ApplicationResponse.failure(
        new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR, undefined, undefined),
      );
    }
  }

  /**
   * @param id El id numerico único del usuario para buscarlo en la DB
   * @returns ApplicationResponse<void>  Retorna un ApplicationResponse de success para declarar que se borro logicamente el usuario, si falla retorna un ApplicationResponse con el error.
   * @summary La funcion recibe por parametros un id, va a buscarlo en la DB filtrandolo por los estados que no esten en el positiveStatus, para poder eliminarlo cambiandole el status a inactivo, eliminando la contraseña y camniando la fecha de actualización. Si falla va a capturar si el usuario no existe, si hubo un error de query o algún otro error que lo lanzaria de nuevo.
   */
  async deleteUser(id: number): Promise<ApplicationResponse> {
    try {
      const existingUser = await this.userRepository.findOneOrFail({
        where: { id: id, status: Not(In(this.positiveStatus)) },
      });

      if (!existingUser) {
        return ApplicationResponse.failure(
          new ApplicationError("No se encontro el usuario a eliminar", ErrorCodes.VALUE_NOT_FOUND),
        );
      }

      Object.assign(existingUser, {
        status: UserStatus.DELETED,
        password: null,
        updated_at: new Date(),
      });
      await this.userRepository.save(existingUser);
      return ApplicationResponse.emptySuccess();
    } catch (error: unknown) {
      if (error instanceof EntityNotFoundError) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "No se encontro el usuario a eliminar",
            ErrorCodes.VALUE_NOT_FOUND,
            { errorName: error.name, errorMessage: error.message },
            error,
          ),
        );
      }
      if (error instanceof QueryFailedError) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "Ocurrio un error con la DB",
            ErrorCodes.DATABASE_ERROR,
            { errorName: error.name, errorMessage: error.message },
            error,
          ),
        );
      }
      if (error instanceof Error) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "Ocurrio un error al actualizar el usuario",
            ErrorCodes.DATABASE_ERROR,
            { errorName: error.name, errorMessage: error.message },
            error,
          ),
        );
      }
      return ApplicationResponse.failure(
        new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR, undefined, undefined),
      );
    }
  }
  /**
   * @returns Retorna un array de usuarios con status que no esten en la lista de estados negativos
   */
  async getAllUsers(): Promise<ApplicationResponse<Array<User>>> {
    try {
      const whereCondition: FindOptionsWhere<UserEntity>[] = [
        { status: Not(In(this.negativeStatus)) },
      ];

      const users = await this.userRepository.find({ where: whereCondition });
      return ApplicationResponse.success(users.map(this.toDomain));
    } catch (error) {
      console.error(error);
      throw new Error("No se pudo crear el ususario");
    }
  }
  /**
   * @param id Id numerico unico del usuario en la DB
   * @returns ApplicationResponse<User> Si encuentra el usuario por el id, va a retornarlo en la data, si no va a retornar un ApplicationResponse con los errores correspondientes
   * @summary Se recibe el id del usuario para buscarlo en la base de datos, filtrando los usuarios que no esten en la lista en la negativeStatus, si no encuentra el usuario va a retornar un ApplicationResponse failure con un Error Code de VALUE_NOT_FOUND si no es un error de que no lo encontro, lanzaraun error de Database
   */
  async getUserById(id: number): Promise<ApplicationResponse<User>> {
    try {
      const whereCondition: FindOptionsWhere<UserEntity>[] = [
        { id: id, status: Not(In(this.negativeStatus)) },
      ];

      const user = await this.userRepository.findOneOrFail({ where: whereCondition });
      if (user) return ApplicationResponse.success(user);
      return ApplicationResponse.failure<User>(
        new ApplicationError("No se encontraron usuarios", ErrorCodes.VALUE_NOT_FOUND),
      );
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "No se encontraron usuarios",
            ErrorCodes.VALUE_NOT_FOUND,
            { errorName: error.name, errorMessage: error.message },
            error,
          ),
        );
      }
      if (error instanceof QueryFailedError) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "Ocurrio un error en la query",
            ErrorCodes.DATABASE_ERROR,
            { errorName: error.name, errorMessage: error.message },
            error,
          ),
        );
      }
      if (error instanceof Error) {
        return ApplicationResponse.failure(
          new ApplicationError("Error en userAdapter", ErrorCodes.DATABASE_ERROR, undefined, error),
        );
      }
      return ApplicationResponse.failure(
        new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR, undefined, undefined),
      );
    }
  }
  /**
   * @param email Email unico del usuario en la DB
   * @returns ApplicationResponse<User> Si encuentra el usuario por el email, va a retornarlo en la data, si no va a retornar un ApplicationResponse con los errores correspondientes
   * @summary Se recibe el email del usuario para buscarlo en la base de datos, filtrando los usuarios que no esten en la lista en la negativeStatus, si no encuentra el usuario va a retornar un ApplicationResponse failure con un Error Code de VALUE_NOT_FOUND si no es un error de que no lo encontro, lanzaraun error de Database
   */
  async getUserByEmail(email: string): Promise<ApplicationResponse<User>> {
    try {
      const whereCondition: FindOptionsWhere<UserEntity>[] = [
        { email: email, status: Not(In(this.negativeStatus)) },
      ];
      const user = await this.userRepository.findOneOrFail({ where: whereCondition });
      return ApplicationResponse.success(this.toDomain(user));
    } catch (error: unknown) {
      if (error instanceof EntityNotFoundError) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "No se encontró el usuario",
            ErrorCodes.VALUE_NOT_FOUND,
            { errorName: error.name, errorMessage: error.message },
            error,
          ),
        );
      }
      if (error instanceof QueryFailedError) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "Ocurrió un error en la query",
            ErrorCodes.DATABASE_ERROR,
            { errorName: error.name, errorMessage: error.message },
            error,
          ),
        );
      }
      if (error instanceof Error) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "Error en getUserByEmail",
            ErrorCodes.DATABASE_ERROR,
            undefined,
            error,
          ),
        );
      }
      return ApplicationResponse.failure(
        new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR, undefined, undefined),
      );
    }
  }
  /**
   * @param email Email unico del usuario en la DB
   * @param username Username unico del usuario en la DB
   * @returns ApplicationResponse<User> Si encuentra el usuario por el email o el username, va a retornarlo en la data, si no va a retornar un ApplicationResponse con los errores correspondientes
   * @summary Se recibe el email y el username del usuario para buscarlo en la base de datos, filtrando los usuarios que no esten en la lista en la negativeStatus, si no encuentra el usuario va a retornar un ApplicationResponse failure con un Error Code de VALUE_NOT_FOUND si no es un error de que no lo encontro, lanzaraun error de Database.
   */
  async getUserByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<ApplicationResponse<User>> {
    try {
      const whereCondition: FindOptionsWhere<UserEntity>[] = [
        { email: email, status: Not(In(this.negativeStatus)) },
        { username: username, status: Not(In(this.negativeStatus)) },
      ];

      const user = await this.userRepository.findOneOrFail({ where: whereCondition });
      return ApplicationResponse.success(user);
    } catch (error: unknown) {
      if (error instanceof EntityNotFoundError) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "No se encontró el usuario",
            ErrorCodes.VALUE_NOT_FOUND,
            { errorName: error.name, errorMessage: error.message },
            error,
          ),
        );
      }
      if (error instanceof QueryFailedError) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "Ocurrió un error en la query",
            ErrorCodes.DATABASE_ERROR,
            { errorName: error.name, errorMessage: error.message },
            error,
          ),
        );
      }
      if (error instanceof Error) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "Error en getUserByEmailOrUsername",
            ErrorCodes.DATABASE_ERROR,
            undefined,
            error,
          ),
        );
      }
      return ApplicationResponse.failure(
        new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR, undefined, undefined),
      );
    }
  }

  /**
   * @param userOrEmail Username o email único del usuario en la DB
   * @returns ApplicationResponse<User> Si encuentra el usuario por el username o el email, lo retorna en la data; si no, retorna un ApplicationResponse con los errores correspondientes
   * @summary Busca un usuario por username o email, filtrando los usuarios que no estén en la lista negativeStatus. Si no lo encuentra, retorna un ApplicationResponse failure con Error Code VALUE_NOT_FOUND; si ocurre otro error, retorna un error de Database.
   */
  async getUserByLoginRequest(userOrEmail: string): Promise<ApplicationResponse<User>> {
    try {
      const q = userOrEmail.trim().toLowerCase();

      const user = await this.userRepository
        .createQueryBuilder("u")
        .where("(LOWER(u.email) = :q OR LOWER(u.username) = :q)", { q })
        .andWhere("u.status <> :deleted", { deleted: UserStatus.DELETED })
        .getOneOrFail();

      return ApplicationResponse.success(this.toDomain(user));
    } catch (error: unknown) {
      if (error instanceof EntityNotFoundError) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "No se encontró el usuario",
            ErrorCodes.VALUE_NOT_FOUND,
            error.message,
            error,
          ),
        );
      }
      if (error instanceof QueryFailedError) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "Ocurrió un error en la query",
            ErrorCodes.DATABASE_ERROR,
            error.message,
            error,
          ),
        );
      }
      return ApplicationResponse.failure(
        new ApplicationError(
          "Error en getUserByLoginRequest",
          ErrorCodes.DATABASE_ERROR,
          undefined,
          error as any,
        ),
      );
    }
  }

  async getUserBasicDataById(id: number): Promise<ApplicationResponse<UserBasicDataResponse>> {
    try {
      const userData: UserEntity = await this.userRepository.findOneOrFail({
        where: { id: id },
        select: [
          "id",
          "full_name",
          "learning_points",
          "created_at",
          "email",
          "profile_image",
          "favorite_instrument",
          "username",
        ],
      });

      const userBasicData: UserBasicDataResponse = {
        id: userData.id,
        fullName: userData.full_name,
        email: userData.email,
        activeFrom: userData.created_at.getFullYear(),
        profileImage: userData.profile_image,
        username: userData.username,
        learningPoints: userData.learning_points,
        favoriteInstrument: userData.favorite_instrument,
      };

      return ApplicationResponse.success(userBasicData);
    } catch (error: unknown) {
      if (error instanceof EntityNotFoundError) {
        return new NotFoundResponse<UserBasicDataResponse>({ message: "El usuario no existe" });
      }
      if (error instanceof QueryFailedError) {
        return ApplicationResponse.failure(
          new ApplicationError("Ocurrio un error con la base de datos", ErrorCodes.DATABASE_ERROR),
        );
      }
      throw error;
    }
  }

  async getUserStampsAndUserInfoByUserOrEmail(
    userOrEmail: string,
  ): Promise<ApplicationResponse<[string, string, number, string, string]>> {
    try {
      const whereCondition: FindOptionsWhere<UserEntity>[] = [
        { normalized_email: userOrEmail.toUpperCase(), status: Not(In(this.negativeStatus)) },
        { normalized_username: userOrEmail.toUpperCase(), status: Not(In(this.negativeStatus)) },
      ];

      const r = await this.userRepository.findOne({
        where: whereCondition,
        select: ["id", "concurrency_stamp", "security_stamp", "profile_image", "password"],
      });

      if (!r) {
        return new NotFoundResponse({ entity: "usuario" });
      }
      return ApplicationResponse.success([
        r.concurrency_stamp,
        r.security_stamp,
        r.id,
        r.profile_image,
        r.password,
      ]);
    } catch {
      return ApplicationResponse.failure(
        new ApplicationError("Error en getUserStampsByEmail", ErrorCodes.SERVER_ERROR),
      );
    }
  }

  /**
   * @param userOrEmail Username o email unico del usuario en la DB
   * @returns ApplicationResponse<User> Si encuentra el usuario por el usuername o el email, va a retornarlo en la data, si no va a retornar un ApplicationResponse con los errores correspondientes
   * @summary Se recibe el usuario o email del usuario para buscarlo en la base de datos, filtrando los usuarios que no esten en la lista en la negativeStatus, si no encuentra el usuario va a retornar un ApplicationResponse failure con un Error Code de VALUE_NOT_FOUND si no es un error de que no lo encontro, lanzaraun error de Database
   */
  async existsUserByLoginRequest(userOrEmail: string): Promise<ApplicationResponse<boolean>> {
    try {
      const q = userOrEmail.trim().toLowerCase();

      const count = await this.userRepository
        .createQueryBuilder("u")
        .where("(LOWER(u.email) = :q OR LOWER(u.username) = :q)", { q })
        .andWhere("u.status = :active", { active: UserStatus.ACTIVE })
        .getCount();

      return ApplicationResponse.success(count > 0);
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "Ocurrió un erro[r] con la DB",
            ErrorCodes.DATABASE_ERROR,
            error.message,
            error,
          ),
        );
      }
      return ApplicationResponse.failure(
        new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR, undefined, error as any),
      );
    }
  }

  //Seccion de validaciones

  /**
   * @param email Email unico del usuario en la DB
   * @param username Username unico del usuario en la DB
   * @returns Promise<ApplicationResponse<boolean>> Variable tipo boolean que determina si ya existia un usuario con los parametros email o username.
   * @summary Se recibe el email y el username del usuario para buscarlo en la base de datos, filtrando los usuarios que no esten en la lista en la negativeStatus, si no encuentra el usuario va a retornar un ApplicationResponse failure con un Error Code de VALUE_NOT_FOUND si no es un error de que no lo encontro, lanzara un error de Database
   */
  async existsUserByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<ApplicationResponse<boolean>> {
    try {
      const whereCondition: FindOptionsWhere<UserEntity>[] = [
        { email: email, status: Not(In(this.negativeStatus)) },
        { username: username, status: Not(In(this.negativeStatus)) },
      ];

      const userExists: UserEntity = await this.userRepository.findOneOrFail({
        where: whereCondition,
      });
      return ApplicationResponse.success(userExists != null);
    } catch (error: unknown) {
      if (error instanceof EntityNotFoundError) {
        return ApplicationResponse.success(false);
      }
      if (error instanceof QueryFailedError) {
        return ApplicationResponse.failure(new ApplicationError("", 2));
      } else {
        return ApplicationResponse.failure(
          new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR, undefined, undefined),
        );
      }
    }
  }
  /**
   * @param id Id numerico unico del usuario en la DB
   * @returns Promise<ApplicationResponse<boolean>> Variable tipo boolean que determina si ya existia un usuario con los parametros email o username.
   * @summary Se recibe el email y el username del usuario para buscarlo en la base de datos, filtrando los usuarios que no esten en la lista en la negativeStatus, si no encuentra el usuario va a retornar un ApplicationResponse failure con un Error Code de VALUE_NOT_FOUND si no es un error de que no lo encontro, lanzaraun error de Database
   */
  async existsUserById(id: number): Promise<ApplicationResponse<boolean>> {
    try {
      const whereCondition: FindOptionsWhere<UserEntity>[] = [
        { id: id, status: Not(In(this.negativeStatus)) },
      ];
      const userExists = await this.userRepository.findOneOrFail({ where: whereCondition });

      return ApplicationResponse.success(userExists != null);
    } catch (error: unknown) {
      if (error instanceof EntityNotFoundError) {
        return ApplicationResponse.success(false);
      }
      if (error instanceof Error) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "Ocurrio un error al retornar el usuario",
            ErrorCodes.DATABASE_ERROR,
            { errorName: error.name, errorMessage: error.message },
            error,
          ),
        );
      }
      return ApplicationResponse.failure(
        new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR, undefined, undefined),
      );
    }
  }
}
