// import { EntityNotFoundError } from "typeorm";
// import User, { UserStatus } from "../../../../domain/models/seg/User";
// import AuthPort from "../../../../domain/ports/data/seg/AuthPort";
// import UserPort from "../../../../domain/ports/data/seg/UserPort";
// import EmailPort from "../../../../domain/ports/utils/EmailPort";
// import RegisterRequest from "../../../dto/requests/User/RegisterRequest";
// import UpdateUserRequest from "../../../dto/requests/User/UpdateUserRequest";
// import ForgotPasswordRequest from "../../../dto/requests/User/ForgotPasswordRequest";
// import ResetPasswordRequest from "../../../dto/requests/User/ResetPasswordRequest";
// import VerifyEmailRequest from "../../../dto/requests/User/VerifyEmailRequest";
// import UserResponse from "../../../dto/responses/seg/user/UserResponse";
// import { ApplicationResponse } from "../../../shared/ApplicationReponse";
// import { ApplicationError, ErrorCodes } from "../../../shared/errors/ApplicationError";
// import LoggerPort from "../../../../domain/ports/utils/LoggerPort";
// import Email from "../../../dto/utils/Email";
// import envs from "../../../../infrastructure/config/environment-vars";
// import TokenPort from "../../../../domain/ports/utils/TokenPort";
// import RolePort from "../../../../domain/ports/data/seg/RolePort";
// import { findRegex, userFindRegex } from "../../../shared/utils/regexIndex";
// import NotFoundResponse from "../../../shared/responses/NotFoundResponse";
// import UserBasicDataResponse from "../../../dto/responses/seg/user/UserBasicDataResponse";
// import UserRolePort from "../../../../domain/ports/data/seg/UserRolePort";
// import { UserSearchRow } from "../../../dto/responses/seg/user/UserSearchRow";
// import PaginationRequest from "../../../dto/utils/PaginationRequest";
// import UserSearchParamsRequest from "../../../dto/requests/User/UserSearchParamsRequest";
// import PaginationResponse from "../../../dto/utils/PaginationResponse";
// import UserCommandPort from "../../../../domain/ports/data/seg/command/UserCommandPort";
// import UserQueryPort from "../../../../domain/ports/data/seg/query/UserQueryPort";
// import UserPublicProfileQueryPort from "../../../../domain/ports/data/seg/query/UserPublicProfileQueryPort";

// export default class UserService {
//   private userPort: any;
//   private authPort: AuthPort;
//   private emailPort: EmailPort;
//   private loggerPort: LoggerPort;
//   private readonly _paginationMaxLimit: number = 150;

//   constructor(
//     private readonly userCommandPort: UserCommandPort,
//     private readonly userQueryPort: UserQueryPort,
//     private readonly userPublicProfileQueryPort: UserPublicProfileQueryPort,
//     authPort: AuthPort,
//     emailPort: EmailPort,
//     logger: LoggerPort,
//     private tokenPort: TokenPort,
//     private rolePort: RolePort,
//     private userRolePort: UserRolePort,
//   ) {
//     this.authPort = authPort;
//     this.emailPort = emailPort;
//     this.loggerPort = logger;
//   }

//   async searchUsers(
//     req: PaginationRequest<UserSearchParamsRequest>,
//   ): Promise<ApplicationResponse<PaginationResponse<UserSearchRow>>> {
//     try {
//       const resp = await this.userPort.searchUsers(
//         PaginationRequest.create<UserSearchParamsRequest>(
//           {
//             email: req.filters?.email ?? "",
//             full_name: req.filters?.full_name ?? "",
//             username: req.filters?.username ?? "",
//           },
//           Math.min(req.page_size, this._paginationMaxLimit),
//           req.general_filter,
//           req.page_number,
//           req.first_id,
//           req.last_id,
//         ),
//       );
//       if (!resp.success) return resp;

//       const users = resp;

