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

describe("FriendshipService", () => {
  let friendshipService: FriendshipService;
  let mockFriendshipPort: jest.Mocked<FriendshipPort>;
  let mockUserPort: jest.Mocked<UserPort>;
  let mockEmailPort: jest.Mocked<EmailPort>;
  let mockLoggerPort: jest.Mocked<LoggerPort>;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Create fresh mocks for each test
    mockFriendshipPort = {
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

    mockUserPort = {
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

    mockEmailPort = {
      sendEmail: jest.fn().mockResolvedValue(true),
      sendEmails: jest.fn().mockResolvedValue(true),
    } as jest.Mocked<EmailPort>;

    mockLoggerPort = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      fatal: jest.fn(),
      appInfo: jest.fn(),
      appWarn: jest.fn(),
      appError: jest.fn(),
      appDebug: jest.fn(),
      appFatal: jest.fn(),
      setLevel: jest.fn(),
      child: jest.fn(),
    } as jest.Mocked<LoggerPort>;

    friendshipService = new FriendshipService(
      mockFriendshipPort,
      mockLoggerPort,
      mockUserPort,
      mockEmailPort,
    );
  });

  describe("createNewFriendship", () => {
    const validRequest: FriendshipUsersIdsRequest = {
      user_id: 1,
      friend_id: 2,
    };

    it("debe crear una nueva amistad exitosamente", async () => {
      // Configurar mocks para usuarios existentes
      mockUserPort.existsUserById.mockResolvedValueOnce(ApplicationResponse.success(true));
      mockUserPort.existsUserById.mockResolvedValueOnce(ApplicationResponse.success(true));

      // No existe relación previa
      mockFriendshipPort.getFriendshipByUsersIds.mockResolvedValue(
        ApplicationResponse.success(null),
      );

      // Crear amistad exitosamente
      mockFriendshipPort.createFriendship.mockResolvedValue(ApplicationResponse.success(true));

      // Ejecutar
      const result = await friendshipService.createNewFriendship(validRequest);

      // Verificar
      expect(result.success).toBe(true);
      expect(mockUserPort.existsUserById).toHaveBeenCalledTimes(2);
      expect(mockUserPort.existsUserById).toHaveBeenNthCalledWith(1, 1);
      expect(mockUserPort.existsUserById).toHaveBeenNthCalledWith(2, 2);
      expect(mockFriendshipPort.getFriendshipByUsersIds).toHaveBeenCalledWith(validRequest);
      expect(mockFriendshipPort.createFriendship).toHaveBeenCalledWith(validRequest);
    });

    it("debe fallar si el usuario remitente no existe", async () => {
      mockUserPort.existsUserById.mockResolvedValueOnce(ApplicationResponse.success(false));

      const result = await friendshipService.createNewFriendship(validRequest);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALUE_NOT_FOUND);
      expect(result.error?.message).toBe("El usuario remitente no existe");
      expect(mockUserPort.existsUserById).toHaveBeenCalledTimes(1);
    });

    it("debe fallar si el usuario destinatario no existe", async () => {
      mockUserPort.existsUserById.mockResolvedValueOnce(ApplicationResponse.success(true));
      mockUserPort.existsUserById.mockResolvedValueOnce(ApplicationResponse.success(false));

      const result = await friendshipService.createNewFriendship(validRequest);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.VALUE_NOT_FOUND);
      expect(result.error?.message).toBe("El usuario destinatario no existe");
      expect(mockUserPort.existsUserById).toHaveBeenCalledTimes(2);
    });

    it("debe manejar relación existente ya aceptada", async () => {
      mockUserPort.existsUserById.mockResolvedValueOnce(ApplicationResponse.success(true));
      mockUserPort.existsUserById.mockResolvedValueOnce(ApplicationResponse.success(true));

      const existingFriendship: Friendship = {
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

      const result = await friendshipService.createNewFriendship(validRequest);

      expect(result.success).toBe(true);
      expect(result.data).toBe("Los usuarios ya son amigos");
    });

    it("debe manejar errores del puerto", async () => {
      mockUserPort.existsUserById.mockRejectedValue(new Error("Database error"));

      const result = await friendshipService.createNewFriendship(validRequest);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.SERVER_ERROR);
      expect(mockLoggerPort.appWarn).toHaveBeenCalled();
    });
  });

  describe("getUserFriendships", () => {
    it("debe obtener las amistades de un usuario exitosamente", async () => {
      const userId = 1;
      const mockFriendshipsResponse = new FriendshipsResponse();
      mockFriendshipsResponse.friendships = [
        {
          id: 1,
          user_id: 1,
          friend_id: 2,
          status: FrienshipStatus.ACCEPTED,
        },
      ];

      mockFriendshipPort.getAllFriendshipsByUser.mockResolvedValue(
        ApplicationResponse.success(mockFriendshipsResponse),
      );

      const result = await friendshipService.getUserFriendships(userId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockFriendshipsResponse);
      expect(mockFriendshipPort.getAllFriendshipsByUser).toHaveBeenCalledWith(userId);
    });

    it("debe manejar errores al obtener amistades", async () => {
      const userId = 1;

      mockFriendshipPort.getAllFriendshipsByUser.mockRejectedValue(new Error("Database error"));

      const result = await friendshipService.getUserFriendships(userId);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCodes.SERVER_ERROR);
      expect(mockLoggerPort.appWarn).toHaveBeenCalled();
    });
  });
});
