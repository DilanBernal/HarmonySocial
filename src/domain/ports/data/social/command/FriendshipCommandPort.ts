import Result from "../../../../shared/Result";
import Friendship from "../../../../models/social/Friendship";

export default interface FriendshipCommandPort {
  create(userId: number, friendId: number): Promise<Result<number>>;
  delete(id: number): Promise<Result<void>>;
  deleteByUsersIds(userId: number, friendId: number): Promise<Result<void>>;
  approve(id: number): Promise<Result<void>>;
  reject(id: number): Promise<Result<void>>;
}
