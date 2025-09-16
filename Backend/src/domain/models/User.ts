interface User {
  id: number;
  full_name: string;
  email: string;
  normalized_email: string;
  username: string;
  normalized_username: string;
  password: string;
  profile_image: string;
  learning_points: number;
  status: UserStatus;
  favorite_instrument: UserInstrument;
  is_artist: boolean;
  concurrency_stamp: string;
  security_stamp: string;
  created_at: Date;
  updated_at?: Date;
}
export default User;

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
  SUSPENDED = "SUSPENDED",
  FROZEN = "FROZEN",
}

export enum UserInstrument {
  GUITAR,
  PIANO,
  BASS,
}
