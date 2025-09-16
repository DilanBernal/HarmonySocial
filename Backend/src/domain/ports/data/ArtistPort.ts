import { ApplicationResponse } from "../../../application/shared/ApplicationReponse";
import Artist from "../../models/Artist";

export default interface ArtistPort {
  createNewArtist(artist: Omit<Artist, "id" | "updated_at">): Promise<ApplicationResponse<number>>;
  updateArtist(id: number, artist: Partial<Artist>): Promise<ApplicationResponse>;
  deleteArtist(id: number): Promise<ApplicationResponse>;
  getArtistById(id: number): Promise<ApplicationResponse<Artist>>;
  searchArtists(params: {
    name?: string;
    country?: string;
  }): Promise<ApplicationResponse<Artist[]>>;
}