//       return ApplicationResponse.success(
//         PaginationResponse.create(users, resp.data!.page_size, resp.data!.total_rows),
//       );
//     } catch (error: unknown) {
//       if (error instanceof ApplicationResponse) return error;
//       if (error instanceof Error) {
//         this.loggerPort.error("Error en searchUsers", [error.name, error.message, error]);
//         return ApplicationResponse.failure(
//           new ApplicationError(
//             "Error interno en búsqueda de usuarios",
//             ErrorCodes.SERVER_ERROR,
//             [error.name, error.message],
//             error,
//           ),
//         );
//       }
//       return ApplicationResponse.failure(
//         new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR),
//       );
//     }
//   }

//   async registerUser(user: RegisterRequest): Promise<ApplicationResponse<number>> {
//     if (!user) {
//       return ApplicationResponse.failure(
//         new ApplicationError("Datos de usuario inválidos", ErrorCodes.VALIDATION_ERROR),
//       );
//     }
//     try {
//       const existUserResponse = await this.userQueryPort.existsActiveUserByFilters({
//         username: user.username,
//         email: user.email,
//         includeFilters: false,
//       });
//       Object.freeze(user);

//       if (existUserResponse.isSuccess && existUserResponse.getValue()) {
//         return ApplicationResponse.failure(
//           new ApplicationError("Ya existe el usuario", ErrorCodes.USER_ALREADY_EXISTS),
//         );
//       }
//       // Verificar que el rol por defecto exista antes de crear el usuario
//       const defaultRoleName = "common_user";
//       const defaultRole = await this.rolePort.findByName(defaultRoleName);
//       if (!defaultRole) {
//         return ApplicationResponse.failure(
//           new ApplicationError(
//             `Rol por defecto '${defaultRoleName}' no configurado`,
//             ErrorCodes.VALUE_NOT_FOUND,
//           ),
//         );
//       }

//       const hashPassword = await this.authPort.encryptPassword(user.password);
//       const securityStamp: string = this.tokenPort.generateStamp();
//       const concurrencyStamp: string = this.tokenPort.generateStamp();

//       const userDomain: Omit<User, "id" | "updated_at"> = {
//         status: UserStatus.SUSPENDED,
//         createdAt: new Date(Date.now()),
//         fullName: user.fullName,
//         email: user.email,
//         username: user.username,
//         password: hashPassword,
//         profileImage: user.profileImage,
//         learningPoints: 0,
//         favoriteInstrument: user.favoriteInstrument,
//         concurrencyStamp: concurrencyStamp,
//         securityStamp: securityStamp,
//         normalizedEmail: user.email.toUpperCase(),
//         normalizedUsername: user.username.toUpperCase(),
//       };

//       const response = await this.userCommandPort.createUser(userDomain);

//       if (response.isSuccess) {
//         // Asignar rol por defecto
//         const userId = response.value!;
//         try {
//           this.userRolePort
//             .assignRoleToUser(userId, defaultRole.id)
//             .then(() => this.loggerPort.debug("Se le asigno el rol al usuario por defecto"));
//         } catch (e) {
//           this.loggerPort.error("Fallo asignando rol por defecto al usuario", [
//             (e as any)?.message,
//           ]);
//           return ApplicationResponse.failure(
//             new ApplicationError(
//               "Error al asignar rol por defecto",
//               ErrorCodes.SERVER_ERROR,
//               undefined,
//               e instanceof Error ? e : undefined,
//             ),
//           );
//         }
//         let welcomeEmail: Email = {
//           to: [user.email],
//           from: envs.EMAIL_FROM,
//           subject: `Bienvenido ${user.fullName}`,
//         };

//         const verificationToken = this.tokenPort.generateConfirmAccountToken(
//           securityStamp,
//           concurrencyStamp,
//         );

//         welcomeEmail.text = `Bienvenido a HarmonyMusical, entra a este link para activar tu cuenta ${envs.FRONTEND_URL}/verify-email?token=${verificationToken}`;

