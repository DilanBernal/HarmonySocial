import Friendship from "../../../domain/models/Friendship";

export default interface FriendshipsResponse {
  friendships: Array<Omit<Friendship, "created_at" | "updated_at">>;
}
