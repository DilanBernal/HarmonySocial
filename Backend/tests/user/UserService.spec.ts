import UserService from "../../src/application/services/UserService";
import UserPort from "../../src/domain/ports/data/UserPort";
import AuthPort from "../../src/domain/ports/data/AuthPort";
import EmailPort from "../../src/domain/ports/utils/EmailPort";
import LoggerPort from "../../src/domain/ports/utils/LoggerPort";
import TokenPort from "../../src/domain/ports/utils/TokenPort";
import RolePort from "../../src/domain/ports/data/RolePort";
import UserRolePort from "../../src/domain/ports/data/UserRolePort";
import User, { UserInstrument, UserStatus } from "../../src/domain/models/User";
import RegisterRequest from "../../src/application/dto/requests/User/RegisterRequest";
import UpdateUserRequest from "../../src/application/dto/requests/User/UpdateUserRequest";
import ForgotPasswordRequest from "../../src/application/dto/requests/User/ForgotPasswordRequest";
import ResetPasswordRequest from "../../src/application/dto/requests/User/ResetPasswordRequest";
import VerifyEmailRequest from "../../src/application/dto/requests/User/VerifyEmailRequest";
import UserResponse from "../../src/application/dto/responses/seg/user/UserResponse";
import { ApplicationResponse } from "../../src/application/shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../../src/application/shared/errors/ApplicationError";

