import { ApplicationResponse } from "../shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../shared/errors/ApplicationError";
import Artist, { ArtistStatus } from "../../domain/models/Artist";
import ArtistPort, { ArtistSearchFilters } from "../../domain/ports/data/ArtistPort";
import ArtistCreateRequest from "../dto/requests/Artist/ArtistCreateRequest";
import ArtistUpdateRequest from "../dto/requests/Artist/ArtistUpdateRequest";
import ArtistResponse from "../dto/responses/ArtistResponse";
import LoggerPort from "../../domain/ports/utils/LoggerPort";

export default class ArtistService {
  constructor(
    private port: ArtistPort,
    private logger: LoggerPort,
  ) {}

  async create(request: ArtistCreateRequest): Promise<ApplicationResponse<number>> {
    if (!request || !request.artist_name || !request.formation_year) {
      return ApplicationResponse.failure(
        new ApplicationError("Datos de artista inválidos", ErrorCodes.VALIDATION_ERROR),
      );
    }
    try {
      const now = new Date(Date.now());
      const artist: Omit<Artist, "id"> = {
        artist_name: request.artist_name.trim(),
        biography: request.biography?.trim(),
        formation_year: request.formation_year,
        country_code: request.country_code?.trim(),
        verified: false,
        status: ArtistStatus.PENDING,
        created_at: now,
        updated_at: undefined,
      } as any; // verified is present in current domain model
      return await this.port.create(artist as any);
    } catch (error) {
      return this.handleUnexpected(error, "crear artista");
    }
  }

  async update(id: number, request: ArtistUpdateRequest): Promise<ApplicationResponse> {
    if (!id || id <= 0) {
      return ApplicationResponse.failure(
        new ApplicationError("ID inválido", ErrorCodes.VALIDATION_ERROR),
      );
    }
    if (!request) {
      return ApplicationResponse.failure(
        new ApplicationError("Datos de actualización requeridos", ErrorCodes.VALIDATION_ERROR),
      );
    }
    try {
      const exists = await this.port.existsById(id);
      if (!exists.success || !exists.data) {
        return ApplicationResponse.failure(
          new ApplicationError("Artista no encontrado", ErrorCodes.VALUE_NOT_FOUND),
        );
      }
      const updateData: Partial<Artist> = { updated_at: new Date(Date.now()) };
      if (request.artist_name) updateData.artist_name = request.artist_name.trim();
      if (request.biography !== undefined) updateData.biography = request.biography?.trim();
      if (request.formation_year !== undefined) updateData.formation_year = request.formation_year;
      if (request.country_code !== undefined)
        updateData.country_code = request.country_code?.trim();
      // status changes not allowed here
      return await this.port.update(id, updateData);
    } catch (error) {
      return this.handleUnexpected(error, "actualizar artista");
    }
  }

  async getById(id: number): Promise<ApplicationResponse<ArtistResponse>> {
    if (!id || id <= 0) {
      return ApplicationResponse.failure(
        new ApplicationError("ID inválido", ErrorCodes.VALIDATION_ERROR),
      );
    }
    try {
      const result = await this.port.findById(id);
      if (!result.success) return result as any;
      if (!result.data) {
        return ApplicationResponse.failure(
          new ApplicationError("Artista no encontrado", ErrorCodes.VALUE_NOT_FOUND),
        );
      }
      return ApplicationResponse.success(this.mapToResponse(result.data));
    } catch (error) {
      return this.handleUnexpected(error, "obtener artista");
    }
  }

  async search(filters: ArtistSearchFilters): Promise<ApplicationResponse<ArtistResponse[]>> {
    try {
      const result = await this.port.search(filters);
      if (!result.success) return result as any;
      const data = (result.data || []).map(this.mapToResponse);
      return ApplicationResponse.success(data);
    } catch (error) {
      return this.handleUnexpected(error, "buscar artistas");
    }
  }

  async logicalDelete(id: number): Promise<ApplicationResponse> {
    try {
      const exists = await this.port.existsById(id);
      if (!exists.success || !exists.data) {
        return ApplicationResponse.failure(
          new ApplicationError("Artista no encontrado", ErrorCodes.VALUE_NOT_FOUND),
        );
      }
      return await this.port.updateStatus(id, ArtistStatus.DELETED);
    } catch (error) {
      return this.handleUnexpected(error, "eliminar artista");
    }
  }

  async accept(id: number): Promise<ApplicationResponse> {
    try {
      const artistResp = await this.port.findById(id);
      if (!artistResp.success) return artistResp as any;
      if (!artistResp.data) {
        return ApplicationResponse.failure(
          new ApplicationError("Artista no encontrado", ErrorCodes.VALUE_NOT_FOUND),
        );
      }
      if (artistResp.data.status !== ArtistStatus.PENDING) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "Solo se puede aceptar un artista en estado PENDING",
            ErrorCodes.BUSINESS_RULE_VIOLATION,
          ),
        );
      }
      return await this.port.updateStatus(id, ArtistStatus.ACTIVE);
    } catch (error) {
      return this.handleUnexpected(error, "aceptar artista");
    }
  }

  async reject(id: number): Promise<ApplicationResponse> {
    try {
      const artistResp = await this.port.findById(id);
      if (!artistResp.success) return artistResp as any;
      if (!artistResp.data) {
        return ApplicationResponse.failure(
          new ApplicationError("Artista no encontrado", ErrorCodes.VALUE_NOT_FOUND),
        );
      }
      if (artistResp.data.status !== ArtistStatus.PENDING) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "Solo se puede rechazar un artista en estado PENDING",
            ErrorCodes.BUSINESS_RULE_VIOLATION,
          ),
        );
      }
      return await this.port.updateStatus(id, ArtistStatus.REJECTED);
    } catch (error) {
      return this.handleUnexpected(error, "rechazar artista");
    }
  }

  private mapToResponse = (artist: Artist): ArtistResponse => ({
    id: artist.id,
    artist_name: artist.artist_name,
    biography: artist.biography,
    formation_year: artist.formation_year,
    country_code: artist.country_code,
    status: artist.status,
    created_at: artist.created_at,
    updated_at: artist.updated_at,
  });

  private handleUnexpected(error: unknown, context: string): ApplicationResponse<any> {
    if (error instanceof ApplicationResponse) return error;
    if (error instanceof ApplicationError) return ApplicationResponse.failure(error);
    if (error instanceof Error) {
      this.logger.error(`Error al ${context}`, [error.name, error.message]);
      return ApplicationResponse.failure(
        new ApplicationError(
          `Error al ${context}`,
          ErrorCodes.SERVER_ERROR,
          [error.name, error.message],
          error,
        ),
      );
    }
    this.logger.error(`Error desconocido al ${context}`);
    return ApplicationResponse.failure(
      new ApplicationError(`Error desconocido al ${context}`, ErrorCodes.SERVER_ERROR),
    );
  }
}