//         this.emailPort
//           .sendEmail(welcomeEmail)
//           .then(() => {
//             this.loggerPort.info(`Correo enviado a ${user.email}`);
//           })
//           .catch((err) => {
//             this.loggerPort.error("Fallo enviando el correo", err);
//           });
//       }
//       return ApplicationResponse.success(response.getValue());
//     } catch (error: unknown) {
//       if (error instanceof ApplicationResponse) {
//         switch (error.error?.code) {
//           case ErrorCodes.DATABASE_ERROR:
//             return error;
//         }
//       }
//       if (error instanceof Error) {
//         this.loggerPort.error("Ocurrio un error en un registro", error);
//         return ApplicationResponse.failure(
//           new ApplicationError(
//             "Ocurrio un error inesperado en el registro, vuelva a intentarlo mas tarde",
//             ErrorCodes.SERVER_ERROR,
//             [error.name, error.message],
//             error,
//           ),
//         );
//       }
//       this.loggerPort.fatal("Ocurrio un error completamente desconocido");
//       return ApplicationResponse.failure(
//         new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR, undefined, undefined),
//       );
//     }
//   }

//   async deleteUser(id: number): Promise<ApplicationResponse> {
//     try {
//       const existsUserByIdResponse = await this.userPort.existsUserById(id);
//       if (existsUserByIdResponse.data && existsUserByIdResponse.success) {
//         return await this.userPort.deleteUser(id);
//       }
//       if (!existsUserByIdResponse.success) {
//       }
//       return new NotFoundResponse({ entity: "Usuario" });
//     } catch (error: unknown) {
//       if (error instanceof EntityNotFoundError) {
//         this.loggerPort.info("Se intento eliminar un usuario que no existe", error);
//         return ApplicationResponse.failure(
//           new ApplicationError(
//             error.message,
//             ErrorCodes.VALUE_NOT_FOUND,
//             [error.name, error.message],
//             error,
//           ),
//         );
//       }
//       if (error instanceof ApplicationResponse) {
//         if (error.error?.code != ErrorCodes.VALUE_NOT_FOUND) {
//           this.loggerPort.appError(error);
//         }
//         return error;
//       }
//       if (error instanceof Error) {
//         this.loggerPort.error(error.message, [error.name, error.message, error]);
//         return ApplicationResponse.failure(
//           new ApplicationError(
//             "Ocurrio un error inesperado",
//             ErrorCodes.SERVER_ERROR,
//             [error.name, error.message],
//             error,
//           ),
//         );
//       }
//       return ApplicationResponse.failure(
//         new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR, undefined, undefined),
//       );
//     }
//   }

//   async getUserData(id: number): Promise<ApplicationResponse<UserBasicDataResponse>> {
//     try {
//       const existsUser = await this.userPort.existsUserById(id);
//       if (!existsUser) {
//         return new NotFoundResponse<UserBasicDataResponse>({ message: "El usuario no existe" });
//       }

//       const response = await this.userPort.getUserBasicDataById(id);

//       if (response.error?.code == ErrorCodes.DATABASE_ERROR) {
//         this.loggerPort.appError(response);
//       }
//       return response;
//     } catch (error) {
//       this.loggerPort.fatal!(`Ocurrio un error al traer la data del usuario ${id}`, error);
//       throw error;
//     }
//   }

