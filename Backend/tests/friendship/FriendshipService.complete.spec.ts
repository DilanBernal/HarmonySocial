import FriendshipService from "../../src/application/services/FriendshipService";
import FriendshipPort from "../../src/domain/ports/data/FriendshipPort";
import UserPort from "../../src/domain/ports/data/UserPort";
import EmailPort from "../../src/domain/ports/utils/EmailPort";
import LoggerPort from "../../src/domain/ports/utils/LoggerPort";
import Friendship, { FrienshipStatus } from "../../src/domain/models/Friendship";
import FriendshipUsersIdsRequest from "../../src/application/dto/requests/Friendship/FriendshipUsersIdsRequest";
import FriendshipsResponse from "../../src/application/dto/responses/FriendshipsResponse";
import { ApplicationResponse } from "../../src/application/shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../../src/application/shared/errors/ApplicationError";

// Mocks completos de todos los puertos
const mockFriendshipPort: jest.Mocked<FriendshipPort> = {
  createFriendship: jest.fn(),
  updateFriendship: jest.fn(),
  removeFriendshipById: jest.fn(),
  removeFriendshipByUsersIds: jest.fn(),
  getFriendshipById: jest.fn(),
  getFriendshipByUsersIds: jest.fn(),
  getAllFriendshipsByUser: jest.fn(),
  aproveFrienshipRequest: jest.fn(),
  rejectFrienshipRequest: jest.fn(),
} as any;

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

