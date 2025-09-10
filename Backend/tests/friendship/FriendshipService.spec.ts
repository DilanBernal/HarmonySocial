import FriendshipService from "../../src/application/services/FriendshipService";
import FriendshipPort from "../../src/domain/ports/data/FriendshipPort";
import LoggerPort from "../../src/domain/ports/utils/LoggerPort";
import EmailPort from "../../src/domain/ports/utils/EmailPort";
import UserPort from "../../src/domain/ports/data/UserPort";
import FriendshipUsersIdsRequest from "../../src/application/dto/requests/Friendship/FriendshipUsersIdsRequest";
import { ApplicationResponse } from "../../src/application/shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../../src/application/shared/errors/ApplicationError";
import { FrienshipStatus } from "../../src/domain/models/Friendship";

// Mocks completos de todos los puertos
const mockFriendshipPort: jest.Mocked<FriendshipPort> = {
  createFriendship: jest.fn(),
  deleteFriendship: jest.fn(),
  getAllFriendshipsByUser: jest.fn(),
  getAllCommonFriendships: jest.fn(),
  getFrienshipsByUserAndSimilarName: jest.fn(),
  getFriendshipByUsersIds: jest.fn(),
  getFriendshipById: jest.fn(),
  removeFriendshipById: jest.fn(),
  removeFriendshipByUsersIds: jest.fn(),
  aproveFrienshipRequest: jest.fn(),
  rejectFrienshipRequest: jest.fn(),
} as jest.Mocked<FriendshipPort>;

const mockLoggerPort: jest.Mocked<LoggerPort> = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  appError: jest.fn(),
  appWarn: jest.fn(),
} as any;

const mockEmailPort: jest.Mocked<EmailPort> = {
  sendEmail: jest.fn().mockResolvedValue(true),
  sendEmails: jest.fn().mockResolvedValue(true),
} as jest.Mocked<EmailPort>;

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

