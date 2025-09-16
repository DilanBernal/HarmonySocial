import { EntityNotFoundError } from "typeorm";
import User, { UserStatus } from "../../domain/models/User";
import AuthPort from "../../domain/ports/data/AuthPort";
import UserPort from "../../domain/ports/data/UserPort";
import EmailPort from "../../domain/ports/utils/EmailPort";
import RegisterRequest from "../dto/requests/User/RegisterRequest";
import UpdateUserRequest from "../dto/requests/User/UpdateUserRequest";
import ForgotPasswordRequest from "../dto/requests/User/ForgotPasswordRequest";
import ResetPasswordRequest from "../dto/requests/User/ResetPasswordRequest";
import VerifyEmailRequest from "../dto/requests/User/VerifyEmailRequest";
import UserResponse from "../dto/responses/UserResponse";
import { ApplicationResponse } from "../shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../shared/errors/ApplicationError";
import LoggerPort from "../../domain/ports/utils/LoggerPort";
import Email from "../dto/utils/Email";
import envs from "../../infrastructure/config/environment-vars";
import TokenPort from "../../domain/ports/utils/TokenPort";
import { findRegex } from "../shared/utils/regex";
import NotFoundResponse from "../shared/responses/NotFoundResponse";
import UserBasicDataResponse from "../dto/responses/UserBasicDataResponse";

export default class UserService {
  private userPort: UserPort;
  private authPort: AuthPort;
  private emailPort: EmailPort;
  private loggerPort: LoggerPort;

  constructor(
    userPort: UserPort,
    authPort: AuthPort,
    emailPort: EmailPort,
    logger: LoggerPort,
    private tokenPort: TokenPort,
  ) {
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
      const hashPassword = await this.authPort.encryptPassword(user.password);
      const securityStamp: string = await this.tokenPort.generateStamp();
      const concurrencyStamp: string = await this.tokenPort.generateStamp();

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
        concurrency_stamp: concurrencyStamp,
        security_stamp: securityStamp,
        normalized_email: user.email.toUpperCase(),
        normalized_username: user.username.toUpperCase(),
      };

      const response = await this.userPort.createUser(userDomain);

