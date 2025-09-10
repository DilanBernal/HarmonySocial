import UserService from "../../src/application/services/UserService";
import UserPort from "../../src/domain/ports/data/UserPort";
import AuthPort from "../../src/domain/ports/data/AuthPort";
import EmailPort from "../../src/domain/ports/utils/EmailPort";
import LoggerPort from "../../src/domain/ports/utils/LoggerPort";
import TokenPort from "../../src/domain/ports/utils/TokenPort";
import { UserInstrument, UserStatus } from "../../src/domain/models/User";
import RegisterRequest from "../../src/application/dto/requests/User/RegisterRequest";
import UpdateUserRequest from "../../src/application/dto/requests/User/UpdateUserRequest";
import ForgotPasswordRequest from "../../src/application/dto/requests/User/ForgotPasswordRequest";
import ResetPasswordRequest from "../../src/application/dto/requests/User/ResetPasswordRequest";
import VerifyEmailRequest from "../../src/application/dto/requests/User/VerifyEmailRequest";
import { ApplicationResponse } from "../../src/application/shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../../src/application/shared/errors/ApplicationError";

// Mocks completos de todos los puertos
const mockUserPort: jest.Mocked<UserPort> = {
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  getAllUsers: jest.fn(),
  getUserById: jest.fn(),
  getUserByEmail: jest.fn(),
  getUserByLoginRequest: jest.fn(),
  getUserByEmailOrUsername: jest.fn(),
  getUserStampsAndIdByUserOrEmail: jest.fn(),
  existsUserById: jest.fn(),
  existsUserByLoginRequest: jest.fn(),
  existsUserByEmailOrUsername: jest.fn(),
} as jest.Mocked<UserPort>;

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
} as jest.Mocked<TokenPort>;

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService(
      mockUserPort,
      mockAuthPort,
      mockEmailPort,
      mockLoggerPort,
      mockTokenPort,
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
      is_artist: false,
    };

    it("debe registrar un usuario exitosamente", async () => {
      // Configurar mocks
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

  describe("getUserById", () => {
    const mockUser = {
      id: 123,
      full_name: "John Doe",
      email: "john@example.com",
      username: "johndoe",
      profile_image: "https://example.com/image.jpg",
      learning_points: 100,
      status: UserStatus.ACTIVE,
      favorite_instrument: UserInstrument.GUITAR,
      is_artist: false,
      created_at: new Date(),
      updated_at: new Date(),
      password: "hashedpassword",
      concurrency_stamp: "concurrency-stamp",
      security_stamp: "security-stamp",
    };

    it("debe retornar el usuario si existe", async () => {
      // Configurar mock
      mockUserPort.getUserById.mockResolvedValue(ApplicationResponse.success(mockUser));

      // Ejecutar
      const result = await userService.getUserById(123);

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toEqual(
        expect.objectContaining({
          id: 123,
          username: "johndoe",
          email: "john@example.com",
          full_name: "John Doe",
        }),
      );
      expect(mockUserPort.getUserById).toHaveBeenCalledWith(123);
    });

    it("debe retornar error si el ID es inválido", async () => {
      // Ejecutar con ID inválido
      const result = await userService.getUserById(0);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("ID de usuario inválido");
    });

    it("debe retornar error si el usuario no existe", async () => {
      // Configurar mock para usuario no encontrado
      mockUserPort.getUserById.mockResolvedValue(ApplicationResponse.success(null as any));

      // Ejecutar
      const result = await userService.getUserById(123);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALUE_NOT_FOUND);
      expect(result.error?.message).toBe("Usuario no encontrado");
    });

    it("debe manejar errores del puerto", async () => {
      // Configurar mock para error
      mockUserPort.getUserById.mockResolvedValue(
        ApplicationResponse.failure(
          new ApplicationError("Database error", ErrorCodes.DATABASE_ERROR),
        ),
      );

      // Ejecutar
      const result = await userService.getUserById(123);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.DATABASE_ERROR);
    });
  });

  describe("getUserByEmail", () => {
    const mockUser = {
      id: 123,
      full_name: "John Doe",
      email: "john@example.com",
      username: "johndoe",
      profile_image: "https://example.com/image.jpg",
      learning_points: 100,
      status: UserStatus.ACTIVE,
      favorite_instrument: UserInstrument.GUITAR,
      is_artist: false,
      created_at: new Date(),
      updated_at: new Date(),
      password: "hashedpassword",
      concurrency_stamp: "concurrency-stamp",
      security_stamp: "security-stamp",
    };

    it("debe retornar el usuario si existe", async () => {
      // Configurar mock
      mockUserPort.getUserByEmail.mockResolvedValue(ApplicationResponse.success(mockUser));

      // Ejecutar
      const result = await userService.getUserByEmail("john@example.com");

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data?.email).toBe("john@example.com");
      expect(mockUserPort.getUserByEmail).toHaveBeenCalledWith("john@example.com");
    });

    it("debe retornar error si el email es inválido", async () => {
      // Ejecutar con email inválido
      const result = await userService.getUserByEmail("invalid-email");

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("Email inválido");
    });

    it("debe retornar error si el email está vacío", async () => {
      // Ejecutar con email vacío
      const result = await userService.getUserByEmail("");

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("Email inválido");
    });
  });

  describe("updateUser", () => {
    const validUpdateRequest: UpdateUserRequest = {
      full_name: "John Updated",
      email: "john.updated@example.com",
      username: "johnupdated",
      profile_image: "https://example.com/newimage.jpg",
      favorite_instrument: UserInstrument.PIANO,
      is_artist: true,
    };

    it("debe actualizar el usuario exitosamente", async () => {
      // Configurar mocks
      mockUserPort.existsUserById.mockResolvedValue(ApplicationResponse.success(true));
      mockUserPort.getUserByEmailOrUsername.mockResolvedValue(
        ApplicationResponse.success(null as any),
      );
      mockUserPort.updateUser.mockResolvedValue(ApplicationResponse.emptySuccess());

      // Ejecutar
      const result = await userService.updateUser(123, validUpdateRequest);

      // Verificar
      expect(result.success).toBe(true);
      expect(mockUserPort.existsUserById).toHaveBeenCalledWith(123);
      expect(mockUserPort.updateUser).toHaveBeenCalledWith(
        123,
        expect.objectContaining({
          full_name: "John Updated",
          email: "john.updated@example.com",
          username: "johnupdated",
        }),
      );
    });

    it("debe fallar si el ID es inválido", async () => {
      // Ejecutar con ID inválido
      const result = await userService.updateUser(0, validUpdateRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("ID de usuario inválido");
    });

    it("debe fallar si los datos de actualización son null", async () => {
      // Ejecutar con datos null
      const result = await userService.updateUser(123, null as any);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("Datos de actualización requeridos");
    });

    it("debe fallar si el usuario no existe", async () => {
      // Configurar mock para usuario inexistente
      mockUserPort.existsUserById.mockResolvedValue(ApplicationResponse.success(false));

      // Ejecutar
      const result = await userService.updateUser(123, validUpdateRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALUE_NOT_FOUND);
      expect(result.error?.message).toBe("Usuario no encontrado");
    });

    it("debe validar formato de email", async () => {
      // Configurar mocks
      mockUserPort.existsUserById.mockResolvedValue(ApplicationResponse.success(true));

      const invalidRequest = { ...validUpdateRequest, email: "invalid-email" };

      // Ejecutar
      const result = await userService.updateUser(123, invalidRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.details).toContain(["email", "El email no esta en el formato correcto"]);
    });

    it("debe actualizar contraseña cuando se proporciona", async () => {
      // Configurar mocks
      mockUserPort.existsUserById.mockResolvedValue(ApplicationResponse.success(true));
      mockUserPort.getUserByEmailOrUsername.mockResolvedValue(
        ApplicationResponse.success(null as any),
      );
      mockAuthPort.encryptPassword.mockResolvedValue("newHashedPassword");
      mockTokenPort.generateStamp.mockReturnValue("newStamp");
      mockUserPort.updateUser.mockResolvedValue(ApplicationResponse.emptySuccess());

      const updateWithPassword = {
        ...validUpdateRequest,
        current_password: "OldPassword123!",
        new_password: "NewPassword123!",
      };

      // Ejecutar
      const result = await userService.updateUser(123, updateWithPassword);

      // Verificar
      expect(result.success).toBe(true);
      expect(mockAuthPort.encryptPassword).toHaveBeenCalledWith("NewPassword123!");
      expect(mockTokenPort.generateStamp).toHaveBeenCalled();
      expect(mockUserPort.updateUser).toHaveBeenCalledWith(
        123,
        expect.objectContaining({
          password: "newHashedPassword",
          security_stamp: "newStamp",
        }),
      );
    });
  });

  describe("deleteUser", () => {
    it("debe eliminar el usuario exitosamente", async () => {
      // Configurar mocks
      mockUserPort.existsUserById.mockResolvedValue(ApplicationResponse.success(true));
      mockUserPort.deleteUser.mockResolvedValue(ApplicationResponse.emptySuccess());

      // Ejecutar
      const result = await userService.deleteUser(123);

      // Verificar
      expect(result.success).toBe(true);
      expect(mockUserPort.existsUserById).toHaveBeenCalledWith(123);
      expect(mockUserPort.deleteUser).toHaveBeenCalledWith(123);
    });

    it("debe fallar si el usuario no existe", async () => {
      // Configurar mock para usuario inexistente
      mockUserPort.existsUserById.mockResolvedValue(ApplicationResponse.success(false));

      // Ejecutar
      const result = await userService.deleteUser(123);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALUE_NOT_FOUND);
      expect(result.error?.message).toBe("El usuario no se encontro");
    });
  });

  describe("getAllUsers", () => {
    const mockUsers = [
      {
        id: 1,
        full_name: "User One",
        email: "user1@example.com",
        username: "user1",
        profile_image: "",
        learning_points: 50,
        status: UserStatus.ACTIVE,
        favorite_instrument: UserInstrument.GUITAR,
        is_artist: false,
        created_at: new Date(),
        updated_at: new Date(),
        password: "hash1",
        concurrency_stamp: "stamp1",
        security_stamp: "security1",
      },
      {
        id: 2,
        full_name: "User Two",
        email: "user2@example.com",
        username: "user2",
        profile_image: "",
        learning_points: 75,
        status: UserStatus.ACTIVE,
        favorite_instrument: UserInstrument.PIANO,
        is_artist: true,
        created_at: new Date(),
        updated_at: new Date(),
        password: "hash2",
        concurrency_stamp: "stamp2",
        security_stamp: "security2",
      },
    ];

    it("debe retornar todos los usuarios exitosamente", async () => {
      // Configurar mock
      mockUserPort.getAllUsers.mockResolvedValue(ApplicationResponse.success(mockUsers));

      // Ejecutar
      const result = await userService.getAllUsers();

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data?.[0]).toEqual(
        expect.objectContaining({
          id: 1,
          username: "user1",
          email: "user1@example.com",
        }),
      );
      // No debe incluir campos sensibles como password
      expect(result.data?.[0]).not.toHaveProperty("password");
      expect(result.data?.[0]).not.toHaveProperty("security_stamp");
    });

    it("debe retornar array vacío si no hay usuarios", async () => {
      // Configurar mock para array vacío
      mockUserPort.getAllUsers.mockResolvedValue(ApplicationResponse.success([]));

      // Ejecutar
      const result = await userService.getAllUsers();

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it("debe manejar errores del puerto", async () => {
      // Configurar mock para error
      mockUserPort.getAllUsers.mockResolvedValue(
        ApplicationResponse.failure(
          new ApplicationError("Database error", ErrorCodes.DATABASE_ERROR),
        ),
      );

      // Ejecutar
      const result = await userService.getAllUsers();

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.DATABASE_ERROR);
    });
  });

  describe("forgotPassword", () => {
    const validForgotRequest: ForgotPasswordRequest = {
      email: "john@example.com",
    };

    const mockUser = {
      id: 123,
      full_name: "John Doe",
      email: "john@example.com",
      username: "johndoe",
      status: UserStatus.ACTIVE,
      security_stamp: "security123",
      concurrency_stamp: "concurrency123",
      profile_image: "",
      learning_points: 0,
      favorite_instrument: UserInstrument.GUITAR,
      is_artist: false,
      created_at: new Date(),
      updated_at: new Date(),
      password: "hashedpassword",
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
      expect(mockUserPort.getUserByEmail).toHaveBeenCalledWith("john@example.com");
      expect(mockTokenPort.generateRecoverPasswordToken).toHaveBeenCalledWith(
        "security123",
        "concurrency123",
      );
      expect(mockEmailPort.sendEmail).toHaveBeenCalled();
    });

    it("debe fallar si el email es requerido", async () => {
      // Ejecutar sin email
      const result = await userService.forgotPassword({} as any);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("Email requerido");
    });

    it("debe fallar si el email es inválido", async () => {
      // Ejecutar con email inválido
      const result = await userService.forgotPassword({ email: "invalid-email" });

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("Email inválido");
    });

    it("debe retornar éxito aunque el usuario no exista (por seguridad)", async () => {
      // Configurar mock para usuario no encontrado
      mockUserPort.getUserByEmail.mockResolvedValue(ApplicationResponse.success(null as any));

      // Ejecutar
      const result = await userService.forgotPassword(validForgotRequest);

      // Verificar
      expect(result.success).toBe(true);
      // No debe enviar email
      expect(mockEmailPort.sendEmail).not.toHaveBeenCalled();
    });

    it("debe fallar si la cuenta no está activa", async () => {
      // Configurar mock para usuario suspendido
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

    it("debe validar que todos los campos son requeridos", async () => {
      // Ejecutar sin token
      const result = await userService.resetPassword({
        token: "",
        newPassword: "NewPassword123!",
        confirmPassword: "NewPassword123!",
      });

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("Todos los campos son requeridos");
    });

    it("debe validar que las contraseñas coinciden", async () => {
      // Ejecutar con contraseñas diferentes
      const result = await userService.resetPassword({
        token: "validToken",
        newPassword: "NewPassword123!",
        confirmPassword: "DifferentPassword123!",
      });

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("Las contraseñas no coinciden");
    });

    it("debe validar el formato de la nueva contraseña", async () => {
      // Ejecutar con contraseña débil
      const result = await userService.resetPassword({
        token: "validToken",
        newPassword: "weak",
        confirmPassword: "weak",
      });

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("La nueva contraseña no cumple con los requisitos");
    });

    it("debe fallar si el token es inválido", async () => {
      // Configurar mock para token inválido
      mockTokenPort.verifyToken.mockReturnValue(null);

      // Ejecutar
      const result = await userService.resetPassword(validResetRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("Token inválido o expirado");
    });

    it("debe procesar el reseteo exitosamente con token válido", async () => {
      // Configurar mocks
      mockTokenPort.verifyToken.mockReturnValue({ userId: 123 });
      mockAuthPort.encryptPassword.mockResolvedValue("newHashedPassword");
      mockTokenPort.generateStamp.mockReturnValue("newStamp");

      // Ejecutar
      const result = await userService.resetPassword(validResetRequest);

      // Verificar
      expect(result.success).toBe(true);
      expect(mockTokenPort.verifyToken).toHaveBeenCalledWith("validToken");
      expect(mockAuthPort.encryptPassword).toHaveBeenCalledWith("NewPassword123!");
      expect(mockTokenPort.generateStamp).toHaveBeenCalled();
    });
  });

  describe("verifyEmail", () => {
    const validVerifyRequest: VerifyEmailRequest = {
      token: "validToken",
      email: "john@example.com",
    };

    it("debe fallar si no se proporciona token", async () => {
      // Ejecutar sin token
      const result = await userService.verifyEmail({} as any);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("Token requerido");
    });

    it("debe fallar si el token es inválido", async () => {
      // Configurar mock para token inválido
      mockTokenPort.verifyToken.mockReturnValue(null);

      // Ejecutar
      const result = await userService.verifyEmail(validVerifyRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(result.error?.message).toBe("Token inválido o expirado");
    });

    it("debe manejar errores durante la verificación", async () => {
      // Configurar mocks
      mockTokenPort.verifyToken.mockReturnValue({ userId: 123 });
      mockUserPort.getUserByEmail.mockRejectedValue(new Error("Database error"));

      // Ejecutar
      const result = await userService.verifyEmail(validVerifyRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.SERVER_ERROR);
    });
  });
});
