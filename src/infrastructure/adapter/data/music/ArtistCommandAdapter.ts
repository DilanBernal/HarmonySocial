import { Repository } from "typeorm";
import Artist, { ArtistStatus } from "../../../../domain/models/music/Artist";
import ArtistCommandPort from "../../../../domain/ports/data/music/command/ArtistCommandPort";
import Result from "../../../../domain/shared/Result";
import { ArtistEntity } from "../../../entities/Sql/music";
import { SqlAppDataSource } from "../../../config/con_database";

export default class ArtistCommandAdapter implements ArtistCommandPort {
  private readonly artistRepository: Repository<ArtistEntity>;

  constructor() {
    this.artistRepository = SqlAppDataSource.getRepository<ArtistEntity>(ArtistEntity);
  }

  /**
   * Crea un nuevo artista
   * @param artist Datos del artista a crear (sin id, createdAt, updatedAt)
   */
  async create(artist: Omit<Artist, "id" | "createdAt" | "updatedAt">): Promise<Result<number>> {
    try {
      const entity = new ArtistEntity();
      entity.artist_name = artist.artistName;
      entity.biography = artist.biography;
      entity.formation_year = artist.formationYear;
      entity.country_code = artist.countryCode;
      entity.verified = artist.verified ?? false;
      entity.status = artist.status;
      entity.created_at = new Date();
      if (artist.artistUserId) {
        entity.user_id = artist.artistUserId;
      }

      const saved = await this.artistRepository.save(entity);
      return Result.ok(saved.id);
    } catch (error) {
      if (error instanceof Error) {
        return Result.fail(error);
      }
      throw error;
    }
  }

  /**
   * Actualiza un artista existente
   * @param id ID del artista a actualizar
   * @param artist Datos parciales del artista
   */
  async update(id: number, artist: Partial<Artist>): Promise<Result<void>> {
    try {
      const existing = await this.artistRepository.findOne({ where: { id } });
      if (!existing) {
        return Result.fail(new Error("Artista no encontrado"));
      }

      if (artist.artistName !== undefined) existing.artist_name = artist.artistName;
      if (artist.biography !== undefined) existing.biography = artist.biography;
      if (artist.formationYear !== undefined) existing.formation_year = artist.formationYear;
      if (artist.countryCode !== undefined) existing.country_code = artist.countryCode;
      if (artist.verified !== undefined) existing.verified = artist.verified;
      existing.updated_at = new Date();

      await this.artistRepository.save(existing);
      return Result.ok(undefined);
    } catch (error) {
      if (error instanceof Error) {
        return Result.fail(error);
      }
      throw error;
    }
  }

  /**
   * Actualiza el estado de un artista
   * @param id ID del artista
   * @param status Nuevo estado del artista
   */
  async updateStatus(id: number, status: ArtistStatus): Promise<Result<void>> {
    try {
      const existing = await this.artistRepository.findOne({ where: { id } });
      if (!existing) {
        return Result.fail(new Error("Artista no encontrado"));
      }

      existing.status = status;
      existing.updated_at = new Date();
      await this.artistRepository.save(existing);
      return Result.ok(undefined);
    } catch (error) {
      if (error instanceof Error) {
        return Result.fail(error);
      }
      throw error;
    }
  }

  /**
   * Elimina lógicamente un artista (cambia el estado a DELETED)
   * @param id ID del artista
   */
  async logicalDelete(id: number): Promise<Result<void>> {
    try {
      const existing = await this.artistRepository.findOne({ where: { id } });
      if (!existing) {
        return Result.fail(new Error("Artista no encontrado"));
      }

      existing.status = ArtistStatus.DELETED;
      existing.updated_at = new Date();
      await this.artistRepository.save(existing);
      return Result.ok(undefined);
    } catch (error) {
      if (error instanceof Error) {
        return Result.fail(error);
      }
      throw error;
    }
  }
}
