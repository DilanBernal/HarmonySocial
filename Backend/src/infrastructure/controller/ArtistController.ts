import { Request, Response } from "express";
import ArtistService from "../../application/services/ArtistService";
import LoggerPort from "../../domain/ports/utils/LoggerPort";

import { ArtistCreateRequest } from "../../application/dto/requests/ArtistCreateRequest";
import { ArtistUpdateRequest } from "../../application/dto/requests/ArtistUpdateRequest";
import { ErrorCodes } from "../../application/shared/errors/ApplicationError";

export default class ArtistController {
  constructor(
    private artistService: ArtistService,
    private logger: LoggerPort,
  ) {}

  async createArtist(req: Request, res: Response) {
    const data: ArtistCreateRequest = req.body;
    const result = await this.artistService.createArtist(data);
    if (result.success) {
      return res.status(201).json({ artistId: result.data });
    }
    this.logger.error("Error creating artist", result.error);
    return res.status(400).json(result.error?.toResponse?.() ?? { message: "Error" });
  }

  async updateArtist(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data: ArtistUpdateRequest = req.body;
    const result = await this.artistService.updateArtist(id, data);
    if (result.success) {
      return res.status(204).send();
    }
    this.logger.error("Error updating artist", result.error);
    const status = result.error?.code === ErrorCodes.VALUE_NOT_FOUND ? 404 : 400;
    return res.status(status).json(result.error?.toResponse?.() ?? { message: "Error" });
  }

  async deleteArtist(req: Request, res: Response) {
    const id = Number(req.params.id);
    const result = await this.artistService.deleteArtist(id);
    if (result.success) {
      return res.status(204).send();
    }
    this.logger.error("Error deleting artist", result.error);
    const status = result.error?.code === ErrorCodes.VALUE_NOT_FOUND ? 404 : 400;
    return res.status(status).json(result.error?.toResponse?.() ?? { message: "Error" });
  }

  async getArtistById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const result = await this.artistService.getArtistById(id);
    if (result.success) {
      return res.status(200).json(result.data);
    }
    this.logger.error("Artist not found", result.error);
    return res.status(404).json(result.error?.toResponse?.() ?? { message: "Not found" });
  }

  async searchArtists(req: Request, res: Response) {
    const { name, country } = req.query;
    const result = await this.artistService.searchArtists({
      name: typeof name === "string" ? name : undefined,
      country: typeof country === "string" ? country : undefined,
    });
    if (result.success) {
      return res.status(200).json(result.data);
    }
    this.logger.error("Error searching artists", result.error);
    return res.status(500).json(result.error?.toResponse?.() ?? { message: "Error" });
  }
}
