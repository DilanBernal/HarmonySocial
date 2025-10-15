import UserTag from "./UserTag";

type UserPreferencers = {
  UserId: number;
  LikedTags: Array<UserTag>;
  DislikedTags: Array<UserTag>;
}