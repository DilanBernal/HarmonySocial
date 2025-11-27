import { Request, Response } from "express";
import ArtistUserService from "../../application/services/ArtistUserService";
import LoggerPort from "../../domain/ports/utils/LoggerPort";
import { ApplicationResponse } from "../../application/shared/ApplicationReponse";
import { ErrorCodes } from "../../application/shared/errors/ApplicationError";

export default class ArtistUserController {
  constructor(
    private service: ArtistUserService,
    private logger: LoggerPort,
  ) {}

  async list(_req: Request, res: Response) {
    try {
      const resp = await this.service.listArtistUsers();
      if (resp.success) return res.status(200).json(resp.data);
      return this.handleError(res, resp);
    } catch (e) {
      return res.status(500).json({ message: "Error al listar artist-users" });
    }
  }

  private handleError(res: Response, response: ApplicationResponse<any>) {
    if (!response.error) return res.status(500).json({ message: "Error desconocido" });
    switch (response.error.code) {
      case ErrorCodes.DATABASE_ERROR:
        return res.status(500).json({ message: "Error en la base de datos" });
      default:
        this.logger.appError && this.logger.appError(response);
        return res.status(500).json({ message: "Error interno" });
    }
  }
}
