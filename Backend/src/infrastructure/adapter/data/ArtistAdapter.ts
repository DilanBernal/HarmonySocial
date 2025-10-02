// Clean implementation without duplicates
import { Repository, ILike, Like, FindOptionsWhere } from "typeorm";
import { AppDataSource } from "../../config/con_database";
import ArtistEntity from "../../entities/ArtistEntity";
import Artist, { ArtistStatus } from "../../../domain/models/Artist";
import ArtistPort from "../../../domain/ports/data/ArtistPort";
import { ArtistSearchFilters } from "@/application/dto/requests/Artist/ArtistSearchFilters";
import { ApplicationResponse } from "../../../application/shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../../../application/shared/errors/ApplicationError";
import PaginationRequest from "@/application/dto/utils/PaginationRequest";

export default class ArtistAdapter implements ArtistPort {
  private repo: Repository<ArtistEntity>;
  constructor() {
    this.repo = AppDataSource.getRepository(ArtistEntity);
  }

  private toDomain(e: ArtistEntity): Artist {
    return {
      id: e.id,
      artist_name: e.artist_name,
      biography: e.biography,
      verified: e.verified,
      formation_year: e.formation_year,
      country_code: e.country_code,
      status: e.status,
      created_at: e.created_at,
      updated_at: e.updated_at,
      artist_user_id: e.user_id,
    } as Artist;
  }

  async create(
    artist: Omit<Artist, "id" | "created_at" | "updated_at">,
  ): Promise<ApplicationResponse<number>> {
    try {
      const entity = new ArtistEntity();
      entity.artist_name = artist.artist_name;
      entity.biography = artist.biography;
      entity.formation_year = artist.formation_year;
      entity.country_code = artist.country_code;
      entity.verified = (artist as any).verified ?? false;
      entity.status = artist.status;
      entity.created_at = new Date(Date.now());
      if ((artist as any).artist_user_id) entity.user_id = (artist as any).artist_user_id;
      const saved = await this.repo.save(entity);
      return ApplicationResponse.success(saved.id);
    } catch (error: any) {
      return ApplicationResponse.failure(
        new ApplicationError(
          "Error al crear artista",
          ErrorCodes.DATABASE_ERROR,
          error.message,
          error,
        ),
      );
    }
  }

  async update(id: number, artist: Partial<Artist>): Promise<ApplicationResponse> {
    try {
      const existing = await this.repo.findOne({ where: { id } });
      if (!existing) {
        return ApplicationResponse.failure(
          new ApplicationError("Artista no encontrado", ErrorCodes.VALUE_NOT_FOUND),
        );
      }
      if (artist.artist_name !== undefined) existing.artist_name = artist.artist_name;
      if (artist.biography !== undefined) existing.biography = artist.biography;
      if (artist.formation_year !== undefined) existing.formation_year = artist.formation_year;
      if (artist.country_code !== undefined) existing.country_code = artist.country_code;
      existing.updated_at = new Date(Date.now());
      await this.repo.save(existing);
      return ApplicationResponse.emptySuccess();
    } catch (error: any) {
      return ApplicationResponse.failure(
        new ApplicationError(
          "Error al actualizar artista",
          ErrorCodes.DATABASE_ERROR,
          error.message,
          error,
        ),
      );
    }
  }

  async logicalDelete(id: number): Promise<ApplicationResponse> {
    try {
      const existing = await this.repo.findOne({ where: { id } });
      if (!existing) {
        return ApplicationResponse.failure(
          new ApplicationError("Artista no encontrado", ErrorCodes.VALUE_NOT_FOUND),
        );
      }
      existing.status = ArtistStatus.DELETED;
      existing.updated_at = new Date(Date.now());
      await this.repo.save(existing);
      return ApplicationResponse.emptySuccess();
    } catch (error: any) {
      return ApplicationResponse.failure(
        new ApplicationError(
          "Error al eliminar artista",
          ErrorCodes.DATABASE_ERROR,
          error.message,
          error,
        ),
      );
    }
  }

  async findById(id: number): Promise<ApplicationResponse<Artist>> {
    try {
      const existing = await this.repo.findOne({ where: { id } });
      if (!existing) {
        return ApplicationResponse.failure(
          new ApplicationError("Artista no encontrado", ErrorCodes.VALUE_NOT_FOUND),
        );
      }
      return ApplicationResponse.success(this.toDomain(existing));
    } catch (error: any) {
      return ApplicationResponse.failure(
        new ApplicationError(
          "Error al obtener artista",
          ErrorCodes.DATABASE_ERROR,
          error.message,
          error,
        ),
      );
    }
  }

  async searchPaginated(
    req: PaginationRequest<ArtistSearchFilters>,
  ): Promise<ApplicationResponse<Artist[]>> {
    try {
      const filters = req.filters;
      console.log(filters);
      console.log(req);
      if (!filters) {
        return ApplicationResponse.success([]);
      }
      const where: FindOptionsWhere<ArtistEntity> = {};
      if (filters.name) where.artist_name = ILike(`${filters.name}%`);
      if (filters.country) where.country_code = Like(`${filters.country.toUpperCase()}`);
      if (filters.status) where.status = filters.status;
      const list = await this.repo.find({ where: where });
      return ApplicationResponse.success(list.map((e) => this.toDomain(e)));
    } catch (error: any) {
      console.log(error);
      return ApplicationResponse.failure(
        new ApplicationError(
          "Error al buscar artistas",
          ErrorCodes.DATABASE_ERROR,
          error.message,
          error,
        ),
      );
    }
  }

  async existsById(id: number): Promise<ApplicationResponse<boolean>> {
    try {
      const count = await this.repo.count({ where: { id } });
      return ApplicationResponse.success(count > 0);
    } catch (error: any) {
      return ApplicationResponse.failure(
        new ApplicationError(
          "Error al validar artista",
          ErrorCodes.DATABASE_ERROR,
          error.message,
          error,
        ),
      );
    }
  }

  async updateStatus(id: number, status: ArtistStatus): Promise<ApplicationResponse> {
    try {
      const existing = await this.repo.findOne({ where: { id } });
      if (!existing) {
        return ApplicationResponse.failure(
          new ApplicationError("Artista no encontrado", ErrorCodes.VALUE_NOT_FOUND),
        );
      }
      existing.status = status;
      existing.updated_at = new Date(Date.now());
      await this.repo.save(existing);
      return ApplicationResponse.emptySuccess();
    } catch (error: any) {
      return ApplicationResponse.failure(
        new ApplicationError(
          "Error al actualizar estado",
          ErrorCodes.DATABASE_ERROR,
          error.message,
          error,
        ),
      );
    }
  }
}
