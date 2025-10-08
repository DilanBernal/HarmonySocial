import AuthPort from "../../domain/ports/data/AuthPort";
import UserPort from "../../domain/ports/data/UserPort";
import EmailPort from "../../domain/ports/utils/EmailPort";
import LoggerPort from "../../domain/ports/utils/LoggerPort";
import LoginRequest from "../dto/requests/User/LoginRequest";
import VerifyEmailRequest from "../dto/requests/User/VerifyEmailRequest";
import AuthResponse from "../dto/responses/seg/user/AuthResponse";
import { ApplicationResponse } from "../shared/ApplicationReponse";
import { ApplicationError, ErrorCodes, ErrorCode } from "../shared/errors/ApplicationError";
import TokenPort from "../../domain/ports/utils/TokenPort";
import UserRolePort from "../../domain/ports/data/UserRolePort";
import RolePermissionAdapter from "../../infrastructure/adapter/data/RolePermissionAdapter";

export default class AuthService {
  private userPort: UserPort;
  private authPort: AuthPort;
  private emailPort: EmailPort;
  private loggerPort: LoggerPort;
  private tokenPort: TokenPort;
  private userRolePort: UserRolePort;
  private rolePermissionAdapter: RolePermissionAdapter;

  constructor(
    userPort: UserPort,
    authPort: AuthPort,
    emailPort: EmailPort,
    logger: LoggerPort,
    tokenPort: TokenPort,
    userRolePort: UserRolePort,
  ) {
    this.userPort = userPort;
    this.authPort = authPort;
    this.emailPort = emailPort;
    this.loggerPort = logger;
    this.tokenPort = tokenPort;
    this.userRolePort = userRolePort;
    this.rolePermissionAdapter = new RolePermissionAdapter();
  }

  async login(requests: LoginRequest): Promise<ApplicationResponse<AuthResponse>> {
    try {
      if (!requests) {
        this.loggerPort.debug("Solicitud de login vacía");
        return ApplicationResponse.failure(
          new ApplicationError(
            "La solicitud de login no puede estar vacía",
            ErrorCodes.VALIDATION_ERROR,
          ),
        );
      }

      const userExistsResponse = await this.userPort.existsUserByLoginRequest(requests.userOrEmail);

      if (!userExistsResponse.success || !userExistsResponse.data) {
        return ApplicationResponse.failure(
          new ApplicationError("Credenciales inválidas", ErrorCodes.INVALID_CREDENTIALS),
        );
      }

      const userInfo = (
        await this.userPort.getUserStampsAndUserInfoByUserOrEmail(requests.userOrEmail)
      ).data;
      if (!userInfo) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "Error al obtener la información del usuario",
            ErrorCodes.SERVER_ERROR,
          ),
        );
      }

      if (!(await this.authPort.comparePasswords(requests.password, userInfo[4]))) {
        return ApplicationResponse.failure(
          new ApplicationError("Credenciales inválidas", ErrorCodes.INVALID_CREDENTIALS),
        );
      }

      // Obtener roles del usuario
      const userId = userInfo[2];
      let roleNames: string[] = [];
      let permissions: string[] = [];
      try {
        const roles = await this.userRolePort.listRolesForUser(userId);
        roleNames = roles.map((r) => r.name);
        if (roleNames.length) {
          const permsResp = await this.rolePermissionAdapter.getPermissionsByRoleNames(roleNames);
          if (permsResp.success && permsResp.data) {
            permissions = permsResp.data.map((p) => p.name);
          }
        }
      } catch (e) {
        this.loggerPort.warn("No se pudieron obtener los roles del usuario");
      }

      const newConcurrencyStamp = this.tokenPort.generateStamp();

      await this.userPort.updateUser(userId, {
        concurrency_stamp: newConcurrencyStamp,
      });
      userInfo[0] = newConcurrencyStamp;

      const authResponse: AuthResponse = await this.authPort.loginUser(
        requests,
        { ...userInfo, roles: roleNames, permissions },
        {
          profile_image: userInfo[3],
          id: userId,
        },
      );
      authResponse.id = userId;
      authResponse.roles = roleNames;
      (authResponse as any).permissions = permissions;

      if (!authResponse) {
        return ApplicationResponse.failure(
          new ApplicationError("Error al autenticar al usuario", ErrorCodes.SERVER_ERROR),
        );
      }

      return ApplicationResponse.success(authResponse);
    } catch (error: unknown) {
      if (error instanceof ApplicationResponse) {
        this.loggerPort.error("Error controlado durante el login", error);
        return error;
      }

      if (error instanceof Error) {
        this.loggerPort.error("Error inesperado durante el login", error);
        return ApplicationResponse.failure(
          new ApplicationError(
            "Ocurrió un error inesperado",
            ErrorCodes.SERVER_ERROR,
            [error.name, error.message],
            error,
          ),
        );
      }

      return ApplicationResponse.failure(
        new ApplicationError("Ocurrió un error inesperado", ErrorCodes.SERVER_ERROR),
      );
    }
  }

  async confirmEmail(req: VerifyEmailRequest): Promise<ApplicationResponse<boolean>> {
    try {
      if (!req) {
        return ApplicationResponse.failure(new ApplicationError("No se puede verificar una solicitud vacia", ErrorCodes.VALIDATION_ERROR));
      }
    } catch (error) {

    }
    return ApplicationResponse.success(true);
  }
}