describe("FriendshipService", () => {
  let friendshipService: FriendshipService;

  beforeEach(() => {
    jest.clearAllMocks();
    friendshipService = new FriendshipService(
      mockFriendshipPort,
      mockLoggerPort,
      mockUserPort,
      mockEmailPort,
    );
  });

  describe("createNewFriendship", () => {
    const validFriendshipRequest: FriendshipUsersIdsRequest = {
      user_id: 1,
      friend_id: 2,
    };

    it("debe crear una nueva amistad exitosamente", async () => {
      // Configurar mocks para usuarios existentes
      mockUserPort.existsUserById.mockResolvedValueOnce(ApplicationResponse.success(true)); // user_id
      mockUserPort.existsUserById.mockResolvedValueOnce(ApplicationResponse.success(true)); // friend_id

      // No existe relación previa
      mockFriendshipPort.getFriendshipByUsersIds.mockResolvedValue(
        ApplicationResponse.success(null),
      );

      // Creación exitosa
      mockFriendshipPort.createFriendship.mockResolvedValue(ApplicationResponse.success(true));

      // Ejecutar
      const result = await friendshipService.createNewFriendship(validFriendshipRequest);

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
      expect(mockUserPort.existsUserById).toHaveBeenCalledWith(1);
      expect(mockUserPort.existsUserById).toHaveBeenCalledWith(2);
      expect(mockFriendshipPort.getFriendshipByUsersIds).toHaveBeenCalledWith(
        validFriendshipRequest,
      );
      expect(mockFriendshipPort.createFriendship).toHaveBeenCalledWith(validFriendshipRequest);
    });

    it("debe fallar si el usuario remitente no existe", async () => {
      // Configurar mock para usuario remitente inexistente
      mockUserPort.existsUserById.mockResolvedValueOnce(ApplicationResponse.success(false));

      // Ejecutar
      const result = await friendshipService.createNewFriendship(validFriendshipRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALUE_NOT_FOUND);
      expect(result.error?.message).toBe("El usuario remitente no existe");
    });

    it("debe fallar si el usuario destinatario no existe", async () => {
      // Configurar mocks
      mockUserPort.existsUserById.mockResolvedValueOnce(ApplicationResponse.success(true)); // user_id existe
      mockUserPort.existsUserById.mockResolvedValueOnce(ApplicationResponse.success(false)); // friend_id no existe

      // Ejecutar
      const result = await friendshipService.createNewFriendship(validFriendshipRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALUE_NOT_FOUND);
      expect(result.error?.message).toBe("El usuario destinatario no existe");
    });

    it("debe retornar mensaje informativo si los usuarios ya son amigos", async () => {
      // Configurar mocks para usuarios existentes
      mockUserPort.existsUserById.mockResolvedValueOnce(ApplicationResponse.success(true));
      mockUserPort.existsUserById.mockResolvedValueOnce(ApplicationResponse.success(true));

      // Existe relación aceptada
      const existingFriendship = {
        id: 1,
        user_id: 1,
        friend_id: 2,
        status: FrienshipStatus.ACCEPTED,
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockFriendshipPort.getFriendshipByUsersIds.mockResolvedValue(
        ApplicationResponse.success(existingFriendship),
      );

      // Ejecutar
      const result = await friendshipService.createNewFriendship(validFriendshipRequest);

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toBe("Los usuarios ya son amigos");
    });

    it("debe retornar mensaje si ya existe solicitud pendiente", async () => {
      // Configurar mocks para usuarios existentes
      mockUserPort.existsUserById.mockResolvedValueOnce(ApplicationResponse.success(true));
      mockUserPort.existsUserById.mockResolvedValueOnce(ApplicationResponse.success(true));

      // Existe relación pendiente donde user_id envió la solicitud
      const existingFriendship = {
        id: 1,
        user_id: 1,
        friend_id: 2,
        status: FrienshipStatus.PENDING,
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockFriendshipPort.getFriendshipByUsersIds.mockResolvedValue(
        ApplicationResponse.success(existingFriendship),
      );

      // Ejecutar
      const result = await friendshipService.createNewFriendship(validFriendshipRequest);

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toBe(
        "Ya has enviado una solicitud de amistad a este usuario y está pendiente de respuesta.",
      );
    });

    it("debe crear nueva solicitud si la anterior fue rechazada", async () => {
      // Configurar mocks para usuarios existentes
      mockUserPort.existsUserById.mockResolvedValueOnce(ApplicationResponse.success(true));
      mockUserPort.existsUserById.mockResolvedValueOnce(ApplicationResponse.success(true));

      // Existe relación rechazada
      const existingFriendship = {
        id: 1,
        user_id: 1,
        friend_id: 2,
        status: FrienshipStatus.REJECTED,
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockFriendshipPort.getFriendshipByUsersIds.mockResolvedValue(
        ApplicationResponse.success(existingFriendship),
      );

      // Eliminar relación rechazada y crear nueva
      mockFriendshipPort.removeFriendshipById.mockResolvedValue(ApplicationResponse.emptySuccess());
      mockFriendshipPort.createFriendship.mockResolvedValue(ApplicationResponse.success(true));

      // Ejecutar
      const result = await friendshipService.createNewFriendship(validFriendshipRequest);

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
      expect(mockFriendshipPort.removeFriendshipById).toHaveBeenCalledWith(1);
      expect(mockFriendshipPort.createFriendship).toHaveBeenCalledWith(validFriendshipRequest);
    });

    it("debe manejar errores durante la creación", async () => {
      // Configurar mocks para usuarios existentes
      mockUserPort.existsUserById.mockResolvedValueOnce(ApplicationResponse.success(true));
      mockUserPort.existsUserById.mockResolvedValueOnce(ApplicationResponse.success(true));
      mockFriendshipPort.getFriendshipByUsersIds.mockResolvedValue(
        ApplicationResponse.success(null),
      );

      // Error durante la creación
      mockFriendshipPort.createFriendship.mockRejectedValue(new Error("Database error"));

      // Ejecutar
      const result = await friendshipService.createNewFriendship(validFriendshipRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.SERVER_ERROR);
      expect(result.error?.message).toBe("Error al crear la solicitud de amistad");
    });
  });

  describe("aceptFriendship", () => {
    const friendshipId = 1;

    it("debe aceptar la solicitud de amistad exitosamente", async () => {
      // Configurar mock para solicitud pendiente
      const pendingFriendship = {
        id: friendshipId,
        user_id: 1,
        friend_id: 2,
        status: FrienshipStatus.PENDING,
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockFriendshipPort.getFriendshipById.mockResolvedValue(
        ApplicationResponse.success(pendingFriendship),
      );
      mockFriendshipPort.aproveFrienshipRequest.mockResolvedValue(
        ApplicationResponse.emptySuccess(),
      );

      // Ejecutar
      const result = await friendshipService.aceptFriendship(friendshipId);

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toBe("Solicitud de amistad aceptada correctamente");
      expect(mockFriendshipPort.getFriendshipById).toHaveBeenCalledWith(friendshipId);
      expect(mockFriendshipPort.aproveFrienshipRequest).toHaveBeenCalledWith(friendshipId);
    });

    it("debe fallar si no se encuentra la solicitud", async () => {
      // Configurar mock para solicitud no encontrada
      mockFriendshipPort.getFriendshipById.mockResolvedValue(
        ApplicationResponse.failure(new ApplicationError("Not found", ErrorCodes.VALUE_NOT_FOUND)),
      );

      // Ejecutar
      const result = await friendshipService.aceptFriendship(friendshipId);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALUE_NOT_FOUND);
      expect(result.error?.message).toBe("No se encontró la solicitud de amistad");
    });

    it("debe retornar mensaje si la solicitud ya fue aceptada", async () => {
      // Configurar mock para solicitud ya aceptada
      const acceptedFriendship = {
        id: friendshipId,
        user_id: 1,
        friend_id: 2,
        status: FrienshipStatus.ACCEPTED,
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockFriendshipPort.getFriendshipById.mockResolvedValue(
        ApplicationResponse.success(acceptedFriendship),
      );

      // Ejecutar
      const result = await friendshipService.aceptFriendship(friendshipId);

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toBe("Esta solicitud de amistad ya fue aceptada previamente");
    });

    it("debe retornar mensaje si la solicitud ya fue rechazada", async () => {
      // Configurar mock para solicitud ya rechazada
      const rejectedFriendship = {
        id: friendshipId,
        user_id: 1,
        friend_id: 2,
        status: FrienshipStatus.REJECTED,
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockFriendshipPort.getFriendshipById.mockResolvedValue(
        ApplicationResponse.success(rejectedFriendship),
      );

      // Ejecutar
      const result = await friendshipService.aceptFriendship(friendshipId);

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toBe("Esta solicitud de amistad ya fue rechazada previamente");
    });

    it("debe manejar errores durante la aceptación", async () => {
      // Configurar mock para error
      mockFriendshipPort.getFriendshipById.mockRejectedValue(new Error("Database error"));

      // Ejecutar
      const result = await friendshipService.aceptFriendship(friendshipId);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.SERVER_ERROR);
      expect(result.error?.message).toBe("Error al aceptar la solicitud de amistad");
    });
  });

  describe("rejectFriendship", () => {
    const friendshipId = 1;

    it("debe rechazar la solicitud de amistad exitosamente", async () => {
      // Configurar mock para solicitud pendiente
      const pendingFriendship = {
        id: friendshipId,
        user_id: 1,
        friend_id: 2,
        status: FrienshipStatus.PENDING,
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockFriendshipPort.getFriendshipById.mockResolvedValue(
        ApplicationResponse.success(pendingFriendship),
      );
      mockFriendshipPort.rejectFrienshipRequest.mockResolvedValue(
        ApplicationResponse.emptySuccess(),
      );

      // Ejecutar
      const result = await friendshipService.rejectFriendship(friendshipId);

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toBe("Solicitud de amistad rechazada correctamente");
      expect(mockFriendshipPort.getFriendshipById).toHaveBeenCalledWith(friendshipId);
      expect(mockFriendshipPort.rejectFrienshipRequest).toHaveBeenCalledWith(friendshipId);
    });

    it("debe retornar mensaje si la solicitud ya fue aceptada", async () => {
      // Configurar mock para solicitud ya aceptada
      const acceptedFriendship = {
        id: friendshipId,
        user_id: 1,
        friend_id: 2,
        status: FrienshipStatus.ACCEPTED,
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockFriendshipPort.getFriendshipById.mockResolvedValue(
        ApplicationResponse.success(acceptedFriendship),
      );

      // Ejecutar
      const result = await friendshipService.rejectFriendship(friendshipId);

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toBe(
        "Esta solicitud de amistad ya fue aceptada previamente, no se puede rechazar",
      );
    });

    it("debe manejar errores durante el rechazo", async () => {
      // Configurar mock para error
      mockFriendshipPort.getFriendshipById.mockRejectedValue(new Error("Database error"));

      // Ejecutar
      const result = await friendshipService.rejectFriendship(friendshipId);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.SERVER_ERROR);
      expect(result.error?.message).toBe("Error al rechazar la solicitud de amistad");
    });
  });

  describe("getUserFriendships", () => {
    const userId = 1;

    it("debe obtener las amistades del usuario exitosamente", async () => {
      // Configurar mock para respuesta exitosa
      const friendshipsResponse = {
        friends: [
          { id: 2, full_name: "Friend One", username: "friend1" },
          { id: 3, full_name: "Friend Two", username: "friend2" },
        ],
        pending_sent: [],
        pending_received: [],
      };
      mockFriendshipPort.getAllFriendshipsByUser.mockResolvedValue(
        ApplicationResponse.success(friendshipsResponse),
      );

      // Ejecutar
      const result = await friendshipService.getUserFriendships(userId);

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toEqual(friendshipsResponse);
      expect(mockFriendshipPort.getAllFriendshipsByUser).toHaveBeenCalledWith(userId);
    });

    it("debe manejar errores al obtener amistades", async () => {
      // Configurar mock para error
      mockFriendshipPort.getAllFriendshipsByUser.mockResolvedValue(
        ApplicationResponse.failure(
          new ApplicationError("Database error", ErrorCodes.DATABASE_ERROR),
        ),
      );

      // Ejecutar
      const result = await friendshipService.getUserFriendships(userId);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.DATABASE_ERROR);
    });

    it("debe manejar excepciones durante la consulta", async () => {
      // Configurar mock para excepción
      mockFriendshipPort.getAllFriendshipsByUser.mockRejectedValue(new Error("Network error"));

      // Ejecutar
      const result = await friendshipService.getUserFriendships(userId);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.SERVER_ERROR);
      expect(result.error?.message).toBe("Error al obtener las amistades del usuario");
    });
  });

  describe("deleteFriendship", () => {
    const validFriendshipRequest: FriendshipUsersIdsRequest = {
      user_id: 1,
      friend_id: 2,
    };

    it("debe eliminar la amistad exitosamente", async () => {
      // Configurar mock para eliminación exitosa
      mockFriendshipPort.removeFriendshipByUsersIds.mockResolvedValue(
        ApplicationResponse.emptySuccess(),
      );

      // Ejecutar
      const result = await friendshipService.deleteFriendship(validFriendshipRequest);

      // Verificar
      expect(result.success).toBe(true);
      expect(mockFriendshipPort.removeFriendshipByUsersIds).toHaveBeenCalledWith(
        validFriendshipRequest,
      );
    });

    it("debe manejar errores durante la eliminación", async () => {
      // Configurar mock para error
      mockFriendshipPort.removeFriendshipByUsersIds.mockResolvedValue(
        ApplicationResponse.failure(new ApplicationError("Not found", ErrorCodes.VALUE_NOT_FOUND)),
      );

      // Ejecutar
      const result = await friendshipService.deleteFriendship(validFriendshipRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALUE_NOT_FOUND);
    });

    it("debe manejar excepciones durante la eliminación", async () => {
      // Configurar mock para excepción
      mockFriendshipPort.removeFriendshipByUsersIds.mockRejectedValue(new Error("Database error"));

      // Ejecutar
      const result = await friendshipService.deleteFriendship(validFriendshipRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.SERVER_ERROR);
      expect(result.error?.message).toBe("Error al eliminar la amistad");
    });
  });

  describe("deleteFriendshipById", () => {
    const friendshipId = 1;

    it("debe eliminar la amistad por ID exitosamente", async () => {
      // Configurar mock para eliminación exitosa
      mockFriendshipPort.removeFriendshipById.mockResolvedValue(ApplicationResponse.emptySuccess());

      // Ejecutar
      const result = await friendshipService.deleteFriendshipById(friendshipId);

      // Verificar
      expect(result.success).toBe(true);
      expect(mockFriendshipPort.removeFriendshipById).toHaveBeenCalledWith(friendshipId);
    });

    it("debe manejar errores durante la eliminación por ID", async () => {
      // Configurar mock para error
      mockFriendshipPort.removeFriendshipById.mockResolvedValue(
        ApplicationResponse.failure(new ApplicationError("Not found", ErrorCodes.VALUE_NOT_FOUND)),
      );

      // Ejecutar
      const result = await friendshipService.deleteFriendshipById(friendshipId);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALUE_NOT_FOUND);
    });

    it("debe manejar excepciones durante la eliminación por ID", async () => {
      // Configurar mock para excepción
      mockFriendshipPort.removeFriendshipById.mockRejectedValue(new Error("Database error"));

      // Ejecutar
      const result = await friendshipService.deleteFriendshipById(friendshipId);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.SERVER_ERROR);
      expect(result.error?.message).toBe("Error al eliminar la amistad por ID");
    });
  });

  describe("getFriendshipById", () => {
    const friendshipId = 1;

    it("debe obtener la amistad por ID exitosamente", async () => {
      // Configurar mock para respuesta exitosa
      const friendship = {
        id: friendshipId,
        user_id: 1,
        friend_id: 2,
        status: FrienshipStatus.ACCEPTED,
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockFriendshipPort.getFriendshipById.mockResolvedValue(
        ApplicationResponse.success(friendship),
      );

      // Ejecutar
      const result = await friendshipService.getFriendshipById(friendshipId);

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toEqual(friendship);
      expect(mockFriendshipPort.getFriendshipById).toHaveBeenCalledWith(friendshipId);
    });

    it("debe manejar errores al obtener amistad por ID", async () => {
      // Configurar mock para error
      mockFriendshipPort.getFriendshipById.mockResolvedValue(
        ApplicationResponse.failure(new ApplicationError("Not found", ErrorCodes.VALUE_NOT_FOUND)),
      );

      // Ejecutar
      const result = await friendshipService.getFriendshipById(friendshipId);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALUE_NOT_FOUND);
    });

    it("debe manejar excepciones al obtener amistad por ID", async () => {
      // Configurar mock para excepción
      mockFriendshipPort.getFriendshipById.mockRejectedValue(new Error("Database error"));

      // Ejecutar
      const result = await friendshipService.getFriendshipById(friendshipId);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.SERVER_ERROR);
      expect(result.error?.message).toBe("Error al obtener la amistad por ID");
    });
  });
});

