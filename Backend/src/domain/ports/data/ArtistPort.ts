import { ApplicationResponse } from "../../../application/shared/ApplicationReponse";
import Artist, { ArtistStatus } from "../../models/Artist";

export interface ArtistSearchFilters {
  name?: string; // maps to artist_name LIKE %name%
  country?: string; // maps to country_code
  status?: ArtistStatus; // artist status filter
}

export default interface ArtistPort {
  create(
    artist: Omit<Artist, "id" | "created_at" | "updated_at">,
  ): Promise<ApplicationResponse<number>>;
  update(id: number, artist: Partial<Artist>): Promise<ApplicationResponse>;
  logicalDelete(id: number): Promise<ApplicationResponse>;
  findById(id: number): Promise<ApplicationResponse<Artist>>;
  search(filters: ArtistSearchFilters): Promise<ApplicationResponse<Artist[]>>;
  existsById(id: number): Promise<ApplicationResponse<boolean>>;
  updateStatus(id: number, status: ArtistStatus): Promise<ApplicationResponse>;
}
