import UserTag from "./UserTag";

type UserPreferences = {
  UserId: number;
  LikedTags: Array<UserTag>;
  DislikedTags: Array<UserTag>;
}

export default UserPreferences;