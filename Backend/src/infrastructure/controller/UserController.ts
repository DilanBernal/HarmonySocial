import UserService from "../../application/services/UserService";
import AuthService from "../../application/services/AuthService";
import { Request, Response } from "express";
import { ILike } from 'typeorm';
import User from "../../domain/models/User";
import { ParsedQs } from "qs";
import { EntityNotFoundError } from "typeorm";
import { ErrorCodes } from "../../application/shared/errors/ApplicationError";
import { ApplicationResponse } from "../../application/shared/ApplicationReponse";
import RegisterRequest from "../../application/dto/requests/User/RegisterRequest";
import LoginRequest from "../../application/dto/requests/User/LoginRequest";
import UpdateUserRequest from "../../application/dto/requests/User/UpdateUserRequest";
import ForgotPasswordRequest from "../../application/dto/requests/User/ForgotPasswordRequest";
import ResetPasswordRequest from "../../application/dto/requests/User/ResetPasswordRequest";
import VerifyEmailRequest from "../../application/dto/requests/User/VerifyEmailRequest";
import NotFoundResponse from "../../application/shared/responses/NotFoundResponse";
import LoggerPort from "../../domain/ports/utils/LoggerPort";

export default class UserController {
  private userService: UserService;
  private authService: AuthService;

  constructor(
    userService: UserService,
    authService: AuthService,
    private logger: LoggerPort,
  ) {
    this.userService = userService;
    this.authService = authService;
  }

  async registerUser(req: Request, res: Response) {
    const regRequest: RegisterRequest = req.body;
    try {
      const user: Omit<
        User,
        | "id"
        | "status"
        | "created_at"
        | "updated_at"
        | "learning_points"
        | "concurrency_stamp"
        | "normalized_username"
        | "normalized_email"
        | "security_stamp"
      > = {
        full_name: regRequest.full_name.trim(),
        email: regRequest.email.trim(),
        username: regRequest.username.trim(),
        password: regRequest.password.trim(),
        profile_image: regRequest.profile_image.trim(),
        favorite_instrument: regRequest.favorite_instrument,
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
              this.logger.appError(userResponse);
              return res.status(500).json({ message: "Error en la base de datos" });
            case ErrorCodes.SERVER_ERROR:
              this.logger.appError(userResponse);
              return res.status(500).json({ message: userResponse.error.message });
            default:
              this.logger.appError(userResponse);
              return res.status(500).json({ message: "Error desconocido" });
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof ApplicationResponse && (error as ApplicationResponse<any>).error) {
        const appError = error.error;
        if (appError) {
          this.logger.appError(error);
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

  async searchUsers(req: Request, res: Response) {
  try {
    const q = String((req.query.q as string) ?? "").trim();
    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "10")) || 10, 1), 50);

    const r = await this.userService.searchUsers(q, limit);
    if (!r.success) {
      this.logger.appError(r);
      return res.status(500).json({ message: r.error?.message ?? "Error buscando usuarios" });
    }

    // Devolvemos {rows: …} para que el frontend lo consuma sin tocar nada
    return res.status(200).json({ rows: r.data ?? [] });
  } catch (e: any) {
    this.logger.error("searchUsers error", [e?.message]);
    return res.status(500).json({ message: "Error interno" });
  }
}

async listUsers(req: Request, res: Response) {
  try {
    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "100")) || 100, 1), 1000);
    const r = await this.userService.listUsers(limit);
    if (!r.success) {
      this.logger.appError(r);
      return res.status(500).json({ message: r.error?.message ?? "Error listando usuarios" });
    }
    return res.status(200).json({ rows: r.data ?? [] });
  } catch (e: any) {
    this.logger.error("listUsers error", [e?.message]);
    return res.status(500).json({ message: "Error interno" });
  }
}

  

  async loginUser(req: Request, res: Response) {
    const loginRequest: LoginRequest = req.body;
    try {
      console.log(loginRequest);
      const authResponse = await this.authService.login(loginRequest);

      console.log(authResponse);
      if (authResponse.success && authResponse.data) {
        return res.status(200).json({
          message: "Login exitoso",
          data: authResponse.data,
        });
      } else {
        if (authResponse.error) {
          this.logger.appError(authResponse);
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
        return res.status(200).json(usersResponse.data);
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
              return res.status(500).json({
                message:
                  userResponse.error.message ??
                  "Ocurrio un error inesperado, intentelo de nuevo mas tarde",
              });
            case ErrorCodes.SERVER_ERROR:
              return res.status(500).json({
                message:
                  userResponse.error.message ??
                  "Ocurrio un error inesperado, intentelo de nuevo mas tarde",
              });
            default:
              return res.status(500).json({ message: "Error desconocido" });
          }
        }
        console.error(userResponse.error!.message);
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

  async getBasicUserData(req: Request, res: Response) {
    const { id } = req.query;
    try {
      const response = await this.userService.getUserData(Number(id));
      if (response.success) {
        res.status(200).json(response.data);
      } else {
        if (response instanceof NotFoundResponse) {
          res.status(404).json({ message: "No se pudo encontrar el usuario" });
        } else if (response instanceof ApplicationResponse) {
          switch (response.error?.code) {
            case ErrorCodes.DATABASE_ERROR:
              this.logger.debug("Es en la parte de el switch DATABASE_ERROR");
              res.status(500).json({
                messae: "Ocurrio un error, intente mas tarde",
              });
              break;
            default:
              this.logger.debug("Es en la parte de el switch default");
              this.logger.error(
                `Ocurrio un error desconocido al traer la data del usuario ${id}`,
                response,
              );
              res.status(500).json({
                messae: "Ocurrio un error, intente mas tarde",
              });
              break;
          }
        } else {
          this.logger.debug(
            "Es en la parte despues de que el error no sea instancia ni de NotFoundResponse ni de ApplicationResponse",
            [response, typeof response],
          );

          this.logger.error(
            `Ocurrio un error desconocido al traer la data del usuario ${id}`,
            response,
          );
          res.status(500).json({
            messae: "Ocurrio un error, intente mas tarde",
          });
          return;
        }
      }
    } catch (error) {
      console.error(error);
      this.logger.debug(
        "Es en la parte despues de que el error no sea instancia ni de NotFoundResponse ni de ApplicationResponse",
        [error, typeof error],
      );

      this.logger.error(`Ocurrio un error desconocido al traer la data del usuario ${id}`, error);
      res.status(500).json({
        messae: "Ocurrio un error, intente mas tarde",
      });
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
