import { ArtistSearchFilters } from "../../../../application/dto/requests/Artist/ArtistSearchFilters";
import { ApplicationResponse } from "../../../../application/shared/ApplicationReponse";
import Artist, { ArtistStatus } from "../../../models/music/Artist";
import PaginationRequest from "../../../../application/dto/utils/PaginationRequest";
import PaginationResponse from "../../../../application/dto/utils/PaginationResponse";

export default interface ArtistPort {
  create(
    artist: Omit<Artist, "id" | "created_at" | "updated_at">,
  ): Promise<ApplicationResponse<number>>;
  update(id: number, artist: Partial<Artist>): Promise<ApplicationResponse>;
  logicalDelete(id: number): Promise<ApplicationResponse>;
  findById(id: number): Promise<ApplicationResponse<Artist>>;
  searchPaginated(
    filters: PaginationRequest<ArtistSearchFilters>,
  ): Promise<ApplicationResponse<PaginationResponse<Artist>>>;
  existsById(id: number): Promise<ApplicationResponse<boolean>>;
  updateStatus(id: number, status: ArtistStatus): Promise<ApplicationResponse>;
}
