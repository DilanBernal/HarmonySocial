// import UserPort from "../../domain/ports/data/seg/UserPort";
// import AuthPort from "../../domain/ports/data/seg/AuthPort";
// import EmailPort from "../../domain/ports/utils/EmailPort";
// import LoggerPort from "../../domain/ports/utils/LoggerPort";
// import TokenPort from "../../domain/ports/utils/TokenPort";
// import RolePort from "../../domain/ports/data/seg/RolePort";
// import UserRolePort from "../../domain/ports/data/seg/UserRolePort";
// import RegisterRequest from "../dto/requests/User/RegisterRequest";
// import { ApplicationResponse } from "../shared/ApplicationReponse";
// import { ApplicationError, ErrorCodes } from "../shared/errors/ApplicationError";
// import Email from "../dto/utils/Email";
// import envs from "../../infrastructure/config/environment-vars";
// import PaginationRequest from "../dto/utils/PaginationRequest";
// import UserSearchParamsRequest from "../dto/requests/User/UserSearchParamsRequest";
// import PaginationResponse from "../dto/utils/PaginationResponse";
// import { UserSearchRow } from "../dto/responses/seg/user/UserSearchRow";
// import User, { UserStatus } from "../../domain/models/seg/User";

// // Compatibility facade for legacy tests. Runtime code uses split services.
// export default class UserService {
//   constructor(
//     private readonly userPort: UserPort,
//     private readonly authPort: AuthPort,
//     private readonly emailPort: EmailPort,
//     private readonly logger: LoggerPort,
//     private readonly tokenPort: TokenPort,
//     private readonly rolePort: RolePort,
//     private readonly userRolePort: UserRolePort,
//   ) { }

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
//           req.page_size,
//           req.general_filter,
//           req.page_number,
//           req.first_id,
//           req.last_id,
//         ),
//       );
//       if (!resp.success) return resp as any;
//       const rows = (resp.data?.rows ?? []).map<UserSearchRow>((u: any) => ({
//         id: u.id,
//         username: u.username,
//         full_name: u.full_name ?? "",
//         email: u.email,
//         profile_image: u.profile_image ?? null,
//       }));
//       return ApplicationResponse.success(
//         PaginationResponse.create(rows, rows.length, resp.data!.total_rows),
//       );
//     } catch (e: any) {
//       this.logger.error("Error en searchUsers", [e?.message]);
//       return ApplicationResponse.failure(
//         new ApplicationError("Error interno en búsqueda de usuarios", ErrorCodes.SERVER_ERROR),
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
//       const existUserResponse = await this.userPort.existsUserByEmailOrUsername(
//         user.email,
//         user.username,
//       );
//       if (existUserResponse.success && existUserResponse.data) {
//         return ApplicationResponse.failure(
//           new ApplicationError("Ya existe el usuario", ErrorCodes.USER_ALREADY_EXISTS),
//         );
//       }
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
//         created_at: new Date(Date.now()),
//         full_name: user.full_name,
//         email: user.email,
//         username: user.username,
//         password: hashPassword,
//         profile_image: user.profile_image,
//         learning_points: 0,
//         favorite_instrument: user.favorite_instrument,
//         concurrency_stamp: concurrencyStamp,
//         security_stamp: securityStamp,
//         normalized_email: user.email.toUpperCase(),
//         normalized_username: user.username.toUpperCase(),
//       } as any;
//       const response = await this.userPort.createUser(userDomain);
//       if (!response.success) return response as any;
//       const userId = response.data!;
//       await this.userRolePort.assignRoleToUser(userId, defaultRole.id);
//       const verificationToken = this.tokenPort.generateConfirmAccountToken(
//         securityStamp,
//         concurrencyStamp,
//       );
//       const welcomeEmail: Email = {
//         to: [user.email],
//         from: envs.EMAIL_FROM,
//         subject: `Bienvenido ${user.full_name}`,
//         text: `Bienvenido a HarmonyMusical, entra a este link para activar tu cuenta ${envs.FRONTEND_URL}/verify-email?token=${verificationToken}`,
//       };
//       await this.emailPort.sendEmail(welcomeEmail);
//       return ApplicationResponse.success(userId);
//     } catch (error: any) {
//       this.logger.error("Error en registro", [error?.message]);
//       return ApplicationResponse.failure(
//         new ApplicationError(
//           "Ocurrió un error inesperado en el registro",
//           ErrorCodes.SERVER_ERROR,
//           error?.message,
//           error,
//         ),
//       );
//     }
//   }
// }
