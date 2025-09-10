import AuthService from "../../src/application/services/AuthService";
import UserPort from "../../src/domain/ports/data/UserPort";
import AuthPort from "../../src/domain/ports/data/AuthPort";
import EmailPort from "../../src/domain/ports/utils/EmailPort";
import LoggerPort from "../../src/domain/ports/utils/LoggerPort";
import TokenPort from "../../src/domain/ports/utils/TokenPort";
import LoginRequest from "../../src/application/dto/requests/User/LoginRequest";
import VerifyEmailRequest from "../../src/application/dto/requests/User/VerifyEmailRequest";
import { ApplicationResponse } from "../../src/application/shared/ApplicationReponse";

// Mock del puerto con la estructura esperada
const mockUserPort: jest.Mocked<UserPort> = {
  existsUserByLoginRequest: jest.fn(),
  getUserStampsAndIdByUserOrEmail: jest.fn(),
  updateUser: jest.fn(),
} as any;

const mockAuthPort: jest.Mocked<AuthPort> = {
  loginUser: jest.fn(),
} as any;

const mockEmailPort: jest.Mocked<EmailPort> = {} as any;

const mockLoggerPort: jest.Mocked<LoggerPort> = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
} as any;

const mockTokenPort: jest.Mocked<TokenPort> = {
  generateStamp: jest.fn(),
} as any;

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService(
      mockUserPort,
      mockAuthPort,
      mockEmailPort,
      mockLoggerPort,
      mockTokenPort,
    );
  });

  it("debe autenticar a un usuario correctamente", async () => {
    const loginRequest: LoginRequest = { userOrEmail: "testuser", password: "password" };
    mockUserPort.existsUserByLoginRequest.mockResolvedValue({ success: true, data: true });
    mockUserPort.getUserStampsAndIdByUserOrEmail.mockResolvedValue({
      success: true,
      data: ["stamp1", "stamp2", 1],
    });
    mockAuthPort.loginUser.mockResolvedValue({ token: "testToken", id: 1, username: "testuser" });

    const result = await authService.login(loginRequest);

    expect(result.success).toBe(true);
    expect(result.data?.token).toBe("testToken");
    expect(mockUserPort.existsUserByLoginRequest).toHaveBeenCalledWith("testuser");
    expect(mockAuthPort.loginUser).toHaveBeenCalledWith(loginRequest, ["stamp1", "stamp2", 1]);
  });

  it("debe manejar errores durante el login", async () => {
    const loginRequest: LoginRequest = { userOrEmail: "testuser", password: "password" };
    mockUserPort.existsUserByLoginRequest.mockResolvedValue({ success: false, data: undefined });

    const result = await authService.login(loginRequest);

    expect(result.success).toBe(false);
    expect(result.error?.message).toMatch(/Credenciales inválidas/);
  });

  it("debe confirmar un correo electrónico correctamente", async () => {
    const verifyEmailRequest: VerifyEmailRequest = {
      token: "testToken",
      email: "test@example.com",
    };

    const result = await authService.confirmEmail(verifyEmailRequest);

    expect(result.success).toBe(true);
    expect(result.data).toBe(true);
  });
});
