import Result from "../../../../shared/Result";
import UserFollowsUser from "../../../../models/social/UserFollowsUser";

export default interface UserFollowsUserQueryPort {
  getFollowers(userId: number): Promise<Result<UserFollowsUser[]>>;
  getFollowing(userId: number): Promise<Result<UserFollowsUser[]>>;
  exists(followerId: number, followedId: number): Promise<Result<boolean>>;
}
