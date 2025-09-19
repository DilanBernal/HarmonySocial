export interface ArtistResponseDTO {
  id: number;
  artist_name: string;
  biography?: string;
  formation_year?: number | null;
  country_code?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export default ArtistResponseDTO;
