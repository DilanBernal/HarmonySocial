interface User {
  id: number;
  full_name: string;
  email: string;
  username: string;
  password: string;
  profile_image: string;
  learning_points: number;
  status: UserStatus;
  favorite_instrument: UserInstrument;
  is_artist: boolean;
  created_at: Date;
  updated_at?: Date ;
}
export default User;

export enum UserStatus {
  ACTIVE = 1,
  BLOCKED = 2,
  DELETED = 3,
  SUSPENDED = 4,
  FROZEN = 5
}

export enum UserInstrument {
  GUITAR,
  PIANO,
  BASS
}