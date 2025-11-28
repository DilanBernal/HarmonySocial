import { SongDifficultyLevel } from "../models/music/Song";
import { BasicFilters } from "./BasicFilters";

export default interface SongFilters extends BasicFilters {
  id?: number;
  title?: string;
  genre?: string;
  artistId?: number;
  userId?: number;
  decade?: string;
  country?: string;
  difficultyLevel?: SongDifficultyLevel;
  verifiedByArtist?: boolean;
  verifiedByUsers?: boolean;
}
