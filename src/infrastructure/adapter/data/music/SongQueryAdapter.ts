import { Repository, SelectQueryBuilder } from "typeorm";
import Song from "../../../../domain/models/music/Song";
import SongQueryPort from "../../../../domain/ports/data/music/query/SongQueryPort";
import Result from "../../../../domain/shared/Result";
import SongFilters from "../../../../domain/valueObjects/SongFilters";
import { SongEntity } from "../../../entities/Sql/music";
import { SqlAppDataSource } from "../../../config/con_database";

export default class SongQueryAdapter implements SongQueryPort {

  private readonly songRepository: Repository<SongEntity>;
  constructor() {
    this.songRepository = SqlAppDataSource.getRepository<SongEntity>(SongEntity);
  }

  /**
   * 
   * @param id id de el usuario

   */
  async findById(id: number): Promise<Result<Song>> {
    /**
     * @todo 
     * * Implementar la busqueda por ID de una cancion en especifica manejando los errores

     */
    throw new Error("Method not implemented.");
  }
  async findByFilters(filters: SongFilters): Promise<Result<Song>> {
    /**
     * @todo
     * * Implementar la busqueda de una cancion individual siguiendo los parametros de los filtros
     */
    throw new Error("Method not implemented.");
  }
  async searchByFilters(filters: SongFilters): Promise<Result<Song[]>> {
    /**
     * @todo
     * * Mejorar el manejo de errores
     * * crear un valueObject en el domain para mostrar la informacion publica de la cancion, se podria llamar PublicSong, los campos que NO irian serian created_at, updated_at
     * * Aplicar los filtros con el metodo applyFilters de esta clase
     */
    try {
      const result = await this.songRepository.find();
      console.log(result);

      return Result.ok(result.map(x => x.toDomain()));
    } catch (error) {
      if (error instanceof Error) {
        return Result.fail(error);
      }
      throw error;
    }
  }
  async searchByUser(userId: number): Promise<Result<Song[]>> {
    /**
     * @todo
     * * Realizar la logica para buscar el usuario por un id de usuario siguiendo la propiedad user_id
     */
    throw new Error("Method not implemented.");
  }
  async existsById(id: number): Promise<Result<boolean>> {
    /**
     * @todo
     * * Logica para validar si la cancion existe por un id especifico
     */
    throw new Error("Method not implemented.");
  }

  private applyFilters(filters: SongFilters): SelectQueryBuilder<SongEntity> {
    const queryBuilder = this.songRepository.createQueryBuilder("song");

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
        queryBuilder.andWhere("song.verifiedByArtist = :verifiedByArtist", { verifiedByArtist: filters.verifiedByArtist });
      }

      if (filters.verifiedByUsers !== undefined) {
        queryBuilder.andWhere("song.verifiedByUsers = :verifiedByUsers", { verifiedByUsers: filters.verifiedByUsers });
      }
    }
    /**
     * @todo
     * Agregar logica para agregar los filtros sin incluirlos con un orWhere
     */

    return queryBuilder;
  }

}