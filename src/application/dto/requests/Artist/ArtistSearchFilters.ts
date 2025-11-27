import { ArtistStatus } from "../../../../domain/models/music/Artist";

export interface ArtistSearchFilters {
  name?: string;
  country?: string;
  verified?: boolean;
  formationYear?: string;
}
