import AuthPort from "../../domain/ports/data/AuthPort";
import UserPort from "../../domain/ports/data/UserPort";
import EmailPort from "../../domain/ports/utils/EmailPort";
import LoggerPort from "../../domain/ports/utils/LoggerPort";
import LoginRequest from "../dto/requests/LoginRequest";
import VerifyEmailRequest from "../dto/requests/VerifyEmailRequest";
import AuthResponse from "../dto/responses/AuthResponse";
import { ApplicationResponse } from "../shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../shared/errors/ApplicationError";

export default class AuthService {
  private userPort: UserPort;
  private authPort: AuthPort;
  private emailPort: EmailPort;
  private loggerPort: LoggerPort;

  constructor(userPort: UserPort, authPort: AuthPort, emailPort: EmailPort, logger: LoggerPort) {
    this.userPort = userPort;
    this.authPort = authPort;
    this.emailPort = emailPort;
    this.loggerPort = logger;
  }

  async login(requests: LoginRequest): Promise<ApplicationResponse<AuthResponse>> {
    try {
      if (!requests) {
        this.loggerPort.warn("Solicitud de login vacía");
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

      const authResponse: AuthResponse = await this.authPort.loginUser(requests);

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
    return ApplicationResponse.success(true);
  }
}