      if (response.success) {
        let welcomeEmail: Email = {
          to: [user.email],
          from: envs.EMAIL_FROM,
          subject: `Bienvenido ${user.full_name}`,
        };

        const verificationToken = this.tokenPort.generateConfirmAccountToken(
          securityStamp,
          concurrencyStamp,
        );
        welcomeEmail.text = `Bienvenido a HarmonyMusical, entra a este link para activar tu cuenta ${envs.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        await this.emailPort.sendEmail(welcomeEmail);
      }
      return response;
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
      const existsUserByIdResponse = await this.userPort.existsUserById(id);
      if (existsUserByIdResponse.data && existsUserByIdResponse.success) {
        return await this.userPort.deleteUser(id);
      }
      if (!existsUserByIdResponse.success) {
      }
      return new NotFoundResponse({ entity: "Usuario" });
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

  async getUserData(id: number): Promise<ApplicationResponse<UserBasicDataResponse>> {
    try {
      const existsUser = await this.userPort.existsUserById(id);
      if (!existsUser) {
        return new NotFoundResponse<UserBasicDataResponse>({ message: "El usuario no existe" });
      }

      const response = await this.userPort.getUserBasicDataById(id);

      if (response.error?.code == ErrorCodes.DATABASE_ERROR) {
        this.loggerPort.appError(response);
      }
      return response;
    } catch (error) {
      this.loggerPort.fatal!(`Ocurrio un error al traer la data del usuario ${id}`, error);
      throw error;
    }
  }

  async getAllUsers(): Promise<ApplicationResponse<UserResponse[]>> {
    try {
      const usersResponse = await this.userPort.getAllUsers();

      if (!usersResponse.success) {
        return usersResponse;
      }

      const users = usersResponse.data || [];
      const userResponses: UserResponse[] = users.map((user) => ({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        username: user.username,
        profile_image: user.profile_image,
        learning_points: user.learning_points,
        status: user.status,
        favorite_instrument: user.favorite_instrument,
        is_artist: user.is_artist,
        created_at: user.created_at,
        updated_at: user.updated_at,
      }));

      return ApplicationResponse.success(userResponses);
    } catch (error: unknown) {
      if (error instanceof ApplicationResponse) {
        return error;
      }
      if (error instanceof Error) {
        this.loggerPort.error("Error al obtener usuarios", [error.name, error.message, error]);
        return ApplicationResponse.failure(
          new ApplicationError(
            "Ocurrio un error al obtener los usuarios",
            ErrorCodes.SERVER_ERROR,
            [error.name, error.message],
            error,
          ),
        );
      }
      return ApplicationResponse.failure(
        new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR),
      );
    }
  }

  async getUserById(id: number): Promise<ApplicationResponse<UserResponse>> {
    try {
      if (!id || id <= 0) {
        return ApplicationResponse.failure(
          new ApplicationError("ID de usuario inválido", ErrorCodes.VALIDATION_ERROR),
        );
      }

      const userResponse = await this.userPort.getUserById(id);

      if (!userResponse.success) {
        return userResponse;
      }

      if (!userResponse.data) {
        return ApplicationResponse.failure(
          new ApplicationError("Usuario no encontrado", ErrorCodes.VALUE_NOT_FOUND),
        );
      }

      const user = userResponse.data;
      const userResponseDto: UserResponse = {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        username: user.username,
        profile_image: user.profile_image,
        learning_points: user.learning_points,
        status: user.status,
        favorite_instrument: user.favorite_instrument,
        is_artist: user.is_artist,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      return ApplicationResponse.success(userResponseDto);
    } catch (error: unknown) {
      if (error instanceof ApplicationResponse) {
        return error;
      }
      if (error instanceof Error) {
        this.loggerPort.error("Error al obtener usuario por ID", [
          error.name,
          error.message,
          error,
        ]);
        return ApplicationResponse.failure(
          new ApplicationError(
            "Ocurrio un error al obtener el usuario",
            ErrorCodes.SERVER_ERROR,
            [error.name, error.message],
            error,
          ),
        );
      }
      return ApplicationResponse.failure(
        new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR),
      );
    }
  }

  async getUserByEmail(email: string): Promise<ApplicationResponse<UserResponse>> {
    try {
      if (!email || !findRegex("emailRegex").test(email)) {
        return ApplicationResponse.failure(
          new ApplicationError("Email inválido", ErrorCodes.VALIDATION_ERROR),
        );
      }

      const userResponse = await this.userPort.getUserByEmail(email);

      if (!userResponse.success) {
        return userResponse;
      }

      if (!userResponse.data) {
        return ApplicationResponse.failure(
          new ApplicationError("Usuario no encontrado", ErrorCodes.VALUE_NOT_FOUND),
        );
      }

      const user = userResponse.data;
      const userResponseDto: UserResponse = {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        username: user.username,
        profile_image: user.profile_image,
        learning_points: user.learning_points,
        status: user.status,
        favorite_instrument: user.favorite_instrument,
        is_artist: user.is_artist,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      return ApplicationResponse.success(userResponseDto);
    } catch (error: unknown) {
      if (error instanceof ApplicationResponse) {
        return error;
      }
      if (error instanceof Error) {
        this.loggerPort.error("Error al obtener usuario por email", [
          error.name,
          error.message,
          error,
        ]);
        return ApplicationResponse.failure(
          new ApplicationError(
            "Ocurrio un error al obtener el usuario",
            ErrorCodes.SERVER_ERROR,
            [error.name, error.message],
            error,
          ),
        );
      }
      return ApplicationResponse.failure(
        new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR),
      );
    }
  }

  async updateUser(id: number, updateRequest: UpdateUserRequest): Promise<ApplicationResponse> {
    try {
      if (!id || id <= 0) {
        return ApplicationResponse.failure(
          new ApplicationError("ID de usuario inválido", ErrorCodes.VALIDATION_ERROR),
        );
      }

      if (!updateRequest) {
        return ApplicationResponse.failure(
          new ApplicationError("Datos de actualización requeridos", ErrorCodes.VALIDATION_ERROR),
        );
      }

      // Verificar que el usuario existe
      const existsResponse = await this.userPort.existsUserById(id);
      if (!existsResponse.success || !existsResponse.data) {
        return ApplicationResponse.failure(
          new ApplicationError("Usuario no encontrado", ErrorCodes.VALUE_NOT_FOUND),
        );
      }

      let errors: Array<[string, string]> = [];

      // Validaciones
      if (updateRequest.username && !findRegex("usernameRegex").test(updateRequest.username)) {
        errors.push(["username", "El username no esta en el formato correcto"]);
      }

      if (updateRequest.full_name && !findRegex("fullNameRegex").test(updateRequest.full_name)) {
        errors.push(["full_name", "El nombre no esta en el formato correcto"]);
      }

      if (updateRequest.email && !findRegex("emailRegex").test(updateRequest.email)) {
        errors.push(["email", "El email no esta en el formato correcto"]);
      }

      if (
        updateRequest.profile_image &&
        !findRegex("profileImageRegex").test(updateRequest.profile_image)
      ) {
        errors.push(["profile_image", "La imagen de usuario no esta en el formato correcto"]);
      }

      if (
        updateRequest.new_password &&
        !findRegex("passwordRegex").test(updateRequest.new_password)
      ) {
        errors.push(["new_password", "La nueva contraseña no esta en el formato correcto"]);
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

      // Verificar si el email o username ya existen en otro usuario
      if (updateRequest.email || updateRequest.username) {
        const existingUserResponse = await this.userPort.getUserByEmailOrUsername(
          updateRequest.email || "",
          updateRequest.username || "",
        );

        if (
          existingUserResponse.success &&
          existingUserResponse.data &&
          existingUserResponse.data.id !== id
        ) {
          return ApplicationResponse.failure(
            new ApplicationError(
              "El email o username ya están en uso",
              ErrorCodes.USER_ALREADY_EXISTS,
            ),
          );
        }
      }

      // Preparar datos para actualización
      const updateData: Partial<User> = {
        updated_at: new Date(Date.now()),
      };

      if (updateRequest.full_name) updateData.full_name = updateRequest.full_name.trim();
      if (updateRequest.email) updateData.email = updateRequest.email.trim();
      if (updateRequest.username) updateData.username = updateRequest.username.trim();
      if (updateRequest.profile_image)
        updateData.profile_image = updateRequest.profile_image.trim();
      if (updateRequest.favorite_instrument !== undefined)
        updateData.favorite_instrument = updateRequest.favorite_instrument;
      if (updateRequest.is_artist !== undefined) updateData.is_artist = updateRequest.is_artist;

      // Si se está actualizando la contraseña
      if (updateRequest.new_password && updateRequest.current_password) {
        // Aquí deberías verificar la contraseña actual
        const hashPassword = await this.authPort.encryptPassword(updateRequest.new_password);
        updateData.password = hashPassword;

        // Regenerar security stamp al cambiar contraseña
        updateData.security_stamp = await this.tokenPort.generateStamp();
      }

      const updateResponse = await this.userPort.updateUser(id, updateData);
      return updateResponse;
    } catch (error: unknown) {
      if (error instanceof ApplicationResponse) {
        return error;
      }
      if (error instanceof Error) {
        this.loggerPort.error("Error al actualizar usuario", [error.name, error.message, error]);
        return ApplicationResponse.failure(
          new ApplicationError(
            "Ocurrio un error al actualizar el usuario",
            ErrorCodes.SERVER_ERROR,
            [error.name, error.message],
            error,
          ),
        );
      }
      return ApplicationResponse.failure(
        new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR),
      );
      1;
    }
  }

  async forgotPassword(request: ForgotPasswordRequest): Promise<ApplicationResponse> {
    try {
      if (!request || !request.email) {
        return ApplicationResponse.failure(
          new ApplicationError("Email requerido", ErrorCodes.VALIDATION_ERROR),
        );
      }

      if (!findRegex("emailRegex").test(request.email)) {
        return ApplicationResponse.failure(
          new ApplicationError("Email inválido", ErrorCodes.VALIDATION_ERROR),
        );
      }

      const userResponse = await this.userPort.getUserByEmail(request.email);

      if (!userResponse.success || !userResponse.data) {
        // Por seguridad, no revelamos si el email existe o no
        return ApplicationResponse.emptySuccess();
      }

      const user = userResponse.data;

      if (user.status !== UserStatus.ACTIVE) {
        return ApplicationResponse.failure(
          new ApplicationError("La cuenta no está activa", ErrorCodes.BUSINESS_RULE_VIOLATION),
        );
      }

      // Generar token de recuperación
      const recoveryToken = this.tokenPort.generateRecoverPasswordToken(
        user.security_stamp,
        user.concurrency_stamp,
      );

      // Enviar email de recuperación
      const recoveryEmail: Email = {
        to: [user.email],
        from: envs.EMAIL_FROM,
        subject: "Recuperación de contraseña - HarmonyMusical",
        text: `Hola ${user.full_name},\n\nHas solicitado recuperar tu contraseña. Haz clic en el siguiente enlace para restablecerla:\n\n${envs.FRONTEND_URL}/reset-password?token=${recoveryToken}\n\nSi no solicitaste esto, puedes ignorar este email.\n\nSaludos,\nEquipo HarmonyMusical`,
      };

      await this.emailPort.sendEmail(recoveryEmail);

      return ApplicationResponse.emptySuccess();
    } catch (error: unknown) {
      if (error instanceof ApplicationResponse) {
        return error;
      }
      if (error instanceof Error) {
        this.loggerPort.error("Error al procesar recuperación de contraseña", [
          error.name,
          error.message,
          error,
        ]);
        return ApplicationResponse.failure(
          new ApplicationError(
            "Ocurrio un error al procesar la solicitud",
            ErrorCodes.SERVER_ERROR,
            [error.name, error.message],
            error,
          ),
        );
      }
      return ApplicationResponse.failure(
        new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR),
      );
    }
  }

  async resetPassword(request: ResetPasswordRequest): Promise<ApplicationResponse> {
    try {
      if (!request || !request.token || !request.newPassword || !request.confirmPassword) {
        return ApplicationResponse.failure(
          new ApplicationError("Todos los campos son requeridos", ErrorCodes.VALIDATION_ERROR),
        );
      }

      if (request.newPassword !== request.confirmPassword) {
        return ApplicationResponse.failure(
          new ApplicationError("Las contraseñas no coinciden", ErrorCodes.VALIDATION_ERROR),
        );
      }

      if (!findRegex("passwordRegex").test(request.newPassword)) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "La nueva contraseña no cumple con los requisitos",
            ErrorCodes.VALIDATION_ERROR,
          ),
        );
      }

      // Verificar y decodificar el token
      const tokenData = this.tokenPort.verifyToken(request.token);

      if (!tokenData) {
        return ApplicationResponse.failure(
          new ApplicationError("Token inválido o expirado", ErrorCodes.VALIDATION_ERROR),
        );
      }

      // Encriptar nueva contraseña
      const hashPassword = await this.authPort.encryptPassword(request.newPassword);
      const newSecurityStamp = await this.tokenPort.generateStamp();

      // Actualizar contraseña y security stamp
      // Nota: Necesitarías implementar una búsqueda por security_stamp o pasar el user ID en el token

      return ApplicationResponse.emptySuccess();
    } catch (error: unknown) {
      if (error instanceof ApplicationResponse) {
        return error;
      }
      if (error instanceof Error) {
        this.loggerPort.error("Error al restablecer contraseña", [
          error.name,
          error.message,
          error,
        ]);
        return ApplicationResponse.failure(
          new ApplicationError(
            "Ocurrio un error al restablecer la contraseña",
            ErrorCodes.SERVER_ERROR,
            [error.name, error.message],
            error,
          ),
        );
      }
      return ApplicationResponse.failure(
        new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR),
      );
    }
  }

  async verifyEmail(request: VerifyEmailRequest): Promise<ApplicationResponse> {
    try {
      if (!request || !request.token) {
        return ApplicationResponse.failure(
          new ApplicationError("Token requerido", ErrorCodes.VALIDATION_ERROR),
        );
      }

      // Verificar el token
      const tokenData = this.tokenPort.verifyToken(request.token);

      if (!tokenData) {
        return ApplicationResponse.failure(
          new ApplicationError("Token inválido o expirado", ErrorCodes.VALIDATION_ERROR),
        );
      }
      console.log(tokenData);

      const user = await this.userPort.getUserByEmail(request.email);
      console.log(user);
      if (!user.success && user.data) {
        return ApplicationResponse.failure(
          new ApplicationError("No se encontro el usuario", ErrorCodes.INVALID_EMAIL),
        );
      }
      // Activar cuenta
      const updateData: Partial<User> = {
        status: UserStatus.ACTIVE,
        updated_at: new Date(Date.now()),
      };

      // Aquí necesitarías el ID del usuario desde el token
      await this.userPort.updateUser(user.data!.id, updateData);

      return ApplicationResponse.emptySuccess();
    } catch (error: unknown) {
      if (error instanceof ApplicationResponse) {
        return error;
      }
      if (error instanceof Error) {
        this.loggerPort.error("Error al verificar email", [error.name, error.message, error]);
        return ApplicationResponse.failure(
          new ApplicationError(
            "Ocurrio un error al verificar el email",
            ErrorCodes.SERVER_ERROR,
            [error.name, error.message],
            error,
          ),
        );
      }
      return ApplicationResponse.failure(
        new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR),
      );
    }
  }
}