describe("FriendshipService", () => {
  let friendshipService: FriendshipService;

  // Datos de prueba comunes
  const mockFriendshipRequest: FriendshipUsersIdsRequest = {
    user_id: 1,
    friend_id: 2,
  };

  const mockFriendship: Friendship = {
    id: 1,
    user_id: 1,
    friend_id: 2,
    status: FrienshipStatus.PENDING,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  };

  const mockFriendshipsResponse: FriendshipsResponse = {
    friendships: [mockFriendship],
  };

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
    it("debe crear una nueva solicitud de amistad exitosamente", async () => {
      // Configurar mocks para escenario exitoso
      mockUserPort.existsUserById
        .mockResolvedValueOnce(ApplicationResponse.success(true)) // usuario remitente existe
        .mockResolvedValueOnce(ApplicationResponse.success(true)); // usuario destinatario existe
      mockFriendshipPort.getFriendshipByUsersIds.mockResolvedValue(
        ApplicationResponse.success(undefined as any), // no existe relación previa
      );
      mockFriendshipPort.createFriendship.mockResolvedValue(ApplicationResponse.success(true));

      // Ejecutar
      const result = await friendshipService.createNewFriendship(mockFriendshipRequest);

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
      expect(mockUserPort.existsUserById).toHaveBeenCalledWith(1);
      expect(mockUserPort.existsUserById).toHaveBeenCalledWith(2);
      expect(mockFriendshipPort.getFriendshipByUsersIds).toHaveBeenCalledWith(
        mockFriendshipRequest,
      );
      expect(mockFriendshipPort.createFriendship).toHaveBeenCalledWith(mockFriendshipRequest);
    });

    it("debe fallar si el usuario remitente no existe", async () => {
      // Configurar mock para usuario remitente no existente
      mockUserPort.existsUserById.mockResolvedValueOnce(ApplicationResponse.success(false));

      // Ejecutar
      const result = await friendshipService.createNewFriendship(mockFriendshipRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALUE_NOT_FOUND);
      expect(result.error?.message).toBe("El usuario remitente no existe");
      expect(mockFriendshipPort.createFriendship).not.toHaveBeenCalled();
    });

    it("debe fallar si el usuario destinatario no existe", async () => {
      // Configurar mocks
      mockUserPort.existsUserById
        .mockResolvedValueOnce(ApplicationResponse.success(true)) // remitente existe
        .mockResolvedValueOnce(ApplicationResponse.success(false)); // destinatario no existe

      // Ejecutar
      const result = await friendshipService.createNewFriendship(mockFriendshipRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALUE_NOT_FOUND);
      expect(result.error?.message).toBe("El usuario destinatario no existe");
      expect(mockFriendshipPort.createFriendship).not.toHaveBeenCalled();
    });

    it("debe retornar mensaje si los usuarios ya son amigos", async () => {
      // Configurar mocks
      mockUserPort.existsUserById
        .mockResolvedValueOnce(ApplicationResponse.success(true))
        .mockResolvedValueOnce(ApplicationResponse.success(true));

      const acceptedFriendship = { ...mockFriendship, status: FrienshipStatus.ACCEPTED };
      mockFriendshipPort.getFriendshipByUsersIds.mockResolvedValue(
        ApplicationResponse.success(acceptedFriendship),
      );

      // Ejecutar
      const result = await friendshipService.createNewFriendship(mockFriendshipRequest);

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toBe("Los usuarios ya son amigos");
      expect(mockFriendshipPort.createFriendship).not.toHaveBeenCalled();
    });

    it("debe retornar mensaje si ya hay una solicitud pendiente del mismo usuario", async () => {
      // Configurar mocks
      mockUserPort.existsUserById
        .mockResolvedValueOnce(ApplicationResponse.success(true))
        .mockResolvedValueOnce(ApplicationResponse.success(true));

      const pendingFriendship = { ...mockFriendship, status: FrienshipStatus.PENDING };
      mockFriendshipPort.getFriendshipByUsersIds.mockResolvedValue(
        ApplicationResponse.success(pendingFriendship),
      );

      // Ejecutar
      const result = await friendshipService.createNewFriendship(mockFriendshipRequest);

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toBe(
        "Ya has enviado una solicitud de amistad a este usuario y está pendiente de respuesta.",
      );
      expect(mockFriendshipPort.createFriendship).not.toHaveBeenCalled();
    });

    it("debe eliminar relación rechazada y crear nueva solicitud", async () => {
      // Configurar mocks
      mockUserPort.existsUserById
        .mockResolvedValueOnce(ApplicationResponse.success(true))
        .mockResolvedValueOnce(ApplicationResponse.success(true));

      const rejectedFriendship = { ...mockFriendship, status: FrienshipStatus.REJECTED };
      mockFriendshipPort.getFriendshipByUsersIds.mockResolvedValue(
        ApplicationResponse.success(rejectedFriendship),
      );
      mockFriendshipPort.removeFriendshipById.mockResolvedValue(ApplicationResponse.emptySuccess());
      mockFriendshipPort.createFriendship.mockResolvedValue(ApplicationResponse.success(true));

      // Ejecutar
      const result = await friendshipService.createNewFriendship(mockFriendshipRequest);

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
      expect(mockFriendshipPort.removeFriendshipById).toHaveBeenCalledWith(rejectedFriendship.id);
      expect(mockFriendshipPort.createFriendship).toHaveBeenCalledWith(mockFriendshipRequest);
    });

    it("debe manejar errores durante la creación", async () => {
      // Configurar mocks para simular error
      mockUserPort.existsUserById.mockRejectedValue(new Error("Database error"));

      // Ejecutar
      const result = await friendshipService.createNewFriendship(mockFriendshipRequest);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.SERVER_ERROR);
      expect(result.error?.message).toBe("Error al crear la solicitud de amistad");
      expect(mockLoggerPort.appWarn).toHaveBeenCalled();
    });
  });

  describe("aceptFriendship", () => {
    it("debe aceptar una solicitud de amistad exitosamente", async () => {
      // Configurar mocks
      mockFriendshipPort.getFriendshipById.mockResolvedValue(
        ApplicationResponse.success(mockFriendship),
      );
      mockFriendshipPort.aproveFrienshipRequest.mockResolvedValue(
        ApplicationResponse.emptySuccess(),
      );

      // Ejecutar
      const result = await friendshipService.aceptFriendship(1);

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toBe("Solicitud de amistad aceptada correctamente");
      expect(mockFriendshipPort.getFriendshipById).toHaveBeenCalledWith(1);
      expect(mockFriendshipPort.aproveFrienshipRequest).toHaveBeenCalledWith(1);
    });

    it("debe fallar si la solicitud no existe", async () => {
      // Configurar mock para solicitud no encontrada
      mockFriendshipPort.getFriendshipById.mockResolvedValue(
        ApplicationResponse.failure(new ApplicationError("Not found", ErrorCodes.VALUE_NOT_FOUND)),
      );

      // Ejecutar
      const result = await friendshipService.aceptFriendship(999);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALUE_NOT_FOUND);
      expect(result.error?.message).toBe("No se encontró la solicitud de amistad");
      expect(mockFriendshipPort.aproveFrienshipRequest).not.toHaveBeenCalled();
    });

    it("debe retornar mensaje si la solicitud ya fue aceptada", async () => {
      // Configurar mock con solicitud ya aceptada
      const acceptedFriendship = { ...mockFriendship, status: FrienshipStatus.ACCEPTED };
      mockFriendshipPort.getFriendshipById.mockResolvedValue(
        ApplicationResponse.success(acceptedFriendship),
      );

      // Ejecutar
      const result = await friendshipService.aceptFriendship(1);

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toBe("Esta solicitud de amistad ya fue aceptada previamente");
      expect(mockFriendshipPort.aproveFrienshipRequest).not.toHaveBeenCalled();
    });

    it("debe manejar errores durante la aceptación", async () => {
      // Configurar mock para simular error
      mockFriendshipPort.getFriendshipById.mockRejectedValue(new Error("Database error"));

      // Ejecutar
      const result = await friendshipService.aceptFriendship(1);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.SERVER_ERROR);
      expect(result.error?.message).toBe("Error al aceptar la solicitud de amistad");
      expect(mockLoggerPort.appWarn).toHaveBeenCalled();
    });
  });

  describe("getUserFriendships", () => {
    it("debe obtener las amistades de un usuario exitosamente", async () => {
      // Configurar mock
      mockFriendshipPort.getAllFriendshipsByUser.mockResolvedValue(
        ApplicationResponse.success(mockFriendshipsResponse),
      );

      // Ejecutar
      const result = await friendshipService.getUserFriendships(1);

      // Verificar
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockFriendshipsResponse);
      expect(mockFriendshipPort.getAllFriendshipsByUser).toHaveBeenCalledWith(1);
    });

    it("debe manejar errores al obtener amistades", async () => {
      // Configurar mock para simular error
      mockFriendshipPort.getAllFriendshipsByUser.mockRejectedValue(new Error("Database error"));

      // Ejecutar
      const result = await friendshipService.getUserFriendships(1);

      // Verificar
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.SERVER_ERROR);
      expect(result.error?.message).toBe("Error al obtener las amistades del usuario");
      expect(mockLoggerPort.appWarn).toHaveBeenCalled();
    });
  });
});
