import { Request, Response } from "express";
import FriendshipService from "../../application/services/FriendshipService";
import { ApplicationResponse } from "../../application/shared/ApplicationReponse";

export default class FriendshipController {
  constructor(private friendshipService: FriendshipService) {}

  /**
   * Crea una nueva solicitud de amistad entre dos usuarios
   * @param req Request con los IDs de usuario y amigo en el body
   * @param res Response con el resultado de la operación
   * @returns Respuesta HTTP con estado 201 si se creó correctamente, 200 si ya existe relación, 400 si hubo error
   */
  async newFriendship(req: Request, res: Response) {
    try {
      if (req.body.user_id === req.body.friend_id) {
        res.status(422).send("El usuario no se puede agregar a si mismo como amigo");
      }
      const servResponse = await this.friendshipService.createNewFriendship(req.body);
      if (!servResponse!.success) {
        return res.status(400).json(servResponse?.error);
      }

      // Si la respuesta es un string, es un mensaje informativo (ya son amigos o hay solicitud pendiente)
      if (typeof servResponse.data === "string") {
        return res.status(200).json({
          message: servResponse.data,
        });
      }

      // Si no es un string, es un booleano que indica éxito en la creación de la solicitud
      return res.status(201).json({
        message: "Solicitud de amistad creada correctamente",
        data: servResponse?.data,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({
          message: "Ocurrió un error inesperado",
          details: error.message,
        });
      }
      return res.status(500).json({ message: "Error desconocido" });
    }
  }

  /**
   * Acepta una solicitud de amistad pendiente
   * @param req Request con el ID de la amistad en los parámetros
   * @param res Response con el resultado de la operación
   * @returns Respuesta HTTP con estado 200 si se aceptó correctamente o hay un mensaje informativo, 400 si hubo error
   */
  async acceptFriendship(req: Request, res: Response) {
    const { id } = req.query;
    try {
      const servResponse = await this.friendshipService.aceptFriendship(Number(id));
      if (!servResponse.success) {
        return res.status(400).json(servResponse.error);
      }

      // Si la respuesta contiene un mensaje informativo (string)
      if (typeof servResponse.data === "string") {
        return res.status(200).json({
          message: servResponse.data,
        });
      }

      return res.status(200).json({
        message: "Solicitud de amistad aceptada correctamente",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({
          message: "Ocurrió un error inesperado",
          details: error.message,
        });
      }
      return res.status(500).json({ message: "Error desconocido" });
    }
  }

  /**
   * Rechaza una solicitud de amistad pendiente
   * @param req Request con el ID de la amistad en los parámetros
   * @param res Response con el resultado de la operación
   * @returns Respuesta HTTP con estado 200 si se rechazó correctamente o hay un mensaje informativo, 400 si hubo error
   */
  async rejectFriendship(req: Request, res: Response) {
    const { id } = req.query;
    try {
      const servResponse = await this.friendshipService.rejectFriendship(Number(id));
      if (!servResponse.success) {
        return res.status(400).json(servResponse.error);
      }

      // Si la respuesta contiene un mensaje informativo (string)
      if (typeof servResponse.data === "string") {
        return res.status(200).json({
          message: servResponse.data,
        });
      }

      return res.status(200).json({
        message: "Solicitud de amistad rechazada correctamente",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({
          message: "Ocurrió un error inesperado",
          details: error.message,
        });
      }
      return res.status(500).json({ message: "Error desconocido" });
    }
  }

  /**
   * Obtiene todas las amistades de un usuario específico
   * @param req Request con el ID del usuario en los parámetros
   * @param res Response con el resultado de la operación
   * @returns Respuesta HTTP con estado 200 y la lista de amistades, 400 si hubo error
   */
  async getUserFriendships(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const servResponse = await this.friendshipService.getUserFriendships(Number(id));
      if (!servResponse.success) {
        return res.status(400).json(servResponse.error);
      }
      return res.status(200).json({
        message: "Amistades obtenidas correctamente",
        data: servResponse.data,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({
          message: "Ocurrió un error inesperado",
          details: error.message,
        });
      }
      return res.status(500).json({ message: "Error desconocido" });
    }
  }

  /**
   * Elimina una amistad por su ID
   * @param req Request con el ID de la amistad en los parámetros
   * @param res Response con el resultado de la operación
   * @returns Respuesta HTTP con estado 200 si se eliminó correctamente, 400 si hubo error
   */
  async deleteFriendshipById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const servResponse = await this.friendshipService.deleteFriendshipById(Number(id));
      if (!servResponse.success) {
        return res.status(400).json(servResponse.error);
      }
      return res.status(200).json({
        message: "Amistad eliminada correctamente",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({
          message: "Ocurrió un error inesperado",
          details: error.message,
        });
      }
      return res.status(500).json({ message: "Error desconocido" });
    }
  }

  /**
   * Elimina una amistad por los IDs de los usuarios
   * @param req Request con los IDs de usuario y amigo en el body
   * @param res Response con el resultado de la operación
   * @returns Respuesta HTTP con estado 200 si se eliminó correctamente, 400 si hubo error
   */
  async deleteFriendship(req: Request, res: Response) {
    try {
      const servResponse = await this.friendshipService.deleteFriendship(req.body);
      if (!servResponse.success) {
        return res.status(400).json(servResponse.error);
      }
      return res.status(200).json({
        message: "Amistad eliminada correctamente",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({
          message: "Ocurrió un error inesperado",
          details: error.message,
        });
      }
      return res.status(500).json({ message: "Error desconocido" });
    }
  }
}
