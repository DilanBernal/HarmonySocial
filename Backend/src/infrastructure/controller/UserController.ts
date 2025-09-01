import UserService from "../../application/services/UserService";
import { Request, Response } from "express";
import User from "../../domain/models/User";
import { EntityNotFoundError } from "typeorm";
import { ErrorCodes } from "../../application/shared/errors/ApplicationError";
import { ApplicationResponse } from "../../application/shared/ApplicationReponse";
import RegisterRequest from "../../application/dto/requests/RegisterRequest";

export default class UserController {
  private userService: UserService;

  constructor(app: UserService) {
    this.userService = app;
  }

  async registerUser(req: Request, res: Response) {
    const regRequest: RegisterRequest = req.body;
    try {
      const user: Omit<User, "id" | "status" | "created_at" | "updated_at" | "learning_points"> = {
        full_name: regRequest.full_name.trim(),
        email: regRequest.email.trim(),
        username: regRequest.username.trim(),
        password: regRequest.password.trim(),
        profile_image: regRequest.profile_image.trim(),
        favorite_instrument: regRequest.favorite_instrument,
        is_artist: false,
      };

      const userResponse = await this.userService.registerUser(user);
      if (userResponse.success) {
        return res.status(201).json({
          userId: userResponse.data,
        });
      } else {
        if (userResponse.error) {
          switch (userResponse.error.code) {
            case ErrorCodes.USER_ALREADY_EXISTS:
              return res.status(409).json({ message: "El usuario ya existe" });
            case ErrorCodes.VALIDATION_ERROR:
              return res.status(406).json({
                message: userResponse.error.message,
                details: userResponse.error.details,
              });
            case ErrorCodes.DATABASE_ERROR:
              return res.status(500).json({ message: "Error en la base de datos" });
            case ErrorCodes.SERVER_ERROR:
              return res.status(500).json({ message: "Error interno del servidor" });
            default:
              return res.status(500).json({ message: "Error desconocido" });
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof ApplicationResponse && (error as ApplicationResponse<any>).error) {
        const appError = (error as ApplicationResponse<any>).error;
        if (appError) {
          switch (appError.code) {
            case ErrorCodes.USER_ALREADY_EXISTS:
              return res.status(409).json({ message: "El usuario ya existe" });
            case ErrorCodes.VALIDATION_ERROR:
              return res.status(400).json({
                message: appError.message,
                details: appError.details,
              });
            case ErrorCodes.DATABASE_ERROR:
              return res.status(500).json({ message: "Error en la base de datos" });
            case ErrorCodes.SERVER_ERROR:
              return res.status(500).json({ message: "Error interno del servidor" });
            default:
              return res.status(500).json({ message: "Error desconocido" });
          }
        }
      }
      if (error instanceof Error) {
        return res
          .status(500)
          .json({ message: "Ocurrió un error inesperado", details: error.message });
      }
      return res.status(500).json({ message: "Error desconocido" });
    }
  }

  async logicalDeleteUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const response = await this.userService.deleteUser(Number(id));
      if (response.success) {
        return res.status(204).json({ message: "Se eliminó correctamente al usuario" });
      } else {
        if (response.error) {
          switch (response.error.code) {
            case ErrorCodes.VALUE_NOT_FOUND:
              return res.status(404).json({ message: "No se encontró al usuario" });
            case ErrorCodes.DATABASE_ERROR:
              return res.status(500).json({ message: "Error en la base de datos" });
            case ErrorCodes.SERVER_ERROR:
              return res.status(500).json({ message: "Error interno del servidor" });
            default:
              return res
                .status(500)
                .json({ message: "No se pudo eliminar correctamente al usuario" });
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof ApplicationResponse && (error as ApplicationResponse<any>).error) {
        const appError = (error as ApplicationResponse<any>).error;
        if (appError) {
          switch (appError.code) {
            case ErrorCodes.VALUE_NOT_FOUND:
              return res.status(404).json({ message: "No se encontró al usuario" });
            case ErrorCodes.DATABASE_ERROR:
              return res.status(500).json({ message: "Error en la base de datos" });
            case ErrorCodes.SERVER_ERROR:
              return res.status(500).json({ message: "Error interno del servidor" });
            default:
              return res.status(500).json({ message: "Error desconocido" });
          }
        }
      }
      if (error instanceof Error) {
        return res
          .status(500)
          .json({ message: "Ocurrió un error inesperado", details: error.message });
      }
      return res.status(500).json({ message: "Error desconocido" });
    }
  }
}
