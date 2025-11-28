import Result from "../../../../shared/Result";
import Friendship from "../../../../models/social/Friendship";
import FriendshipFilters from "../../../../valueObjects/FriendshipFilters";

export default interface FriendshipQueryPort {
  findById(id: number): Promise<Result<Friendship | null>>;
  findByFilters(filters: FriendshipFilters): Promise<Result<Friendship | null>>;
  findByUsersIds(userId: number, friendId: number): Promise<Result<Friendship | null>>;
  getAllFriendshipsByUser(userId: number): Promise<Result<Friendship[]>>;
  getCommonFriendships(userId: number, friendId: number): Promise<Result<Friendship[]>>;
  getFriendshipsByUserAndSimilarName(userId: number, name: string): Promise<Result<Friendship[]>>;
}
