import { ArtistStatus } from "../models/music/Artist";
import { BasicFilters } from "./BasicFilters";

export default interface ArtistFilters extends BasicFilters {
  id?: number;
  artistName?: string;
  countryCode?: string;
  formationYear?: number;
  verified?: boolean;
  status?: ArtistStatus;
}
