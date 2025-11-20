export default interface Friendship {
  id: number;
  user_id: number;
  friend_id: number;
  status: FrienshipStatus;
  created_at: Date;
  updated_at?: Date;
}

export enum FrienshipStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACEPTED",
  REJECTED = "REJECTED",
}