//   async getAllUsers(): Promise<ApplicationResponse<UserResponse[]>> {
//     try {
//       // Obtener ids de usuarios con rol common_user
//       const userIds = await this.userRolePort.listUsersForRole("common_user");
//       if (!userIds.length) return ApplicationResponse.success([]);
//       const usersResponse = await this.userQueryPort.searchActiveUsersByIds(userIds);
//       if (!usersResponse.isSuccess) return usersResponse as any;
//       const users = usersResponse.getValue() || [];
//       const responses: UserResponse[] = users.map((u) => ({
//         id: u.id,
//         full_name: u.fullName,
//         email: u.email,
//         username: u.username,
//         profile_image: u.profileImage,
//         learning_points: u.learningPoints,
//         status: u.status,
//         favorite_instrument: u.favoriteInstrument,
//         created_at: u.createdAt,
//         updated_at: u.updatedAt,
//       }));
//       return ApplicationResponse.success(responses);
//     } catch (error: unknown) {
//       if (error instanceof ApplicationResponse) {
//         return error;
//       }
//       if (error instanceof Error) {
//         this.loggerPort.error("Error al obtener usuarios", [error.name, error.message, error]);
//         return ApplicationResponse.failure(
//           new ApplicationError(
//             "Ocurrio un error al obtener los usuarios",
//             ErrorCodes.SERVER_ERROR,
//             [error.name, error.message],
//             error,
//           ),
//         );
//       }
//       return ApplicationResponse.failure(
//         new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR),
//       );
//     }
//   }

//   async getUserById(id: number): Promise<ApplicationResponse<UserResponse>> {
//     try {
//       if (!id || id <= 0) {
//         return ApplicationResponse.failure(
//           new ApplicationError("ID de usuario inválido", ErrorCodes.VALIDATION_ERROR),
//         );
//       }

//       const userResponse = await this.userPort.getUserById(id);

//       if (!userResponse.success) {
//         return userResponse;
//       }

//       if (!userResponse.data) {
//         return ApplicationResponse.failure(
//           new ApplicationError("Usuario no encontrado", ErrorCodes.VALUE_NOT_FOUND),
//         );
//       }

//       const user = userResponse.data;
//       const userResponseDto: UserResponse = {
//         id: user.id,
//         fullName: user.full_name,
//         email: user.email,
//         username: user.username,
//         profileImage: user.profile_image,
//         learningPoints: user.learning_points,
//         status: user.status,
//         favoriteInstrument: user.favorite_instrument,
//         createdAt: user.created_at,
//         updatedAt: user.updated_at,
//       };

//       return ApplicationResponse.success(userResponseDto);
//     } catch (error: unknown) {
//       if (error instanceof ApplicationResponse) {
//         return error;
//       }
//       if (error instanceof Error) {
//         this.loggerPort.error("Error al obtener usuario por ID", [
//           error.name,
//           error.message,
//           error,
//         ]);
//         return ApplicationResponse.failure(
//           new ApplicationError(
//             "Ocurrio un error al obtener el usuario",
//             ErrorCodes.SERVER_ERROR,
//             [error.name, error.message],
//             error,
//           ),
//         );
//       }
//       return ApplicationResponse.failure(
//         new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR),
//       );
//     }
//   }

//   async getUserByEmail(email: string): Promise<ApplicationResponse<UserResponse>> {
//     try {
//       if (!email || !userFindRegex("emailRegex").test(email)) {
//         return ApplicationResponse.failure(
//           new ApplicationError("Email inválido", ErrorCodes.VALIDATION_ERROR),
//         );
//       }

//       const userResponse = await this.userPort.getUserByEmail(email);

//       if (!userResponse.success) {
//         return userResponse;
//       }

//       if (!userResponse.data) {
//         return ApplicationResponse.failure(
//           new ApplicationError("Usuario no encontrado", ErrorCodes.VALUE_NOT_FOUND),
//         );
//       }

//       const user = userResponse.data;
//       const userResponseDto: UserResponse = {
//         id: user.id,
//         fullName: user.full_name,
//         email: user.email,
//         username: user.username,
//         profileImage: user.profile_image,
//         learningPoints: user.learning_points,
//         status: user.status,
//         favoriteInstrument: user.favorite_instrument,
//         createdAt: user.created_at,
//         updatedAt: user.updated_at,
//       };

