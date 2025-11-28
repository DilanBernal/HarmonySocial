import Result from "../../../../shared/Result";
import UserFollowsUser from "../../../../models/social/UserFollowsUser";

export default interface UserFollowsUserCommandPort {
  follow(followerId: number, followedId: number): Promise<Result<UserFollowsUser>>;
  unfollow(followerId: number, followedId: number): Promise<Result<void>>;
}
