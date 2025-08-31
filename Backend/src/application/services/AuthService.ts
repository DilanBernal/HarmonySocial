import AuthPort from "../../domain/ports/data/AuthPort";
import UserPort from "../../domain/ports/data/UserPort";
import EmailPort from "../../domain/ports/extras/EmailPort";
import LoggerPort from "../../domain/ports/extras/LoggerPort";
import LoginRequest from "../dto/requests/LoginRequest";
import AuthResponse from "../dto/responses/AuthResponse";
import { ApplicationResponse } from "../shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../shared/errors/ApplicationError";

export default class AuthService {
  private userPort: UserPort;
  private authPort: AuthPort;
  private emailPort: EmailPort;
  private loggerPort: LoggerPort;
  private usernameRegex: RegExp = /^[a-zA-Z0-9_*\-#$!|°.+]{2,50}$/;
  private fullNameRegex: RegExp = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)?$/;
  private passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])(.){8,}$/;
  private emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private profileImage: RegExp = /^(https?|ftp|http):\/\/[^\s/$.?#].[^\s]*$/

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
        throw ApplicationResponse.failure(new ApplicationError("La solicitud de login no puede estar vacía", ErrorCodes.VALIDATION_ERROR));
      }

      const validationErrors: Array<string> = [];

      if (!this.usernameRegex.test(requests.userOrEmail) && !this.emailRegex.test(requests.userOrEmail)) {
        validationErrors.push("El valor userOrEmail no está en el formato correcto");
      }

      if (!this.passwordRegex.test(requests.password)) {
        validationErrors.push("La contraseña no está en el formato correcto");
      }

      if (validationErrors.length > 0) {
        throw ApplicationResponse.failure(new ApplicationError("Errores de validación", ErrorCodes.VALIDATION_ERROR, validationErrors));
      }

      const userExists = await this.userPort.existsUserByEmailOrUsername(requests.userOrEmail, requests.userOrEmail);

      if (!userExists) {
        throw ApplicationResponse.failure(new ApplicationError("Credenciales inválidas", ErrorCodes.INVALID_CREDENTIALS));
      }

      const authResponse: AuthResponse = await this.authPort.loginUser(requests);

      if (!authResponse) {
        throw ApplicationResponse.failure(new ApplicationError("Error al autenticar al usuario", ErrorCodes.SERVER_ERROR));
      }

      return ApplicationResponse.success(authResponse);
    } catch (error: unknown) {
      if (error instanceof ApplicationResponse) {
        this.loggerPort.error("Error controlado durante el login", error);
        throw error;
      }

      if (error instanceof Error) {
        this.loggerPort.error("Error inesperado durante el login", error);
        throw ApplicationResponse.failure(new ApplicationError("Ocurrió un error inesperado", ErrorCodes.SERVER_ERROR, [error.name, error.message], error));
      }

      throw ApplicationResponse.failure(new ApplicationError("Ocurrió un error inesperado", ErrorCodes.SERVER_ERROR));
    }
  }
}