//       return ApplicationResponse.success(userResponseDto);
//     } catch (error: unknown) {
//       if (error instanceof ApplicationResponse) {
//         return error;
//       }
//       if (error instanceof Error) {
//         this.loggerPort.error("Error al obtener usuario por email", [
//           error.name,
//           error.message,
//           error,
//         ]);
//         return ApplicationResponse.failure(
//           new ApplicationError(
//             "Ocurrio un error al obtener el usuario",
//             ErrorCodes.SERVER_ERROR,
//             [error.name, error.message],
//             error,
//           ),
//         );
//       }
//       return ApplicationResponse.failure(
//         new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR),
//       );
//     }
//   }

//   async updateUser(id: number, updateRequest: UpdateUserRequest): Promise<ApplicationResponse> {
//     try {
//       if (!id || id <= 0) {
//         return ApplicationResponse.failure(
//           new ApplicationError("ID de usuario inválido", ErrorCodes.VALIDATION_ERROR),
//         );
//       }

//       if (!updateRequest) {
//         return ApplicationResponse.failure(
//           new ApplicationError("Datos de actualización requeridos", ErrorCodes.VALIDATION_ERROR),
//         );
//       }

//       // Verificar que el usuario existe
//       const existsResponse = await this.userPort.existsUserById(id);
//       if (!existsResponse.success || !existsResponse.data) {
//         return ApplicationResponse.failure(
//           new ApplicationError("Usuario no encontrado", ErrorCodes.VALUE_NOT_FOUND),
//         );
//       }

//       let errors: Array<[string, string]> = [];

//       // Validaciones
//       if (updateRequest.username && !userFindRegex("usernameRegex").test(updateRequest.username)) {
//         errors.push(["username", "El username no esta en el formato correcto"]);
//       }

//       if (updateRequest.fullName && !userFindRegex("fullNameRegex").test(updateRequest.fullName)) {
//         errors.push(["full_name", "El nombre no esta en el formato correcto"]);
//       }

//       if (updateRequest.email && !userFindRegex("emailRegex").test(updateRequest.email)) {
//         errors.push(["email", "El email no esta en el formato correcto"]);
//       }

//       if (
//         updateRequest.profileImage &&
//         !userFindRegex("profileImageRegex").test(updateRequest.profileImage)
//       ) {
//         errors.push(["profile_image", "La imagen de usuario no esta en el formato correcto"]);
//       }

//       if (
//         updateRequest.new_password &&
//         !userFindRegex("passwordRegex").test(updateRequest.new_password)
//       ) {
//         errors.push(["new_password", "La nueva contraseña no esta en el formato correcto"]);
//       }

//       if (errors.length > 0) {
//         return ApplicationResponse.failure(
//           new ApplicationError(
//             "Algunos de los campos no estan bien llenados",
//             ErrorCodes.VALIDATION_ERROR,
//             errors,
//           ),
//         );
//       }

//       // Verificar si el email o username ya existen en otro usuario
//       if (updateRequest.email || updateRequest.username) {
//         const existingUserResponse = await this.userPort.getUserByEmailOrUsername(
//           updateRequest.email || "",
//           updateRequest.username || "",
//         );

//         if (
//           existingUserResponse.success &&
//           existingUserResponse.data &&
//           existingUserResponse.data.id !== id
//         ) {
//           return ApplicationResponse.failure(
//             new ApplicationError(
//               "El email o username ya están en uso",
//               ErrorCodes.USER_ALREADY_EXISTS,
//             ),
//           );
//         }
//       }

//       // Preparar datos para actualización
//       const updateData: Partial<User> = {
//         updatedAt: new Date(Date.now()),
//       };

//       if (updateRequest.fullName) updateData.fullName = updateRequest.fullName.trim();
//       if (updateRequest.email) updateData.email = updateRequest.email.trim();
//       if (updateRequest.username) updateData.username = updateRequest.username.trim();
//       if (updateRequest.profileImage) updateData.profileImage = updateRequest.profileImage.trim();
//       if (updateRequest.favoriteInstrument !== undefined)
//         updateData.favoriteInstrument = updateRequest.favoriteInstrument;

