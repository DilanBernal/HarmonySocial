import { Brackets, Repository, SelectQueryBuilder } from "typeorm";
import ArtistPublicInfoQueryPort from "../../../../domain/ports/data/music/query/ArtistPublicInfoQueryPort";
import Result from "../../../../domain/shared/Result";
import ArtistFilters from "../../../../domain/valueObjects/ArtistFilters";
import ArtistPublicInfo from "../../../../domain/valueObjects/ArtistPublicInfo";
import { SqlAppDataSource } from "../../../config/con_database";
import { ArtistEntity } from "../../../entities/Sql/music";
import DomainEntityNotFoundError from "../../../../domain/errors/EntityNotFoundError";
import { ArtistStatus } from "../../../../domain/models/music/Artist";

export default class ArtistPublicInfoQueryAdapter implements ArtistPublicInfoQueryPort {
  private readonly artistRepository: Repository<ArtistEntity>;

  constructor() {
    this.artistRepository = SqlAppDataSource.getRepository(ArtistEntity);
  }

  async getArtistPublicInfoById(id: number): Promise<Result<ArtistPublicInfo>> {
    try {
      const entity = await this.artistRepository.findOne({
        where: { id, status: ArtistStatus.ACTIVE },
        select: {
          id: true,
          artist_name: true,
          biography: true,
          verified: true,
          formation_year: true,
          country_code: true,
        },
      });

      if (!entity) {
        return Result.fail(new DomainEntityNotFoundError({ entity: "artista" }));
      }

      return Result.ok(this.toPublicInfo(entity));
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Result.fail(error);
      }
      throw error;
    }
  }

  async getArtistPublicInfoByFilters(filters: ArtistFilters): Promise<Result<ArtistPublicInfo>> {
    try {
      const qb = this.applyFilters(filters)
        .select([
          "artist.id",
          "artist.artist_name",
          "artist.biography",
          "artist.verified",
          "artist.formation_year",
          "artist.country_code",
        ]);

      const entity = await qb.getOne();
      if (!entity) {
        return Result.fail(new DomainEntityNotFoundError({ entity: "artista" }));
      }

      return Result.ok(this.toPublicInfo(entity));
    } catch (error: unknown) {
      return Result.fail(error as Error);
    }
  }

  async searchArtistsPublicInfoByFilters(filters: ArtistFilters): Promise<Result<ArtistPublicInfo[]>> {
    try {
      const qb = this.applyFilters(filters)
        .select([
          "artist.id",
          "artist.artist_name",
          "artist.biography",
          "artist.verified",
          "artist.formation_year",
          "artist.country_code",
        ]);

      const rows = await qb.getMany();
      return Result.ok(rows.map((entity) => this.toPublicInfo(entity)));
    } catch (error: unknown) {
      return Result.fail(error as Error);
    }
  }

  private toPublicInfo(entity: ArtistEntity): ArtistPublicInfo {
    return new ArtistPublicInfo(
      entity.id,
      entity.artist_name,
      entity.biography,
      entity.verified,
      entity.formation_year,
      entity.country_code,
    );
  }

  private applyFilters(filters: ArtistFilters): SelectQueryBuilder<ArtistEntity> {
    const queryBuilder: SelectQueryBuilder<ArtistEntity> = this.artistRepository
      .createQueryBuilder("artist")
      .limit(50)
      .andWhere("artist.status = :status", { status: ArtistStatus.ACTIVE });

    if (filters.includeFilters) {
      if (filters.id) {
        queryBuilder.andWhere("artist.id = :id", { id: filters.id });
      }

      if (filters.artistName) {
        queryBuilder.andWhere("artist.artist_name LIKE :artistName", { artistName: `%${filters.artistName}%` });
      }

      if (filters.countryCode) {
        queryBuilder.andWhere("artist.country_code = :countryCode", { countryCode: filters.countryCode });
      }

      if (filters.formationYear) {
        queryBuilder.andWhere("artist.formation_year = :formationYear", { formationYear: filters.formationYear });
      }

      if (filters.verified !== undefined) {
        queryBuilder.andWhere("artist.verified = :verified", { verified: filters.verified });
      }
    } else {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          if (filters.id) {
            qb.orWhere("artist.id = :id", { id: filters.id });
          }

          if (filters.artistName) {
            qb.orWhere("artist.artist_name LIKE :artistName", { artistName: `%${filters.artistName}%` });
          }

          if (filters.countryCode) {
            qb.orWhere("artist.country_code = :countryCode", { countryCode: filters.countryCode });
          }

          if (filters.formationYear) {
            qb.orWhere("artist.formation_year = :formationYear", { formationYear: filters.formationYear });
          }

          if (filters.verified !== undefined) {
            qb.orWhere("artist.verified = :verified", { verified: filters.verified });
          }
        }),
      );
    }

    return queryBuilder;
  }
}
