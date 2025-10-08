import { ArtistStatus } from "../../../../domain/models/Artist";

export interface ArtistSearchFilters {
  name?: string;
  country?: string;
  verified?: boolean;
  formationYear?: string;
}
