import { Brackets, Repository, SelectQueryBuilder } from "typeorm";
import Artist from "../../../../domain/models/music/Artist";
import ArtistQueryPort from "../../../../domain/ports/data/music/query/ArtistQueryPort";
import Result from "../../../../domain/shared/Result";
import ArtistFilters from "../../../../domain/valueObjects/ArtistFilters";
import { SqlAppDataSource } from "../../../config/con_database";
import { ArtistEntity } from "../../../entities/Sql/music";
``
export default class ArtistQueryAdapter implements ArtistQueryPort {
  private artistRepository: Repository<ArtistEntity>;
  constructor() {
    this.artistRepository = SqlAppDataSource.getRepository(ArtistEntity);
  }
  findById(id: number): Promise<Result<Artist>> {

    /**
     * @todo 
     * * Implementar la busqueda por ID de un artista en especifico manejando los errores

     */
    throw new Error("Method not implemented.");
  }
  findByFilters(filters: ArtistFilters): Promise<Result<Artist>> {
    /**
     * @todo
     * * Implementar la busqueda de una cancion individual siguiendo los parametros de los filtros
     */
    throw new Error("Method not implemented.");
  }
  async searchByFilters(filters: ArtistFilters): Promise<Result<Artist[]>> {
    /**
  * @todo
  * * Mejorar el manejo de errores
  * * crear un valueObject en el domain para mostrar la informacion publica de el artista, se podria llamar ArtistPublicInfo, los campos que NO irian serian created_at, updated_at, user_id y status
  *   * En base a el value object crear un puerto especifico para traer la informacion publica como se hace ya con la informacion publica del usuario con UserPublicProfileQueryPort, en el adaptador se van a buscar los artistas unicamente que esten con el status en 'ACTIVE'
  */
    try {
      const qb = this.applyFilters(filters);
      const result = await qb.getMany();

      return Result.ok(result.map(x => x.toDomain()));
    } catch (error) {
      if (error instanceof Error)
        return Result.fail(error);
      throw error;
    }
  }
  existsById(id: number): Promise<Result<boolean>> {

    /**
     * @todo
     * * Logica para validar si la cancion existe por un id especifico
     */
    throw new Error("Method not implemented.");
  }
  existsByFilters(filters: ArtistFilters): Promise<Result<boolean>> {
    /**
     * @todo
     * * Logica para validar si la cancion existe por un os filtros especificos
     */
    throw new Error("Method not implemented.");
  }


  private applyFilters(filters: ArtistFilters): SelectQueryBuilder<ArtistEntity> {
    const queryBuilder: SelectQueryBuilder<ArtistEntity> =
      this.artistRepository
        .createQueryBuilder("artist")
        .limit(50);

    if (filters.includeFilters) {
      if (filters.id) {
        queryBuilder.andWhere("artist.id = :id", { id: filters.id });
      }

      if (filters.artistName) {
        queryBuilder.andWhere("artist.artist_name LIKE :artistName", { artistName: `%${filters.artistName}%` });
      }

      if (filters.countryCode) {
        queryBuilder.andWhere("artist.countryCode = :countryCode", { countryCode: filters.countryCode });
      }

      if (filters.formationYear) {
        queryBuilder.andWhere("artist.formationYear = :formationYear", { formationYear: filters.formationYear });
      }

      if (filters.verified !== undefined) {
        queryBuilder.andWhere("artist.verified = :verified", { verified: filters.verified });
      }
    } else {
      queryBuilder.andWhere(new Brackets(qb => {
        if (filters.id) {
          qb.orWhere("artist.id = :id", { id: filters.id });
        }

        if (filters.artistName) {
          qb.orWhere("artist.artist_name LIKE :artistName", { artistName: `%${filters.artistName}%` });
        }

        if (filters.countryCode) {
          qb.orWhere("artist.countryCode = :countryCode", { countryCode: filters.countryCode });
        }

        if (filters.formationYear) {
          qb.orWhere("artist.formationYear = :formationYear", { formationYear: filters.formationYear });
        }

        if (filters.verified !== undefined) {
          qb.orWhere("artist.verified = :verified", { verified: filters.verified });
        }
      }));
    }

    return queryBuilder;
  }
}