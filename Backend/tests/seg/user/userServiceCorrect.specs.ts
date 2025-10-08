import RegisterRequest from "../../../src/application/dto/requests/User/RegisterRequest";
import UserService from "../../../src/application/services/UserService";
import { ApplicationResponse } from "../../../src/application/shared/ApplicationReponse";
import { ErrorCodes } from "../../../src/application/shared/errors/ApplicationError";
import User, { UserStatus, UserInstrument } from "../../../src/domain/models/User";
import AuthPort from "../../../src/domain/ports/data/AuthPort";
import RolePort from "../../../src/domain/ports/data/RolePort";
import UserPort from "../../../src/domain/ports/data/UserPort";
import UserRolePort from "../../../src/domain/ports/data/UserRolePort";
import EmailPort from "../../../src/domain/ports/utils/EmailPort";
import LoggerPort from "../../../src/domain/ports/utils/LoggerPort";
import TokenPort from "../../../src/domain/ports/utils/TokenPort";

const mockUserPort: jest.Mocked<UserPort> = {
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  getAllUsers: jest.fn(),
  getUserById: jest.fn(),
  getUserBasicDataById: jest.fn(),
  getUserByEmail: jest.fn(),
  getUserByLoginRequest: jest.fn(),
  getUserByEmailOrUsername: jest.fn(),
  getUserStampsAndUserInfoByUserOrEmail: jest.fn(),
  existsUserById: jest.fn(),
  existsUserByLoginRequest: jest.fn(),
  existsUserByEmailOrUsername: jest.fn(),
  getUsersByIds: jest.fn(),
} as any;

const mockAuthPort: jest.Mocked<AuthPort> = {
  encryptPassword: jest.fn(),
  loginUser: jest.fn(),
  verifyPassword: jest.fn(),
} as any;

const mockEmailPort: jest.Mocked<EmailPort> = {
  sendEmail: jest.fn().mockResolvedValue(true),
  sendEmails: jest.fn().mockResolvedValue(true),
} as jest.Mocked<EmailPort>;

const mockLoggerPort: jest.Mocked<LoggerPort> = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  appError: jest.fn(),
  appWarn: jest.fn(),
} as any;

const mockTokenPort: jest.Mocked<TokenPort> = {
  generateStamp: jest.fn().mockReturnValue("stamp123"),
  generateConfirmAccountToken: jest.fn().mockReturnValue("confirmToken"),
  generateRecoverPasswordToken: jest.fn().mockReturnValue("recoveryToken"),
  verifyToken: jest.fn(),
} as any;

const mockRolePort: jest.Mocked<RolePort> = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findById: jest.fn(),
  findByName: jest.fn().mockResolvedValue({ id: 99, name: "common_user" } as any),
  list: jest.fn(),
} as any;

const mockUserRolePort: jest.Mocked<UserRolePort> = {
  assignRoleToUser: jest.fn().mockResolvedValue(undefined as any),
  removeRoleFromUser: jest.fn(),
  listRolesForUser: jest.fn().mockResolvedValue([{ id: 99, name: "common_user" }] as any),
  userHasRole: jest.fn(),
} as any;

describe('User service correct ', () => {

  let userService: UserService;

  // Datos de prueba comunes
  const mockUser: User = {
    id: 1,
    full_name: "John Doe",
    normalized_email: "john@example.com".toUpperCase(),
    email: "john@example.com",
    username: "johndoe",
    normalized_username: "johndoe".toUpperCase(),
    password: "hashedPassword",
    profile_image: "https://example.com/image.jpg",
    learning_points: 0,
    status: UserStatus.ACTIVE,
    favorite_instrument: UserInstrument.GUITAR,
    concurrency_stamp: "concurrency123",
    security_stamp: "security123",
    created_at: new Date("2024-01-01"),
    updated_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService(
      mockUserPort,
      mockAuthPort,
      mockEmailPort,
      mockLoggerPort,
      mockTokenPort,
      mockRolePort,
      mockUserRolePort,
    );
  });


  describe("registerUser", () => {
    const validRegisterRequest: RegisterRequest = {
      full_name: "John Doe",
      email: "john@example.com",
      username: "johndoe",
      password: "Password123!",
      profile_image: "https://example.com/image.jpg",
      favorite_instrument: UserInstrument.GUITAR,
    };

    it("debe registrar un usuario exitosamente", async () => {
      mockUserPort.existsUserByEmailOrUsername.mockResolvedValue(
        ApplicationResponse.success(false),
      );
      mockAuthPort.encryptPassword.mockResolvedValue("hashedPassword");
      mockTokenPort.generateStamp.mockReturnValue("stamp123");
      mockUserPort.createUser.mockResolvedValue(ApplicationResponse.success(1));
      mockTokenPort.generateConfirmAccountToken.mockReturnValue("confirmToken");
      mockEmailPort.sendEmail.mockResolvedValue(true);

      // Ejecutar
      const result = await userService.registerUser(validRegisterRequest);

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toBe(1);
      expect(mockUserPort.existsUserByEmailOrUsername).toHaveBeenCalledWith(
        validRegisterRequest.email,
        validRegisterRequest.username,
      );
      expect(mockAuthPort.encryptPassword).toHaveBeenCalledWith(validRegisterRequest.password);
      expect(mockUserPort.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: validRegisterRequest.email,
          username: validRegisterRequest.username,
          status: UserStatus.SUSPENDED,
        }),
      );
      expect(mockEmailPort.sendEmail).toHaveBeenCalled();
    });

    it("debe fallar si los datos del usuario son inválidos", async () => {
      // Ejecutar con datos null
      const result = await userService.registerUser(null as any);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("Datos de usuario inválidos");
    });

    it("debe fallar si el usuario ya existe", async () => {
      // Configurar mock para usuario existente
      mockUserPort.existsUserByEmailOrUsername.mockResolvedValue(ApplicationResponse.success(true));

      // Ejecutar
      const result = await userService.registerUser(validRegisterRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.USER_ALREADY_EXISTS);
      expect(result.error?.message).toBe("Ya existe el usuario");
    });

    it("debe manejar errores durante el registro", async () => {
      // Configurar mock para error
      mockUserPort.existsUserByEmailOrUsername.mockResolvedValue(
        ApplicationResponse.success(false),
      );
      mockAuthPort.encryptPassword.mockRejectedValue(new Error("Database error"));

      // Ejecutar
      const result = await userService.registerUser(validRegisterRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.SERVER_ERROR);
    });
  });

});