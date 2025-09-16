import Artist, { ArtistStatus } from "../../domain/models/Artist";
import ArtistPort from "../../domain/ports/data/ArtistPort";
import LoggerPort from "../../domain/ports/utils/LoggerPort";
import { ApplicationResponse } from "../shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../shared/errors/ApplicationError";

export default class ArtistService {
  constructor(
    private artistPort: ArtistPort,
    private logger: LoggerPort,
  ) {}

  async createArtist(
    artist: Omit<Artist, "id" | "status" | "created_at" | "updated_at">,
  ): Promise<ApplicationResponse<number>> {
    try {
      const now = new Date();
      const artistDomain: Omit<Artist, "id"> = {
        ...artist,
        status: ArtistStatus.ACTIVE,
        created_at: now,
        updated_at: now,
      };
      const response = await this.artistPort.createNewArtist(artistDomain);
      return response;
    } catch (error) {
      this.logger.error("Error creating artist", error);
      return ApplicationResponse.failure(
        new ApplicationError("Error creating artist", ErrorCodes.SERVER_ERROR, error),
      );
    }
  }

  async updateArtist(id: number, artist: Partial<Artist>): Promise<ApplicationResponse> {
    try {
      const response = await this.artistPort.updateArtist(id, artist);
      if (!response.success) {
        this.logger.error("Error updating artist", response.error);
      }
      return response;
    } catch (error) {
      this.logger.error("Error updating artist", error);
      return ApplicationResponse.failure(
        new ApplicationError("Error updating artist", ErrorCodes.SERVER_ERROR, error),
      );
    }
  }

  async deleteArtist(id: number): Promise<ApplicationResponse> {
    try {
      const response = await this.artistPort.deleteArtist(id);
      if (!response.success) {
        this.logger.error("Error deleting artist", response.error);
      }
      return response;
    } catch (error) {
      this.logger.error("Error deleting artist", error);
      return ApplicationResponse.failure(
        new ApplicationError("Error deleting artist", ErrorCodes.SERVER_ERROR, error),
      );
    }
  }

  async getArtistById(id: number): Promise<ApplicationResponse<Artist>> {
    try {
      const response = await this.artistPort.getArtistById(id);
      if (!response.success) {
        this.logger.error("Artist not found", response.error);
      }
      return response;
    } catch (error) {
      this.logger.error("Error fetching artist", error);
      return ApplicationResponse.failure(
        new ApplicationError("Error fetching artist", ErrorCodes.SERVER_ERROR, error),
      );
    }
  }

  async searchArtists(params: {
    name?: string;
    country?: string;
  }): Promise<ApplicationResponse<Artist[]>> {
    try {
      const response = await this.artistPort.searchArtists(params);
      if (!response.success) {
        this.logger.error("Error searching artists", response.error);
      }
      return response;
    } catch (error) {
      this.logger.error("Error searching artists", error);
      return ApplicationResponse.failure(
        new ApplicationError("Error searching artists", ErrorCodes.SERVER_ERROR, error),
      );
    }
  }
}