//       // Si se está actualizando la contraseña
//       if (updateRequest.new_password && updateRequest.current_password) {
//         // Aquí deberías verificar la contraseña actual
//         const hashPassword = await this.authPort.encryptPassword(updateRequest.new_password);
//         updateData.password = hashPassword;

//         // Regenerar security stamp al cambiar contraseña
//         updateData.securityStamp = this.tokenPort.generateStamp();
//       }

//       const updateResponse = await this.userPort.updateUser(id, updateData);
//       return updateResponse;
//     } catch (error: unknown) {
//       if (error instanceof ApplicationResponse) {
//         return error;
//       }
//       if (error instanceof Error) {
//         this.loggerPort.error("Error al actualizar usuario", [error.name, error.message, error]);
//         return ApplicationResponse.failure(
//           new ApplicationError(
//             "Ocurrio un error al actualizar el usuario",
//             ErrorCodes.SERVER_ERROR,
//             [error.name, error.message],
//             error,
//           ),
//         );
//       }
//       return ApplicationResponse.failure(
//         new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR),
//       );
//       1;
//     }
//   }

//   async forgotPassword(request: ForgotPasswordRequest): Promise<ApplicationResponse> {
//     try {
//       if (!request || !request.email) {
//         return ApplicationResponse.failure(
//           new ApplicationError("Email requerido", ErrorCodes.VALIDATION_ERROR),
//         );
//       }

//       if (!userFindRegex("emailRegex").test(request.email)) {
//         return ApplicationResponse.failure(
//           new ApplicationError("Email inválido", ErrorCodes.VALIDATION_ERROR),
//         );
//       }

//       const userResponse = await this.userPort.getUserByEmail(request.email);

//       if (!userResponse.success || !userResponse.data) {
//         // Por seguridad, no revelamos si el email existe o no
//         return ApplicationResponse.emptySuccess();
//       }

//       const user = userResponse.data;

//       if (user.status !== UserStatus.ACTIVE) {
//         return ApplicationResponse.failure(
//           new ApplicationError("La cuenta no está activa", ErrorCodes.BUSINESS_RULE_VIOLATION),
//         );
//       }

//       // Generar token de recuperación
//       const recoveryToken = this.tokenPort.generateRecoverPasswordToken(
//         user.security_stamp,
//         user.concurrency_stamp,
//       );

//       const recoveryEmail: Email = {
//         to: [user.email],
//         from: envs.EMAIL_FROM,
//         subject: "Recuperación de contraseña - HarmonyMusical",
//         text: `Hola ${user.full_name},\n\nHas solicitado recuperar tu contraseña. Haz clic en el siguiente enlace para restablecerla:\n\n${envs.FRONTEND_URL}/reset-password?token=${recoveryToken}\n\nSi no solicitaste esto, puedes ignorar este email.\n\nSaludos,\nEquipo HarmonyMusical`,
//       };

//       await this.emailPort.sendEmail(recoveryEmail);

//       return ApplicationResponse.emptySuccess();
//     } catch (error: unknown) {
//       if (error instanceof ApplicationResponse) {
//         return error;
//       }
//       if (error instanceof Error) {
//         this.loggerPort.error("Error al procesar recuperación de contraseña", [
//           error.name,
//           error.message,
//           error,
//         ]);
//         return ApplicationResponse.failure(
//           new ApplicationError(
//             "Ocurrio un error al procesar la solicitud",
//             ErrorCodes.SERVER_ERROR,
//             [error.name, error.message],
//             error,
//           ),
//         );
//       }
//       return ApplicationResponse.failure(
//         new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR),
//       );
//     }
//   }

