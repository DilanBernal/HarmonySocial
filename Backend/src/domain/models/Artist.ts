type Artist = {
  id: number;
  artist_user_id?: number;
  artist_name: string;
  biography?: string;
  verified: boolean;
  formation_year: number;
  country_code?: string;
  created_at: Date;
  updated_at?: Date;
};
export default Artist;
