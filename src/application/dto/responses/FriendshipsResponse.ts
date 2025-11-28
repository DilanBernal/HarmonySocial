import Friendship from "../../../domain/models/social/Friendship";

export interface FriendshipSummary {
  id: number;
  user_id: number;
  friend_id: number;
  status: string;
}

export default interface FriendshipsResponse {
  friendships: Array<FriendshipSummary>;
}
