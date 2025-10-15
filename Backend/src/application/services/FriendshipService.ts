import FriendshipPort from "../../domain/ports/data/social/FriendshipPort";
import LoggerPort from "../../domain/ports/utils/LoggerPort";
import UserPort from "../../domain/ports/data/seg/UserPort";
import { FrienshipStatus } from "../../domain/models/social/Friendship";
import FriendshipUsersIdsRequest from "../dto/requests/Friendship/FriendshipUsersIdsRequest";
import FriendshipsResponse from "../dto/responses/FriendshipsResponse";
import { ApplicationResponse } from "../shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../shared/errors/ApplicationError";
import EmailPort from "../../domain/ports/utils/EmailPort";

/**
 * Servicio para la gestión de amistades entre usuarios
 * Proporciona métodos para crear, aceptar, rechazar y consultar amistades
 */
export default class FriendshipService {
  private friendshipPort: FriendshipPort;
  private loggerPort: LoggerPort;
  private userPort: UserPort;
  private emailPort: EmailPort;

  /**
   * Constructor del servicio de amistades
   * @param friendshipPort Interfaz para acceder a las operaciones de amistad en la base de datos
   * @param logger Interfaz para el registro de logs del sistema
   * @param userPort Interfaz para acceder a las operaciones de usuario en la base de datos
   */
  constructor(
    friendshipPort: FriendshipPort,
    logger: LoggerPort,
    userPort: UserPort,
    emailPort: EmailPort,
  ) {
    this.friendshipPort = friendshipPort;
    this.loggerPort = logger;
    this.userPort = userPort;
    this.emailPort = emailPort;
  }

  /**
   * Crea una nueva solicitud de amistad entre dos usuarios
   * @param friendRequest Objeto con los IDs de usuario y amigo
   * @returns ApplicationResponse con un booleano que indica el éxito o fracaso de la operación, o mensajes específicos según el estado de una relación existente
   * @throws ApplicationResponse con el error en caso de fallo
   */
  async createNewFriendship(
    friendRequest: FriendshipUsersIdsRequest,
  ): Promise<ApplicationResponse<boolean | string>> {
    try {
      // Verificamos que ambos usuarios existan
      const userExists = await this.userPort.existsUserById(friendRequest.user_id);
      if (!userExists.success || !userExists.data) {
        return ApplicationResponse.failure<string>(
          new ApplicationError("El usuario remitente no existe", ErrorCodes.VALUE_NOT_FOUND),
        );
      }

      const friendExists = await this.userPort.existsUserById(friendRequest.friend_id);
      if (!friendExists.success || !friendExists.data) {
        return ApplicationResponse.failure<string>(
          new ApplicationError("El usuario destinatario no existe", ErrorCodes.VALUE_NOT_FOUND),
        );
      }

      // Verificamos si ya existe una relación entre estos usuarios (en cualquier dirección)
      const existingRelationshipResponse =
        await this.friendshipPort.getFriendshipByUsersIds(friendRequest);

      // Si la consulta fue exitosa y hay una relación existente
      if (existingRelationshipResponse.success && existingRelationshipResponse.data) {
        const existingRelationship = existingRelationshipResponse.data;

        // Verificamos el estado de la relación existente
        switch (existingRelationship.status) {
          case FrienshipStatus.ACCEPTED:
            return ApplicationResponse.success<string>("Los usuarios ya son amigos");

          case FrienshipStatus.PENDING:
            // Verificamos si el usuario actual es quien recibió la solicitud
            if (existingRelationship.friend_id === friendRequest.user_id) {
              return ApplicationResponse.success<string>(
                "El otro usuario ya te envió una solicitud de amistad pendiente. Puedes aceptarla o rechazarla.",
              );
            } else {
              return ApplicationResponse.success<string>(
                "Ya has enviado una solicitud de amistad a este usuario y está pendiente de respuesta.",
              );
            }

          case FrienshipStatus.REJECTED:
            // Si está rechazada, eliminamos la relación existente y creamos una nueva
            const deleteResponse = await this.friendshipPort.removeFriendshipById(
              existingRelationship.id,
            );
            if (!deleteResponse.success) {
              this.loggerPort.appWarn(deleteResponse);
              return ApplicationResponse.failure<boolean>(
                new ApplicationError(
                  "Error al eliminar la relación rechazada anterior",
                  ErrorCodes.SERVER_ERROR,
                ),
              );
            }
            break;
        }
      }

      // Creamos la nueva solicitud de amistad
      const response = await this.friendshipPort.createFriendship(friendRequest);
      if (!response.success) {
        this.loggerPort.appWarn(response);
        return response;
      }

      // Si todo fue exitoso
      return ApplicationResponse.success<boolean>(true);
    } catch (error) {
      const errorResponse = ApplicationResponse.failure<boolean>(
        new ApplicationError("Error al crear la solicitud de amistad", ErrorCodes.SERVER_ERROR),
      );
      this.loggerPort.appWarn(errorResponse);
      return errorResponse;
    }
  }

