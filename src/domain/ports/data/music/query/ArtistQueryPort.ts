import Result from "../../../../shared/Result";
import Artist from "../../../../models/music/Artist";
import ArtistFilters from "../../../../valueObjects/ArtistFilters";

export default interface ArtistQueryPort {
  findById(id: number): Promise<Result<Artist>>;
  findByFilters(filters: ArtistFilters): Promise<Result<Artist>>;
  searchByFilters(filters: ArtistFilters): Promise<Result<Artist[]>>;
  existsById(id: number): Promise<Result<boolean>>;
  existsByFilters(filters: ArtistFilters): Promise<Result<boolean>>;
}
