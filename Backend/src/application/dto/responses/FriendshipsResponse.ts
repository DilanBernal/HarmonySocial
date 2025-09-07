import Friendship from "../../../domain/models/Friendship";

export default class FriendshipsResponse {
  friendships!: Array<Omit<Friendship, "created_at" | "updated_at">>;
}
