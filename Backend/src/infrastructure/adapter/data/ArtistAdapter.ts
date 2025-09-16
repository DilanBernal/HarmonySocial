import { Repository, ILike } from "typeorm";
import { ApplicationResponse } from "../../../application/shared/ApplicationReponse";
import Artist, { ArtistStatus } from "../../../domain/models/Artist";
import ArtistPort from "../../../domain/ports/data/ArtistPort";
import ArtistEntity from "../../entities/ArtistEntity";
import { AppDataSource } from "../../config/con_database";
import { ApplicationError, ErrorCodes } from "../../../application/shared/errors/ApplicationError";

export default class ArtistAdapter implements ArtistPort {
  private artistRepository: Repository<ArtistEntity>;
  constructor() {
    this.artistRepository = AppDataSource.getRepository(ArtistEntity);
  }

  toDomain(artist: ArtistEntity): Artist {
    return {
      id: artist.id ?? 0,
      artist_name: artist.artist_name,
      biography: artist.biography,
      verified: artist.verified,
      formation_year: artist.formation_year,
      country_code: artist.country_code,
      status: artist.status as ArtistStatus,
      created_at: artist.created_at,
      updated_at: artist.updated_at,
    };
  }

  toEntity(artist: Partial<Artist>): ArtistEntity {
    const entity = new ArtistEntity();
    if (artist.id) entity.id = artist.id;
    entity.artist_name = artist.artist_name!;
    entity.biography = artist.biography;
    entity.verified = artist.verified!;
    entity.formation_year = artist.formation_year!;
    entity.country_code = artist.country_code;
    entity.status = artist.status ?? ArtistStatus.ACTIVE;
    entity.created_at = artist.created_at ?? new Date();
    entity.updated_at = artist.updated_at;
    return entity;
  }

  async createNewArtist(
    artist: Omit<Artist, "id" | "updated_at">,
  ): Promise<ApplicationResponse<number>> {
    try {
      const saved = await this.artistRepository.save(this.toEntity(artist));
      return ApplicationResponse.success(saved.id!);
    } catch (err) {
      return ApplicationResponse.failure(
        new ApplicationError("Error creating artist", ErrorCodes.DATABASE_ERROR, err),
      );
    }
  }

  async updateArtist(id: number, artist: Partial<Artist>): Promise<ApplicationResponse> {
    try {
      // Evitar error de tipado con artist_user_id
      const { artist_user_id, ...rest } = artist;
      const result = await this.artistRepository.update({ id }, rest);
      if (result.affected === 0) {
        return ApplicationResponse.failure(
          new ApplicationError("Artist not found", ErrorCodes.VALUE_NOT_FOUND),
        );
      }
      return ApplicationResponse.emptySuccess();
    } catch (err) {
      return ApplicationResponse.failure(
        new ApplicationError("Error updating artist", ErrorCodes.DATABASE_ERROR, err),
      );
    }
  }

  async deleteArtist(id: number): Promise<ApplicationResponse> {
    try {
      const result = await this.artistRepository.update({ id }, { status: ArtistStatus.DELETED });
      if (result.affected === 0) {
        return ApplicationResponse.failure(
          new ApplicationError("Artist not found", ErrorCodes.VALUE_NOT_FOUND),
        );
      }
      return ApplicationResponse.emptySuccess();
    } catch (err) {
      return ApplicationResponse.failure(
        new ApplicationError("Error deleting artist", ErrorCodes.DATABASE_ERROR, err),
      );
    }
  }

  async getArtistById(id: number): Promise<ApplicationResponse<Artist>> {
    try {
      const artist = await this.artistRepository.findOne({
        where: { id, status: ArtistStatus.ACTIVE },
      });
      if (!artist) {
        return ApplicationResponse.failure(
          new ApplicationError("Artist not found", ErrorCodes.VALUE_NOT_FOUND),
        );
      }
      return ApplicationResponse.success(this.toDomain(artist));
    } catch (err) {
      return ApplicationResponse.failure(
        new ApplicationError("Error fetching artist", ErrorCodes.DATABASE_ERROR, err),
      );
    }
  }

  async searchArtists(params: {
    name?: string;
    country?: string;
  }): Promise<ApplicationResponse<Artist[]>> {
    try {
      const where: any = { status: ArtistStatus.ACTIVE };
      if (params.name) where.artist_name = ILike(`%${params.name}%`);
      if (params.country) where.country_code = params.country;
      const artists = await this.artistRepository.find({ where });
      return ApplicationResponse.success(artists.map((a) => this.toDomain(a)));
    } catch (err) {
      return ApplicationResponse.failure(
        new ApplicationError("Error searching artists", ErrorCodes.DATABASE_ERROR, err),
      );
    }
  }
}
