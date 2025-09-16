import { ApplicationResponse } from "../../../application/shared/ApplicationReponse";
import Artist from "../../models/Artist";

export default interface ArtistPort {
  createNewArtist(artist: Omit<Artist, "id" | "updated_at">): Promise<ApplicationResponse<any>>;
}
