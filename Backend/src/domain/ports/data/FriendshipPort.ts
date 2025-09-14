// Backend/src/domain/ports/data/FriendshipPort.ts
import { Friendship } from "../../models/Friendship";

export interface FriendshipPort {
  followUser(friendship: Friendship): Promise<Friendship>;
  unfollowUser(id: number): Promise<void>;
  getFollowers(userId: number): Promise<Friendship[]>;
  getFollowing(userId: number): Promise<Friendship[]>;
  // adicionalmente obtener por par follower-followed
  findByFollowerAndFollowed(followerId: number, followedId: number): Promise<Friendship | null>;
}