// Mock del puerto con la estructura esperada
const mockFriendshipPort: jest.Mocked<FriendshipPort> = {
  createNewFriendship: jest.fn(),
  deleteFriendship: jest.fn(),
  getFriendshipByUsersIds: jest.fn(),
} as any;

const mockLoggerPort: jest.Mocked<LoggerPort> = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
} as any;

const mockEmailPort: jest.Mocked<EmailPort> = {
  sendEmail: jest.fn(),
  sendEmails: jest.fn(),
} as any;

const mockUserPort: jest.Mocked<UserPort> = {
  // Métodos necesarios para UserPort
} as any;

describe("FriendshipService", () => {
  let friendshipService: FriendshipService;

  beforeEach(() => {
    jest.clearAllMocks();
    friendshipService = new FriendshipService(
      mockFriendshipPort,
      mockLoggerPort,
      mockUserPort,
      mockEmailPort,
    );
  });

  it("debe crear una amistad correctamente", async () => {
    const friendshipRequest: FriendshipUsersIdsRequest = { user_id: 1, friend_id: 2 };
    mockFriendshipPort.createFriendship.mockResolvedValue({ success: true, data: true });

    const result = await friendshipService.createNewFriendship(friendshipRequest);

    expect(result.success).toBe(true);
    expect(result.data).toBe(true);
    expect(mockFriendshipPort.createFriendship).toHaveBeenCalledWith(friendshipRequest);
  });

  it("debe manejar errores al crear una amistad", async () => {
    const friendshipRequest: FriendshipUsersIdsRequest = { user_id: 1, friend_id: 2 };
    mockFriendshipPort.createFriendship.mockResolvedValue({ success: false, data: undefined });

    const result = await friendshipService.createNewFriendship(friendshipRequest);

    expect(result.success).toBe(false);
    expect(result.error?.message).toMatch(/Error al crear la amistad/);
  });

  it("debe eliminar una amistad correctamente", async () => {
    const friendshipRequest: FriendshipUsersIdsRequest = { user_id: 1, friend_id: 2 };
    mockFriendshipPort.deleteFriendship.mockResolvedValue({ success: true, data: true });

    const result = await friendshipService.deleteFriendship(friendshipRequest);

    expect(result.success).toBe(true);
    expect(result.data).toBe(true);
    expect(mockFriendshipPort.deleteFriendship).toHaveBeenCalledWith(friendshipRequest);
  });

  it("debe manejar errores al eliminar una amistad", async () => {
    const friendshipRequest: FriendshipUsersIdsRequest = { user_id: 1, friend_id: 2 };
    mockFriendshipPort.deleteFriendship.mockResolvedValue({ success: false, data: undefined });

    const result = await friendshipService.deleteFriendship(friendshipRequest);

    expect(result.success).toBe(false);
    expect(result.error?.message).toMatch(/Error al eliminar la amistad/);
  });
});
