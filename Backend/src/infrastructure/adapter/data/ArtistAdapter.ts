import { Repository } from "typeorm";
import { ApplicationResponse } from "../../../application/shared/ApplicationReponse";
import Artist from "../../../domain/models/Artist";
import ArtistPort from "../../../domain/ports/data/ArtistPort";
import ArtistEntity from "../../entities/ArtistEntity";
import NotFoundError from "../../../application/shared/errors/NotFoundError";
import { AppDataSource } from "../../config/con_database";

export default class ArtistAdapter implements ArtistPort {
  private artistRepository: Repository<ArtistEntity>;
  constructor() {
    this.artistRepository = AppDataSource.getRepository(ArtistEntity);
  }
  toDomain(artist: ArtistEntity): Artist {
    const artistDomain: Artist = {
      id: artist.id ?? 0,
      artist_name: artist.artist_name,
      biography: artist.biography,
      verified: artist.verified,
      formation_year: artist.formation_year,
      country_code: artist.country_code,
      created_at: artist.created_at,
      updated_at: artist.created_at,
    };
    return artistDomain;
  }

  toEntity(artist: Omit<Artist, "id">): ArtistEntity {
    const artistEntity: ArtistEntity = new ArtistEntity();
    artistEntity.artist_name = artist.artist_name;
    artistEntity.verified = artist.verified;
    artistEntity.formation_year = artist.formation_year;
    artistEntity.country_code = artist.country_code;
    artistEntity.created_at = artist.created_at;
    artistEntity.updated_at = artist.updated_at;

    return artistEntity;
  }

  async createNewArtist(
    artist: Omit<Artist, "id" | "updated_at">,
  ): Promise<ApplicationResponse<any>> {
    try {
      const savedUser = await this.artistRepository.save(this.toEntity(artist));

      return ApplicationResponse.success(savedUser.id);
    } catch (error) {
      return ApplicationResponse.failure(new NotFoundError({}));
    }
  }
}
