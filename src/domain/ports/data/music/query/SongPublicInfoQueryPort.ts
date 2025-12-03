import Result from "../../../../shared/Result";
import SongFilters from "../../../../valueObjects/SongFilters";
import SongPublicInfo from "../../../../valueObjects/SongPublicInfo";

export default interface SongPublicInfoQueryPort {
  getSongPublicInfoById(id: number): Promise<Result<SongPublicInfo>>;
  getSongPublicInfoByFilters(filters: SongFilters): Promise<Result<SongPublicInfo>>;
  searchSongsPublicInfoByFilters(filters: SongFilters): Promise<Result<SongPublicInfo[]>>;
}