  /**
   * Acepta una solicitud de amistad pendiente
   * @param id ID de la solicitud de amistad a aceptar
   * @returns ApplicationResponse con mensaje de éxito, mensaje informativo o error
   * @throws Error en caso de fallo en la operación
   */
  async aceptFriendship(id: number): Promise<ApplicationResponse<string | void>> {
    try {
      // Primero verificamos si existe la solicitud y su estado actual
      const friendshipResponse = await this.friendshipPort.getFriendshipById(id);

      if (!friendshipResponse.success) {
        this.loggerPort.appWarn(friendshipResponse);
        return ApplicationResponse.failure<string>(
          new ApplicationError(
            "No se encontró la solicitud de amistad",
            ErrorCodes.VALUE_NOT_FOUND,
          ),
        );
      }

      const friendship = friendshipResponse.data;

      // Verificamos el estado actual de la solicitud
      if (!friendship) {
        return ApplicationResponse.failure<string>(
          new ApplicationError(
            "No se encontró la solicitud de amistad",
            ErrorCodes.VALUE_NOT_FOUND,
          ),
        );
      }

      if (friendship.status === FrienshipStatus.ACCEPTED) {
        return ApplicationResponse.success<string>(
          "Esta solicitud de amistad ya fue aceptada previamente",
        );
      }

      if (friendship.status === FrienshipStatus.REJECTED) {
        return ApplicationResponse.success<string>(
          "Esta solicitud de amistad ya fue rechazada previamente",
        );
      }

      // Si está pendiente, procedemos con la aceptación
      const response = await this.friendshipPort.aproveFrienshipRequest(id);
      if (response.success) {
        return ApplicationResponse.success<string>("Solicitud de amistad aceptada correctamente");
      }

      this.loggerPort.appWarn(response);
      return response;
    } catch (error) {
      const errorResponse = ApplicationResponse.failure<string>(
        new ApplicationError("Error al aceptar la solicitud de amistad", ErrorCodes.SERVER_ERROR),
      );
      this.loggerPort.appWarn(errorResponse);
      return errorResponse;
    }
  }

  /**
   * Rechaza una solicitud de amistad pendiente
   * @param id ID de la solicitud de amistad a rechazar
   * @returns ApplicationResponse con mensaje de éxito, mensaje informativo o error
   * @throws Error en caso de fallo en la operación
   */
  async rejectFriendship(id: number): Promise<ApplicationResponse<string | void>> {
    try {
      // Primero verificamos si existe la solicitud y su estado actual
      const friendshipResponse = await this.friendshipPort.getFriendshipById(id);

      if (!friendshipResponse.success) {
        this.loggerPort.appWarn(friendshipResponse);
        return ApplicationResponse.failure<string>(
          new ApplicationError(
            "No se encontró la solicitud de amistad",
            ErrorCodes.VALUE_NOT_FOUND,
          ),
        );
      }

      const friendship = friendshipResponse.data;

      // Verificamos el estado actual de la solicitud
      if (!friendship) {
        return ApplicationResponse.failure<string>(
          new ApplicationError(
            "No se encontró la solicitud de amistad",
            ErrorCodes.VALUE_NOT_FOUND,
          ),
        );
      }

      if (friendship.status === FrienshipStatus.ACCEPTED) {
        return ApplicationResponse.success<string>(
          "Esta solicitud de amistad ya fue aceptada previamente, no se puede rechazar",
        );
      }

      if (friendship.status === FrienshipStatus.REJECTED) {
        return ApplicationResponse.success<string>(
          "Esta solicitud de amistad ya fue rechazada previamente",
        );
      }

      // Si está pendiente, procedemos con el rechazo
      const response = await this.friendshipPort.rejectFrienshipRequest(id);
      if (response.success) {
        return ApplicationResponse.success<string>("Solicitud de amistad rechazada correctamente");
      }

      this.loggerPort.appWarn(response);
      return response;
    } catch (error) {
      const errorResponse = ApplicationResponse.failure<string>(
        new ApplicationError("Error al rechazar la solicitud de amistad", ErrorCodes.SERVER_ERROR),
      );
      this.loggerPort.appWarn(errorResponse);
      return errorResponse;
    }
  }