// Mocks completos de todos los puertos
const mockUserPort: jest.Mocked<UserPort> = {
  createUser: jest.fn(),
  updateUser: jest.fn(),
  getAllUsers: jest.fn(),
  getUserById: jest.fn(),
  getUserByEmail: jest.fn(),
  deleteUser: jest.fn(),
  getUserBasicDataById: jest.fn(),
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

describe("UserService", () => {
  let userService: UserService;

  // Datos de prueba comunes
  const mockUser: User = {
    id: 1,
    full_name: "John Doe",
    email: "john@example.com",
    username: "johndoe",
    password: "hashedPassword",
    profile_image: "https://example.com/image.jpg",
    learning_points: 0,
    status: UserStatus.ACTIVE,
    favorite_instrument: UserInstrument.GUITAR,
    concurrency_stamp: "concurrency123",
    security_stamp: "security123",
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
    normalized_email: "",
    normalized_username: "",
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
      // Configurar mocks para escenario exitoso
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
      expect(mockUserPort.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          status: UserStatus.SUSPENDED,
          full_name: validRegisterRequest.full_name,
          email: validRegisterRequest.email,
          username: validRegisterRequest.username,
          password: "hashedPassword",
          learning_points: 0,
        }),
      );
      expect(mockEmailPort.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [validRegisterRequest.email],
          subject: `Bienvenido ${validRegisterRequest.full_name}`,
        }),
      );
    });

    it("debe rechazar el registro si los datos del usuario son inválidos", async () => {
      // Ejecutar con datos nulos
      const result = await userService.registerUser(null as any);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("Datos de usuario inválidos");
    });

    it("debe rechazar el registro si el usuario ya existe", async () => {
      // Configurar mock para usuario existente
      mockUserPort.existsUserByEmailOrUsername.mockResolvedValue(ApplicationResponse.success(true));

      // Ejecutar
      const result = await userService.registerUser(validRegisterRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.USER_ALREADY_EXISTS);
      expect(result.error?.message).toBe("Ya existe el usuario");
    });

    it("debe manejar errores durante la creación del usuario", async () => {
      // Configurar mocks para simular error en la creación
      mockUserPort.existsUserByEmailOrUsername.mockResolvedValue(
        ApplicationResponse.success(false),
      );
      mockAuthPort.encryptPassword.mockResolvedValue("hashedPassword");
      mockUserPort.createUser.mockRejectedValue(new Error("Database error"));

      // Ejecutar
      const result = await userService.registerUser(validRegisterRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.SERVER_ERROR);
      expect(result.error?.message).toBe(
        "Ocurrio un error inesperado en el registro, vuelva a intentarlo mas tarde",
      );
    });
  });

  describe("deleteUser", () => {
    it("debe eliminar un usuario exitosamente si existe", async () => {
      // Configurar mocks
      mockUserPort.existsUserById.mockResolvedValue(ApplicationResponse.success(true));
      mockUserPort.deleteUser.mockResolvedValue(ApplicationResponse.emptySuccess());

      // Ejecutar
      const result = await userService.deleteUser(1);

      // Verificar
      expect(result.success).toBe(true);
      expect(mockUserPort.existsUserById).toHaveBeenCalledWith(1);
      expect(mockUserPort.deleteUser).toHaveBeenCalledWith(1);
    });

    it("debe fallar si el usuario no existe", async () => {
      // Configurar mock para usuario no existente - retornar null/undefined para hacer falsy la condición
      mockUserPort.existsUserById.mockResolvedValue(null as any);

      // Ejecutar
      const result = await userService.deleteUser(1);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(14);
      expect(result.error?.message).toBe("El usuario no se encontro");
      expect(mockUserPort.deleteUser).not.toHaveBeenCalled();
    });

    it("debe manejar errores durante la eliminación", async () => {
      // Configurar mock para simular error
      mockUserPort.existsUserById.mockRejectedValue(new Error("Database error"));

      // Ejecutar
      const result = await userService.deleteUser(1);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.SERVER_ERROR);
    });
  });

  describe("getAllUsers", () => {
    it("debe retornar todos los usuarios exitosamente", async () => {
      // Configurar mock
      const users = [mockUser];
      mockUserPort.getAllUsers.mockResolvedValue(ApplicationResponse.success(users));

      // Ejecutar
      const result = await userService.getAllUsers();

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data![0]).toEqual(
        expect.objectContaining({
          id: mockUser.id,
          full_name: mockUser.full_name,
          email: mockUser.email,
          username: mockUser.username,
        }),
      );
      expect(result.data![0]).not.toHaveProperty("password");
    });

    it("debe retornar una lista vacía si no hay usuarios", async () => {
      // Configurar mock para lista vacía
      mockUserPort.getAllUsers.mockResolvedValue(ApplicationResponse.success([]));

      // Ejecutar
      const result = await userService.getAllUsers();

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it("debe manejar errores al obtener usuarios", async () => {
      // Configurar mock para simular error
      mockUserPort.getAllUsers.mockRejectedValue(new Error("Database error"));

      // Ejecutar
      const result = await userService.getAllUsers();

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.SERVER_ERROR);
      expect(mockLoggerPort.error).toHaveBeenCalled();
    });
  });

  describe("getUserById", () => {
    it("debe retornar el usuario correctamente si existe", async () => {
      // Configurar mock
      mockUserPort.getUserById.mockResolvedValue(ApplicationResponse.success(mockUser));

      // Ejecutar
      const result = await userService.getUserById(1);

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toEqual(
        expect.objectContaining({
          id: mockUser.id,
          full_name: mockUser.full_name,
          email: mockUser.email,
        }),
      );
      expect(result.data).not.toHaveProperty("password");
    });

    it("debe fallar con ID inválido (null, undefined o <= 0)", async () => {
      // Ejecutar con ID inválido
      const result = await userService.getUserById(0);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("ID de usuario inválido");
      expect(mockUserPort.getUserById).not.toHaveBeenCalled();
    });

    it("debe fallar si el usuario no existe", async () => {
      // Configurar mock para usuario no encontrado
      mockUserPort.getUserById.mockResolvedValue(ApplicationResponse.success(undefined as any));

      // Ejecutar
      const result = await userService.getUserById(999);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(14);
      expect(result.error?.message).toBe("Usuario no encontrado");
    });
  });

  describe("getUserByEmail", () => {
    it("debe retornar el usuario correctamente si existe", async () => {
      // Configurar mock
      mockUserPort.getUserByEmail.mockResolvedValue(ApplicationResponse.success(mockUser));

      // Ejecutar
      const result = await userService.getUserByEmail("john@example.com");

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data?.email).toBe("john@example.com");
    });

    it("debe fallar con email inválido", async () => {
      // Ejecutar con email inválido
      const result = await userService.getUserByEmail("invalid-email");

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("Email inválido");
      expect(mockUserPort.getUserByEmail).not.toHaveBeenCalled();
    });

    it("debe fallar si el usuario no existe", async () => {
      // Configurar mock para usuario no encontrado
      mockUserPort.getUserByEmail.mockResolvedValue(ApplicationResponse.success(undefined as any));

      // Ejecutar
      const result = await userService.getUserByEmail("notfound@example.com");

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(14);
    });
  });

  describe("updateUser", () => {
    const validUpdateRequest: UpdateUserRequest = {
      full_name: "John Updated",
      email: "johnupdated@example.com",
      username: "johnupdated",
      profile_image: "https://example.com/newimage.jpg",
      favorite_instrument: UserInstrument.PIANO,
    };

    it("debe actualizar un usuario exitosamente", async () => {
      // Configurar mocks
      mockUserPort.existsUserById.mockResolvedValue(ApplicationResponse.success(true));
      mockUserPort.getUserByEmailOrUsername.mockResolvedValue(
        ApplicationResponse.success(undefined as any),
      );
      mockUserPort.updateUser.mockResolvedValue(ApplicationResponse.emptySuccess());

      // Ejecutar
      const result = await userService.updateUser(1, validUpdateRequest);

      // Verificar
      expect(result.success).toBe(true);
      expect(mockUserPort.updateUser).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          full_name: validUpdateRequest.full_name,
          email: validUpdateRequest.email,
          username: validUpdateRequest.username,
        }),
      );
    });

    it("debe fallar con ID inválido", async () => {
      // Ejecutar con ID inválido
      const result = await userService.updateUser(0, validUpdateRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("ID de usuario inválido");
    });

    it("debe fallar si el usuario no existe", async () => {
      // Configurar mock para usuario no existente
      mockUserPort.existsUserById.mockResolvedValue(ApplicationResponse.success(false));

      // Ejecutar
      const result = await userService.updateUser(1, validUpdateRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(14);
      expect(result.error?.message).toBe("Usuario no encontrado");
    });

    it("debe fallar si el email o username ya existen en otro usuario", async () => {
      // Configurar mocks
      mockUserPort.existsUserById.mockResolvedValue(ApplicationResponse.success(true));
      const existingUser = { ...mockUser, id: 2 }; // Usuario diferente
      mockUserPort.getUserByEmailOrUsername.mockResolvedValue(
        ApplicationResponse.success(existingUser),
      );

      // Ejecutar
      const result = await userService.updateUser(1, validUpdateRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.USER_ALREADY_EXISTS);
      expect(result.error?.message).toBe("El email o username ya están en uso");
    });

    it("debe validar campos con formato incorrecto", async () => {
      // Configurar mock
      mockUserPort.existsUserById.mockResolvedValue(ApplicationResponse.success(true));

      const invalidUpdateRequest: UpdateUserRequest = {
        full_name: "A", // Muy corto
        email: "invalid-email", // Email inválido
        username: "a", // Username muy corto
        new_password: "weak", // Contraseña débil
      };

      // Ejecutar
      const result = await userService.updateUser(1, invalidUpdateRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.details).toEqual(
        expect.arrayContaining([
          ["email", expect.any(String)],
          ["username", expect.any(String)],
          ["new_password", expect.any(String)],
        ]),
      );
    });
  });

  describe("forgotPassword", () => {
    const validForgotRequest: ForgotPasswordRequest = {
      email: "john@example.com",
    };

    it("debe procesar la solicitud de recuperación exitosamente", async () => {
      // Configurar mocks
      mockUserPort.getUserByEmail.mockResolvedValue(ApplicationResponse.success(mockUser));
      mockTokenPort.generateRecoverPasswordToken.mockReturnValue("recoveryToken");
      mockEmailPort.sendEmail.mockResolvedValue(true);

      // Ejecutar
      const result = await userService.forgotPassword(validForgotRequest);

      // Verificar
      expect(result.success).toBe(true);
      expect(mockEmailPort.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [mockUser.email],
          subject: "Recuperación de contraseña - HarmonyMusical",
        }),
      );
    });

    it("debe fallar con email requerido", async () => {
      // Ejecutar sin email
      const result = await userService.forgotPassword({} as any);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("Email requerido");
    });

    it("debe fallar con email inválido", async () => {
      // Ejecutar con email inválido
      const result = await userService.forgotPassword({ email: "invalid-email" });

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("Email inválido");
    });

    it("debe procesar silenciosamente si el usuario no existe (por seguridad)", async () => {
      // Configurar mock para usuario no encontrado
      mockUserPort.getUserByEmail.mockResolvedValue(ApplicationResponse.success(undefined as any));

      // Ejecutar
      const result = await userService.forgotPassword(validForgotRequest);

      // Verificar - Por seguridad, siempre retorna éxito
      expect(result.success).toBe(true);
      expect(mockEmailPort.sendEmail).not.toHaveBeenCalled();
    });

    it("debe fallar si la cuenta no está activa", async () => {
      // Configurar mock con usuario suspendido
      const suspendedUser = { ...mockUser, status: UserStatus.SUSPENDED };
      mockUserPort.getUserByEmail.mockResolvedValue(ApplicationResponse.success(suspendedUser));

      // Ejecutar
      const result = await userService.forgotPassword(validForgotRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.BUSINESS_RULE_VIOLATION);
      expect(result.error?.message).toBe("La cuenta no está activa");
    });
  });

  describe("resetPassword", () => {
    const validResetRequest: ResetPasswordRequest = {
      token: "validToken",
      newPassword: "NewPassword123!",
      confirmPassword: "NewPassword123!",
    };

    it("debe restablecer la contraseña exitosamente", async () => {
      // Configurar mocks
      mockTokenPort.verifyToken.mockReturnValue({ userId: 1 });
      mockAuthPort.encryptPassword.mockResolvedValue("newHashedPassword");
      mockTokenPort.generateStamp.mockReturnValue("newSecurityStamp");

      // Ejecutar
      const result = await userService.resetPassword(validResetRequest);

      // Verificar
      expect(result.success).toBe(true);
      expect(mockTokenPort.verifyToken).toHaveBeenCalledWith("validToken");
    });

    it("debe fallar si faltan campos requeridos", async () => {
      // Ejecutar con campos faltantes
      const incompleteRequest = { token: "token" } as any;
      const result = await userService.resetPassword(incompleteRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("Todos los campos son requeridos");
    });

    it("debe fallar si las contraseñas no coinciden", async () => {
      // Ejecutar con contraseñas diferentes
      const mismatchRequest = {
        ...validResetRequest,
        confirmPassword: "DifferentPassword123!",
      };
      const result = await userService.resetPassword(mismatchRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("Las contraseñas no coinciden");
    });

    it("debe fallar con token inválido", async () => {
      // Configurar mock para token inválido
      mockTokenPort.verifyToken.mockReturnValue(null);

      // Ejecutar
      const result = await userService.resetPassword(validResetRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("Token inválido o expirado");
    });

    it("debe fallar con contraseña que no cumple requisitos", async () => {
      // Ejecutar con contraseña débil
      const weakPasswordRequest = {
        ...validResetRequest,
        newPassword: "weak",
        confirmPassword: "weak",
      };
      const result = await userService.resetPassword(weakPasswordRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("La nueva contraseña no cumple con los requisitos");
    });
  });

  describe("verifyEmail", () => {
    const validVerifyRequest: VerifyEmailRequest = {
      token: "validToken",
      email: "john@example.com",
    };

    it("debe verificar el email exitosamente", async () => {
      // Configurar mocks
      mockTokenPort.verifyToken.mockReturnValue({ userId: 1 });
      mockUserPort.getUserByEmail.mockResolvedValue(ApplicationResponse.success(mockUser));
      mockUserPort.updateUser.mockResolvedValue(ApplicationResponse.emptySuccess());

      // Ejecutar
      const result = await userService.verifyEmail(validVerifyRequest);

      // Verificar
      expect(result.success).toBe(true);
      expect(mockUserPort.updateUser).toHaveBeenCalledWith(
        mockUser.id,
        expect.objectContaining({
          status: UserStatus.ACTIVE,
        }),
      );
    });

    it("debe fallar si no se proporciona token", async () => {
      // Ejecutar sin token
      const result = await userService.verifyEmail({ email: "test@example.com" } as any);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("Token requerido");
    });

    it("debe fallar con token inválido", async () => {
      // Configurar mock para token inválido
      mockTokenPort.verifyToken.mockReturnValue(null);

      // Ejecutar
      const result = await userService.verifyEmail(validVerifyRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("Token inválido o expirado");
    });
  });
});