//   async resetPassword(request: ResetPasswordRequest): Promise<ApplicationResponse> {
//     try {
//       if (!request || !request.token || !request.newPassword) {
//         return ApplicationResponse.failure(
//           new ApplicationError("Todos los campos son requeridos", ErrorCodes.VALIDATION_ERROR),
//         );
//       }

//       if (!userFindRegex("passwordRegex").test(request.newPassword)) {
//         return ApplicationResponse.failure(
//           new ApplicationError(
//             "La nueva contraseña no cumple con los requisitos",
//             ErrorCodes.VALIDATION_ERROR,
//           ),
//         );
//       }

//       // Verificar y decodificar el token
//       const tokenData = this.tokenPort.verifyToken(request.token);

//       if (!tokenData) {
//         return ApplicationResponse.failure(
//           new ApplicationError("Token inválido o expirado", ErrorCodes.VALIDATION_ERROR),
//         );
//       }

//       const hashPassword = await this.authPort.encryptPassword(request.newPassword);
//       const newSecurityStamp = this.tokenPort.generateStamp();
//       const newConcurrencyStamp = this.tokenPort.generateStamp();

//       return ApplicationResponse.emptySuccess();
//     } catch (error: unknown) {
//       if (error instanceof ApplicationResponse) {
//         return error;
//       }
//       if (error instanceof Error) {
//         this.loggerPort.error("Error al restablecer contraseña", [
//           error.name,
//           error.message,
//           error,
//         ]);
//         return ApplicationResponse.failure(
//           new ApplicationError(
//             "Ocurrio un error al restablecer la contraseña",
//             ErrorCodes.SERVER_ERROR,
//             [error.name, error.message],
//             error,
//           ),
//         );
//       }
//       return ApplicationResponse.failure(
//         new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR),
//       );
//     }
//   }

//   async verifyEmail(request: VerifyEmailRequest): Promise<ApplicationResponse> {
//     try {
//       if (!request || !request.token) {
//         return ApplicationResponse.failure(
//           new ApplicationError("Token requerido", ErrorCodes.VALIDATION_ERROR),
//         );
//       }

//       // Verificar el token
//       const tokenData = this.tokenPort.verifyToken(request.token);

//       if (!tokenData) {
//         return ApplicationResponse.failure(
//           new ApplicationError("Token inválido o expirado", ErrorCodes.VALIDATION_ERROR),
//         );
//       }
//       const user = await this.userPort.getUserByEmail(request.email.toUpperCase());
//       if (!user.success || !user.data) {
//         return ApplicationResponse.failure(
//           new ApplicationError("No se encontro el usuario", ErrorCodes.INVALID_EMAIL),
//         );
//       }
//       // Activar cuenta
//       const updateData: Partial<User> = {
//         status: UserStatus.ACTIVE,
//         updatedAt: new Date(Date.now()),
//         concurrencyStamp: this.tokenPort.generateStamp(),
//         securityStamp: this.tokenPort.generateStamp(),
//       };

//       await this.userPort.updateUser(user.data!.id, updateData);

//       return ApplicationResponse.emptySuccess();
//     } catch (error: unknown) {
//       if (error instanceof ApplicationResponse) {
//         return error;
//       }
//       if (error instanceof Error) {
//         this.loggerPort.error("Error al verificar email", [error.name, error.message, error]);
//         return ApplicationResponse.failure(
//           new ApplicationError(
//             "Ocurrio un error al verificar el email",
//             ErrorCodes.SERVER_ERROR,
//             [error.name, error.message],
//             error,
//           ),
//         );
//       }
//       return ApplicationResponse.failure(
//         new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR),
//       );
//     }
//   }
// }

// Temporary minimal export to fix build errors
export default class UserService {
  constructor(...args: any[]) {
    // TODO: Uncomment and implement the full UserService above
  }
  
  async registerUser(request: any): Promise<any> {
    // TODO: Implement this method when uncommenting the full service
    throw new Error("Method not implemented - UserService is commented out");
  }
}
