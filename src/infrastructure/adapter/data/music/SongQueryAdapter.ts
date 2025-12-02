import Song from "../../../../domain/models/music/Song";
import SongQueryPort from "../../../../domain/ports/data/music/query/SongQueryPort";
import Result from "../../../../domain/shared/Result";
import SongFilters from "../../../../domain/valueObjects/SongFilters";

export default class SongQueryAdapter implements SongQueryPort {
  findById(id: number): Promise<Result<Song>> {
    throw new Error("Method not implemented.");
  }
  findByFilters(filters: SongFilters): Promise<Result<Song>> {
    throw new Error("Method not implemented.");
  }
  searchByFilters(filters: SongFilters): Promise<Result<Song[]>> {
    throw new Error("Method not implemented.");
  }
  searchByUser(userId: number): Promise<Result<Song[]>> {
    throw new Error("Method not implemented.");
  }
  existsById(id: number): Promise<Result<boolean>> {
    throw new Error("Method not implemented.");
  }

}