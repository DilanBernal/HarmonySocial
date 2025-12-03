import Result from "../../../../shared/Result";
import ArtistFilters from "../../../../valueObjects/ArtistFilters";
import ArtistPublicInfo from "../../../../valueObjects/ArtistPublicInfo";

export default interface ArtistPublicInfoQueryPort {
  getArtistPublicInfoById(id: number): Promise<Result<ArtistPublicInfo>>;
  getArtistPublicInfoByFilters(filters: ArtistFilters): Promise<Result<ArtistPublicInfo>>;
  searchArtistsPublicInfoByFilters(filters: ArtistFilters): Promise<Result<ArtistPublicInfo[]>>;
}