  /**
   * Obtiene todas las amistades de un usuario específico
   * @param id ID del usuario cuyas amistades se quieren obtener
   * @returns ApplicationResponse con la lista de amistades del usuario
   * @throws Error en caso de fallo en la operación
   */
  async getUserFriendships(id: number): Promise<ApplicationResponse<FriendshipsResponse>> {
    try {
      const response = await this.friendshipPort.getAllFriendshipsByUser(id);
      if (response.success) {
        return response;
      } else {
        this.loggerPort.appWarn(response);
        return response;
      }
    } catch (error) {
      const errorResponse = ApplicationResponse.failure<FriendshipsResponse>(
        new ApplicationError("Error al obtener las amistades del usuario", ErrorCodes.SERVER_ERROR),
      );
      this.loggerPort.appWarn(errorResponse);
      return errorResponse;
    }
  }

  async getCommonFriendships(
    reqId: number,
    objId: number,
  ): Promise<ApplicationResponse<FriendshipsResponse>> {
    try {
      const response = await this.friendshipPort.getAllCommonFriendships({
        user_id: reqId,
        friend_id: objId,
      });

      console.log(response.error);

      return response;
    } catch (error) {
      return ApplicationResponse.failure(
        new ApplicationError("Ocurrio un error al buscar las amistades", ErrorCodes.SERVER_ERROR),
      );
    }
  }

  /**
   * Elimina una amistad existente entre dos usuarios
   * @param friendRequest Objeto con los IDs de usuario y amigo
   * @returns ApplicationResponse vacío con éxito o fracaso de la operación
   * @throws Error en caso de fallo en la operación
   */
  async deleteFriendship(
    friendRequest: FriendshipUsersIdsRequest,
  ): Promise<ApplicationResponse<void>> {
    try {
      const response = await this.friendshipPort.removeFriendshipByUsersIds(friendRequest);
      if (response.success) {
        return response;
      }
      this.loggerPort.appWarn(response);
      return response;
    } catch (error) {
      const errorResponse = ApplicationResponse.failure<void>(
        new ApplicationError("Error al eliminar la amistad", ErrorCodes.SERVER_ERROR),
      );
      this.loggerPort.appWarn(errorResponse);
      return errorResponse;
    }
  }

  /**
   * Elimina una amistad por su ID
   * @param id ID de la amistad a eliminar
   * @returns ApplicationResponse vacío con éxito o fracaso de la operación
   * @throws Error en caso de fallo en la operación
   */
  async deleteFriendshipById(id: number): Promise<ApplicationResponse<void>> {
    try {
      const response = await this.friendshipPort.removeFriendshipById(id);
      if (response.success) {
        return response;
      }
      this.loggerPort.appWarn(response);
      return response;
    } catch (error) {
      const errorResponse = ApplicationResponse.failure<void>(
        new ApplicationError("Error al eliminar la amistad por ID", ErrorCodes.SERVER_ERROR),
      );
      this.loggerPort.appWarn(errorResponse);
      return errorResponse;
    }
  }

  /**
   * Obtiene una amistad por su ID (expuesto para validaciones en controller)
   */
  async getFriendshipById(id: number): Promise<ApplicationResponse<any>> {
    try {
      const response = await this.friendshipPort.getFriendshipById(id);
      if (response.success) return response;
      this.loggerPort.appWarn(response);
      return response;
    } catch (error) {
      const errorResponse = ApplicationResponse.failure<any>(
        new ApplicationError("Error al obtener la amistad por ID", ErrorCodes.SERVER_ERROR),
      );
      this.loggerPort.appWarn(errorResponse);
      return errorResponse;
    }
  }
}
