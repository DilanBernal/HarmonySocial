import Result from "../../../../shared/Result";
import Song from "../../../../models/music/Song";
import SongFilters from "../../../../valueObjects/SongFilters";

export default interface SongQueryPort {
  findById(id: number): Promise<Result<Song>>;
  findByFilters(filters: SongFilters): Promise<Result<Song>>;
  searchByFilters(filters: SongFilters): Promise<Result<Song[]>>;
  searchByUser(userId: number): Promise<Result<Song[]>>;
  existsById(id: number): Promise<Result<boolean>>;
}
