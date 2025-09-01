import { EntityNotFoundError } from "typeorm";
import User, { UserStatus } from "../../domain/models/User";
import AuthPort from "../../domain/ports/data/AuthPort";
import UserPort from "../../domain/ports/data/UserPort";
import EmailPort from "../../domain/ports/extras/EmailPort";
import RegisterRequest from "../dto/requests/RegisterRequest";
import { ApplicationResponse } from "../shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../shared/errors/ApplicationError";
import LoggerPort from "../../domain/ports/extras/LoggerPort";

export default class UserService {
  private userPort: UserPort;
  private authPort: AuthPort;
  private emailPort: EmailPort;
  private loggerPort: LoggerPort;
  private usernameRegex: RegExp = /^[a-zA-Z0-9_*\-#$!|°.+]{2,50}$/;
  private fullNameRegex: RegExp = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)?$/;
  private passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])(.){8,}$/;
  private emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private profileImage: RegExp = /^(https?|ftp|http):\/\/[^\s/$.?#].[^\s]*$/;

  constructor(userPort: UserPort, authPort: AuthPort, emailPort: EmailPort, logger: LoggerPort) {
    this.userPort = userPort;
    this.authPort = authPort;
    this.emailPort = emailPort;
    this.loggerPort = logger;
  }

  async registerUser(user: RegisterRequest): Promise<ApplicationResponse<number>> {
    if (!user) {
      return ApplicationResponse.failure(
        new ApplicationError("Datos de usuario inválidos", ErrorCodes.VALIDATION_ERROR),
      );
    }
    try {
      const existUserResponse = await this.userPort.existsUserByEmailOrUsername(
        user.email,
        user.username,
      );
      Object.freeze(user);

      if (existUserResponse.success && existUserResponse.data) {
        return ApplicationResponse.failure(
          new ApplicationError("Ya existe el usuario", ErrorCodes.USER_ALREADY_EXISTS),
        );
      }

      let errors: Array<[string, string]> = [];
      if (!this.usernameRegex.test(user.username)) {
        errors.push(["username", "El username no esta en el formato correcto"]);
      }
      console.log(user.full_name);
      if (!this.fullNameRegex.test(user.full_name)) {
        errors.push(["full name", "El nombre no esta en el formato correcto"]);
      }
      if (!this.passwordRegex.test(user.password)) {
        errors.push(["password", "La contraseña no esta en el formato correcto"]);
      }
      if (!this.emailRegex.test(user.email)) {
        errors.push(["email", "El email no esta en el formato correcto"]);
      }
      if (!this.profileImage.test(user.profile_image)) {
        errors.push(["image", "La imagen de usuaruio no esta en el fomrato correcto"]);
      }

      if (errors.length > 0) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "Algunos de los campos no estan bien llenados",
            ErrorCodes.VALIDATION_ERROR,
            errors,
          ),
        );
      }

      const hashPassword = await this.authPort.encryptPassword(user.password);

      const userDomain: Omit<User, "id"> = {
        status: UserStatus.SUSPENDED,
        created_at: new Date(Date.now()),
        full_name: user.full_name,
        email: user.email,
        username: user.username,
        password: hashPassword,
        profile_image: user.profile_image,
        learning_points: 0,
        favorite_instrument: user.favorite_instrument,
        is_artist: user.is_artist,
      };
      return await this.userPort.createUser(userDomain);
    } catch (error: unknown) {
      if (error instanceof ApplicationResponse) {
        switch (error.error?.code) {
          case ErrorCodes.VALUE_NOT_FOUND:
            return ApplicationResponse.failure(
              new ApplicationError("No se encontro el usuario", ErrorCodes.VALUE_NOT_FOUND),
            );
          case ErrorCodes.DATABASE_ERROR:
            return error;
        }
      }
      if (error instanceof Error) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "Ocurrio un error inesperado en el registro",
            ErrorCodes.SERVER_ERROR,
            [error.name, error.message],
            error,
          ),
        );
      }
      return ApplicationResponse.failure(
        new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR, undefined, undefined),
      );
    }
  }

  async deleteUser(id: number): Promise<ApplicationResponse> {
    try {
      if (await this.userPort.existsUserById(id)) {
        return await this.userPort.deleteUser(id);
      }
      return ApplicationResponse.failure(
        new ApplicationError("El usuario no se encontro", ErrorCodes.VALUE_NOT_FOUND),
      );
    } catch (error: unknown) {
      if (error instanceof EntityNotFoundError) {
        this.loggerPort.info("Se intento eliminar un usuario que no existe", error);
        return ApplicationResponse.failure(
          new ApplicationError(
            error.message,
            ErrorCodes.VALUE_NOT_FOUND,
            [error.name, error.message],
            error,
          ),
        );
      }
      if (error instanceof ApplicationResponse) {
        if (error.error?.code != ErrorCodes.VALUE_NOT_FOUND) {
          this.loggerPort.appError(error);
        }
        return error;
      }
      if (error instanceof Error) {
        this.loggerPort.error(error.message, [error.name, error.message, error]);
        return ApplicationResponse.failure(
          new ApplicationError(
            "Ocurrio un error inesperado",
            ErrorCodes.SERVER_ERROR,
            [error.name, error.message],
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
