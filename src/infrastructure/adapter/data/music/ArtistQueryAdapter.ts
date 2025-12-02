import { Repository } from "typeorm";
import Artist from "../../../../domain/models/music/Artist";
import ArtistQueryPort from "../../../../domain/ports/data/music/query/ArtistQueryPort";
import Result from "../../../../domain/shared/Result";
import ArtistFilters from "../../../../domain/valueObjects/ArtistFilters";
import { ArtistEntity } from "../../../entities/Sql/music";
import { SqlAppDataSource } from "../../../config/con_database";
import DomainError from "../../../../domain/errors/DomainError";

export default class ArtistQueryAdapter implements ArtistQueryPort {
  private artistRepository: Repository<ArtistEntity>;
  constructor() {
    this.artistRepository = SqlAppDataSource.getRepository(ArtistEntity);
  }
  findById(id: number): Promise<Result<Artist>> {
    throw new Error("Method not implemented.");
  }
  findByFilters(filters: ArtistFilters): Promise<Result<Artist>> {
    throw new Error("Method not implemented.");
  }
  async searchByFilters(filters: ArtistFilters): Promise<Result<Artist[]>> {
    try {

      const result = await this.artistRepository.find();
      console.log(result);

      return Result.ok(result.map(x => x.toDomain()));
    } catch (error) {
      if (error instanceof Error)
        return Result.fail(error);
      throw error;
    }
  }
  existsById(id: number): Promise<Result<boolean>> {
    throw new Error("Method not implemented.");
  }
  existsByFilters(filters: ArtistFilters): Promise<Result<boolean>> {
    throw new Error("Method not implemented.");
  }
}