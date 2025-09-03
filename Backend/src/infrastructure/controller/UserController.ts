import UserService from "../../application/services/UserService";
import AuthService from "../../application/services/AuthService";
import { Request, Response } from "express";
import User from "../../domain/models/User";
import { EntityNotFoundError } from "typeorm";
import { ErrorCodes } from "../../application/shared/errors/ApplicationError";
import { ApplicationResponse } from "../../application/shared/ApplicationReponse";
import RegisterRequest from "../../application/dto/requests/RegisterRequest";
import LoginRequest from "../../application/dto/requests/LoginRequest";
import UpdateUserRequest from "../../application/dto/requests/UpdateUserRequest";
import ForgotPasswordRequest from "../../application/dto/requests/ForgotPasswordRequest";
import ResetPasswordRequest from "../../application/dto/requests/ResetPasswordRequest";
import VerifyEmailRequest from "../../application/dto/requests/VerifyEmailRequest";

export default class UserController {
  private userService: UserService;
  private authService: AuthService;

  constructor(userService: UserService, authService: AuthService) {
    this.userService = userService;
    this.authService = authService;
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

  async loginUser(req: Request, res: Response) {
    const loginRequest: LoginRequest = req.body;
    try {
      const authResponse = await this.authService.login(loginRequest);

      if (authResponse.success && authResponse.data) {
        return res.status(200).json({
          message: "Login exitoso",
          data: authResponse.data,
        });
      } else {
        if (authResponse.error) {
          switch (authResponse.error.code) {
            case ErrorCodes.INVALID_CREDENTIALS:
              return res.status(401).json({ message: "Credenciales inválidas" });
            case ErrorCodes.VALIDATION_ERROR:
              return res.status(400).json({
                message: authResponse.error.message,
                details: authResponse.error.details,
              });
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
            case ErrorCodes.INVALID_CREDENTIALS:
              return res.status(401).json({ message: "Credenciales inválidas" });
            case ErrorCodes.VALIDATION_ERROR:
              return res.status(400).json({
                message: appError.message,
                details: appError.details,
              });
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

  async getAllUsers(req: Request, res: Response) {
    try {
      const usersResponse = await this.userService.getAllUsers();

      if (usersResponse.success) {
        return res.status(200).json({
          message: "Usuarios obtenidos exitosamente",
          data: usersResponse.data,
        });
      } else {
        if (usersResponse.error) {
          switch (usersResponse.error.code) {
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
      if (error instanceof Error) {
        return res
          .status(500)
          .json({ message: "Ocurrió un error inesperado", details: error.message });
      }
      return res.status(500).json({ message: "Error desconocido" });
    }
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const userResponse = await this.userService.getUserById(Number(id));

      if (userResponse.success) {
        return res.status(200).json({
          message: "Usuario obtenido exitosamente",
          data: userResponse.data,
        });
      } else {
        if (userResponse.error) {
          switch (userResponse.error.code) {
            case ErrorCodes.VALUE_NOT_FOUND:
              return res.status(404).json({ message: "Usuario no encontrado" });
            case ErrorCodes.VALIDATION_ERROR:
              return res.status(400).json({ message: userResponse.error.message });
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
      if (error instanceof Error) {
        return res
          .status(500)
          .json({ message: "Ocurrió un error inesperado", details: error.message });
      }
      return res.status(500).json({ message: "Error desconocido" });
    }
  }

  async getUserByEmail(req: Request, res: Response) {
    const { email } = req.params;
    try {
      const userResponse = await this.userService.getUserByEmail(email);

      if (userResponse.success) {
        return res.status(200).json({
          message: "Usuario obtenido exitosamente",
          data: userResponse.data,
        });
      } else {
        if (userResponse.error) {
          switch (userResponse.error.code) {
            case ErrorCodes.VALUE_NOT_FOUND:
              return res.status(404).json({ message: "Usuario no encontrado" });
            case ErrorCodes.VALIDATION_ERROR:
              return res.status(400).json({ message: userResponse.error.message });
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
      if (error instanceof Error) {
        return res
          .status(500)
          .json({ message: "Ocurrió un error inesperado", details: error.message });
      }
      return res.status(500).json({ message: "Error desconocido" });
    }
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const updateRequest: UpdateUserRequest = req.body;

    try {
      const updateResponse = await this.userService.updateUser(Number(id), updateRequest);

      if (updateResponse.success) {
        return res.status(200).json({
          message: "Usuario actualizado exitosamente",
        });
      } else {
        if (updateResponse.error) {
          switch (updateResponse.error.code) {
            case ErrorCodes.VALUE_NOT_FOUND:
              return res.status(404).json({ message: "Usuario no encontrado" });
            case ErrorCodes.USER_ALREADY_EXISTS:
              return res.status(409).json({ message: "El email o username ya están en uso" });
            case ErrorCodes.VALIDATION_ERROR:
              return res.status(400).json({
                message: updateResponse.error.message,
                details: updateResponse.error.details,
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
      if (error instanceof Error) {
        return res
          .status(500)
          .json({ message: "Ocurrió un error inesperado", details: error.message });
      }
      return res.status(500).json({ message: "Error desconocido" });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    const forgotRequest: ForgotPasswordRequest = req.body;

    try {
      const response = await this.userService.forgotPassword(forgotRequest);

      if (response.success) {
        return res.status(200).json({
          message: "Si el email existe, se ha enviado un enlace de recuperación",
        });
      } else {
        if (response.error) {
          switch (response.error.code) {
            case ErrorCodes.VALIDATION_ERROR:
              return res.status(400).json({
                message: response.error.message,
                details: response.error.details,
              });
            case ErrorCodes.BUSINESS_RULE_VIOLATION:
              return res.status(400).json({ message: response.error.message });
            case ErrorCodes.SERVER_ERROR:
              return res.status(500).json({ message: "Error interno del servidor" });
            default:
              return res.status(500).json({ message: "Error desconocido" });
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res
          .status(500)
          .json({ message: "Ocurrió un error inesperado", details: error.message });
      }
      return res.status(500).json({ message: "Error desconocido" });
    }
  }

  async resetPassword(req: Request, res: Response) {
    const resetRequest: ResetPasswordRequest = req.body;

    try {
      const response = await this.userService.resetPassword(resetRequest);

      if (response.success) {
        return res.status(200).json({
          message: "Contraseña restablecida exitosamente",
        });
      } else {
        if (response.error) {
          switch (response.error.code) {
            case ErrorCodes.VALIDATION_ERROR:
              return res.status(400).json({
                message: response.error.message,
                details: response.error.details,
              });
            case ErrorCodes.SERVER_ERROR:
              return res.status(500).json({ message: "Error interno del servidor" });
            default:
              return res.status(500).json({ message: "Error desconocido" });
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res
          .status(500)
          .json({ message: "Ocurrió un error inesperado", details: error.message });
      }
      return res.status(500).json({ message: "Error desconocido" });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    const verifyRequest: VerifyEmailRequest = req.body;

    try {
      const response = await this.userService.verifyEmail(verifyRequest);

      if (response.success) {
        return res.status(200).json({
          message: "Email verificado exitosamente. Tu cuenta ha sido activada.",
        });
      } else {
        if (response.error) {
          switch (response.error.code) {
            case ErrorCodes.VALIDATION_ERROR:
              return res.status(400).json({
                message: response.error.message,
                details: response.error.details,
              });
            case ErrorCodes.SERVER_ERROR:
              return res.status(500).json({ message: "Error interno del servidor" });
            default:
              return res.status(500).json({ message: "Error desconocido" });
          }
        }
      }
    } catch (error: unknown) {
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
