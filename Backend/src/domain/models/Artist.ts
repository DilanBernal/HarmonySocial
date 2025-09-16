export enum ArtistStatus {
  ACTIVE = "ACTIVE",
  DELETED = "DELETED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}

type Artist = {
  id: number;
  artist_user_id?: number;
  artist_name: string;
  biography?: string;
  verified: boolean;
  formation_year: number;
  country_code?: string;
  status: ArtistStatus;
  created_at: Date;
  updated_at?: Date;
};
export default Artist;
