import { ApplicationResponse } from "../shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../shared/errors/ApplicationError";
import Artist, { ArtistStatus } from "../../domain/models/music/Artist";
import ArtistPort from "../../domain/ports/data/music/ArtistPort";
import { ArtistSearchFilters } from "../dto/requests/Artist/ArtistSearchFilters";
import ArtistCreateRequest from "../dto/requests/Artist/ArtistCreateRequest";
import ArtistUpdateRequest from "../dto/requests/Artist/ArtistUpdateRequest";
import ArtistResponse from '../dto/responses/ArtistResponse';
import LoggerPort from "../../domain/ports/utils/LoggerPort";
import RolePort from "../../domain/ports/data/seg/RolePort";
import UserRolePort from "../../domain/ports/data/seg/UserRolePort";
import PaginationRequest from "../dto/utils/PaginationRequest";
import PaginationResponse from "../dto/utils/PaginationResponse";

export default class ArtistService {
  constructor(
    private port: ArtistPort,
    private logger: LoggerPort,
    private rolePort: RolePort,
    private userRolePort: UserRolePort,
  ) { }

  async create(
    request: ArtistCreateRequest,
    userId?: number,
  ): Promise<ApplicationResponse<number>> {
    if (!request || !request.artist_name || !request.formation_year) {
      return ApplicationResponse.failure(
        new ApplicationError("Datos de artista inválidos", ErrorCodes.VALIDATION_ERROR),
      );
    }
    try {
      const artist = new Artist(
        0, // id temporal, será asignado por la BD
        userId,
        request.artist_name.trim(),
        request.biography?.trim(),
        false,
        request.formation_year,
        request.country_code?.trim(),
        ArtistStatus.PENDING,
      );
      return await this.port.create(artist);
    } catch (error) {
      return this.handleUnexpected(error, "crear artista");
    }
  }

  async createAsAdmin(request: ArtistCreateRequest): Promise<ApplicationResponse<number>> {
    if (!request || !request.artist_name || !request.formation_year) {
      return ApplicationResponse.failure(
        new ApplicationError("Datos de artista inválidos", ErrorCodes.VALIDATION_ERROR),
      );
    }
    try {
      const artist = new Artist(
        0, // id temporal, será asignado por la BD
        undefined,
        request.artist_name.trim(),
        request.biography?.trim(),
        true,
        request.formation_year,
        request.country_code?.trim(),
        ArtistStatus.ACTIVE,
      );
      return await this.port.create(artist);
    } catch (error) {
      return this.handleUnexpected(error, "crear artista por admin");
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
      const updateData: Partial<Artist> = { updatedAt: new Date(Date.now()) };
      if (request.artist_name) updateData.artistName = request.artist_name.trim();
      if (request.biography !== undefined) updateData.biography = request.biography?.trim();
      if (request.formation_year !== undefined) updateData.formationYear = request.formation_year;
      if (request.country_code !== undefined)
        updateData.countryCode = request.country_code?.trim();
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

  async search(filters: PaginationRequest<ArtistSearchFilters>): Promise<ApplicationResponse<PaginationResponse<ArtistResponse>>> {
    try {
      const result = await this.port.searchPaginated(filters);
      if (!result.success) return result as any;

      return ApplicationResponse.success(result.data! as any);
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
      const statusResp = await this.port.updateStatus(id, ArtistStatus.ACTIVE);
      if (!statusResp.success) return statusResp;
      // asignar rol artist si existe user vinculado
      const userId = artistResp.data.artistUserId;
      if (userId) {
        try {
          const artistRole = await this.rolePort.findByName("artist");
          if (artistRole) {
            await this.userRolePort.assignRoleToUser(userId, artistRole.id);
          } else {
            this.logger.warn("Rol 'artist' no existe. No se asignó al usuario.");
          }
        } catch (e) {
          this.logger.error("Error asignando rol artist tras aceptación", [(e as any)?.message]);
        }
      }
      return statusResp;
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
    artist_name: artist.artistName,
    biography: artist.biography,
    formation_year: artist.formationYear,
    country_code: artist.countryCode,
    status: artist.status,
    created_at: artist.createdAt,
    updated_at: artist.updatedAt,
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
