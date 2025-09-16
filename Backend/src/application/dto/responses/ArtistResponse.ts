// DTO de respuesta para artista
import { ArtistStatus } from "../../../domain/models/Artist";

export interface ArtistResponse {
  id: number;
  artist_name: string;
  biography?: string;
  verified: boolean;
  formation_year: number;
  country_code?: string;
  status: ArtistStatus;
  created_at: Date;
  updated_at?: Date;
}
