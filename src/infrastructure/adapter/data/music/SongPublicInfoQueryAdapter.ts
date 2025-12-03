import { Brackets, Repository, SelectQueryBuilder } from "typeorm";
import SongPublicInfoQueryPort from "../../../../domain/ports/data/music/query/SongPublicInfoQueryPort";
import Result from "../../../../domain/shared/Result";
import SongFilters from "../../../../domain/valueObjects/SongFilters";
import SongPublicInfo from "../../../../domain/valueObjects/SongPublicInfo";
import { SqlAppDataSource } from "../../../config/con_database";
import { SongEntity } from "../../../entities/Sql/music";
import DomainEntityNotFoundError from "../../../../domain/errors/EntityNotFoundError";
import { SongDifficultyLevel } from "../../../../domain/models/music/Song";

export default class SongPublicInfoQueryAdapter implements SongPublicInfoQueryPort {
  private readonly songRepository: Repository<SongEntity>;

  constructor() {
    this.songRepository = SqlAppDataSource.getRepository<SongEntity>(SongEntity);
  }

  async getSongPublicInfoById(id: number): Promise<Result<SongPublicInfo>> {
    try {
      const entity = await this.songRepository.findOne({
        where: { id },
        select: {
          id: true,
          title: true,
          audioUrl: true,
          description: true,
          duration: true,
          bpm: true,
          keyNote: true,
          decade: true,
          genre: true,
          country: true,
          instruments: true,
          difficultyLevel: true,
          artistId: true,
          userId: true,
          verifiedByArtist: true,
          verifiedByUsers: true,
        },
      });

      if (!entity) {
        return Result.fail(new DomainEntityNotFoundError({ entity: "canción" }));
      }

      return Result.ok(this.toPublicInfo(entity));
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Result.fail(error);
      }
      throw error;
    }
  }

  async getSongPublicInfoByFilters(filters: SongFilters): Promise<Result<SongPublicInfo>> {
    try {
      const qb = this.applyFilters(filters)
        .select([
          "song.id",
          "song.title",
          "song.audioUrl",
          "song.description",
          "song.duration",
          "song.bpm",
          "song.keyNote",
          "song.decade",
          "song.genre",
          "song.country",
          "song.instruments",
          "song.difficultyLevel",
          "song.artistId",
          "song.userId",
          "song.verifiedByArtist",
          "song.verifiedByUsers",
        ]);

      const entity = await qb.getOne();
      if (!entity) {
        return Result.fail(new DomainEntityNotFoundError({ entity: "canción" }));
      }

      return Result.ok(this.toPublicInfo(entity));
    } catch (error: unknown) {
      return Result.fail(error as Error);
    }
  }

  async searchSongsPublicInfoByFilters(filters: SongFilters): Promise<Result<SongPublicInfo[]>> {
    try {
      const qb = this.applyFilters(filters)
        .select([
          "song.id",
          "song.title",
          "song.audioUrl",
          "song.description",
          "song.duration",
          "song.bpm",
          "song.keyNote",
          "song.decade",
          "song.genre",
          "song.country",
          "song.instruments",
          "song.difficultyLevel",
          "song.artistId",
          "song.userId",
          "song.verifiedByArtist",
          "song.verifiedByUsers",
        ]);

      const rows = await qb.getMany();
      return Result.ok(rows.map((entity) => this.toPublicInfo(entity)));
    } catch (error: unknown) {
      return Result.fail(error as Error);
    }
  }

  private toPublicInfo(entity: SongEntity): SongPublicInfo {
    return new SongPublicInfo(
      entity.id,
      entity.title,
      entity.audioUrl,
      entity.description,
      entity.duration,
      entity.bpm,
      entity.keyNote,
      null, // album - not directly available as string from entity
      entity.decade?.toString() ?? null,
      entity.genre,
      entity.country,
      entity.instruments,
      entity.difficultyLevel as SongDifficultyLevel | null,
      entity.artistId,
      entity.userId,
      entity.verifiedByArtist,
      entity.verifiedByUsers,
    );
  }

  private applyFilters(filters: SongFilters): SelectQueryBuilder<SongEntity> {
    const queryBuilder = this.songRepository.createQueryBuilder("song").limit(50);

    if (filters.includeFilters) {
      if (filters.id) {
        queryBuilder.andWhere("song.id = :id", { id: filters.id });
      }

      if (filters.title) {
        queryBuilder.andWhere("song.title LIKE :title", { title: `%${filters.title}%` });
      }

      if (filters.genre) {
        queryBuilder.andWhere("song.genre = :genre", { genre: filters.genre });
      }

      if (filters.artistId) {
        queryBuilder.andWhere("song.artistId = :artistId", { artistId: filters.artistId });
      }

      if (filters.userId) {
        queryBuilder.andWhere("song.userId = :userId", { userId: filters.userId });
      }

      if (filters.decade) {
        queryBuilder.andWhere("song.decade = :decade", { decade: filters.decade });
      }

      if (filters.country) {
        queryBuilder.andWhere("song.country = :country", { country: filters.country });
      }

      if (filters.difficultyLevel) {
        queryBuilder.andWhere("song.difficultyLevel = :difficultyLevel", { difficultyLevel: filters.difficultyLevel });
      }

      if (filters.verifiedByArtist !== undefined) {
        queryBuilder.andWhere("song.verifiedByArtist = :verifiedByArtist", {
          verifiedByArtist: filters.verifiedByArtist,
        });
      }

      if (filters.verifiedByUsers !== undefined) {
        queryBuilder.andWhere("song.verifiedByUsers = :verifiedByUsers", { verifiedByUsers: filters.verifiedByUsers });
      }
    } else {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          if (filters.id) {
            qb.orWhere("song.id = :id", { id: filters.id });
          }

          if (filters.title) {
            qb.orWhere("song.title LIKE :title", { title: `%${filters.title}%` });
          }

          if (filters.genre) {
            qb.orWhere("song.genre = :genre", { genre: filters.genre });
          }

          if (filters.artistId) {
            qb.orWhere("song.artistId = :artistId", { artistId: filters.artistId });
          }

          if (filters.userId) {
            qb.orWhere("song.userId = :userId", { userId: filters.userId });
          }

          if (filters.decade) {
            qb.orWhere("song.decade = :decade", { decade: filters.decade });
          }

          if (filters.country) {
            qb.orWhere("song.country = :country", { country: filters.country });
          }

          if (filters.difficultyLevel) {
            qb.orWhere("song.difficultyLevel = :difficultyLevel", { difficultyLevel: filters.difficultyLevel });
          }

          if (filters.verifiedByArtist !== undefined) {
            qb.orWhere("song.verifiedByArtist = :verifiedByArtist", { verifiedByArtist: filters.verifiedByArtist });
          }

          if (filters.verifiedByUsers !== undefined) {
            qb.orWhere("song.verifiedByUsers = :verifiedByUsers", { verifiedByUsers: filters.verifiedByUsers });
          }
        }),
      );
    }

    return queryBuilder;
  }
}
