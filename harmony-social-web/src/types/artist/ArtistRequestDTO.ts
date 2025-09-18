export interface ArtistRequestDTO {
  artist_name: string;
  biography?: string;
  formation_year?: number | '';
  country_code?: string;
}

export default ArtistRequestDTO;
