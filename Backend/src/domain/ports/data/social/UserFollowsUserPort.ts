// src/domain/ports/UserFollowRepository.ts
import UserFollow from "../../../../infrastructure/entities/UserFollowsUserEntity";

export interface UserFollowRepository {
  follow(followerId: number, followedId: number): Promise<UserFollow>;
  unfollow(followerId: number, followedId: number): Promise<void>;
  getFollowers(userId: number): Promise<UserFollow[]>;
  getFollowing(userId: number): Promise<UserFollow[]>;
  exists(followerId: number, followedId: number): Promise<boolean>;
}
