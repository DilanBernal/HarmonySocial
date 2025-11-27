import { ArtistStatus } from "../../../domain/models/music/Artist";

export default interface ArtistResponse {
  id: number;
  artist_name: string;
  biography?: string;
  formation_year: number;
  country_code?: string;
  status: ArtistStatus;
  created_at: Date;
  updated_at?: Date;
}
