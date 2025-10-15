import UserTag from "./UserTag";

type UserPreferences = {
  userId: number;
  likedTags?: Array<UserTag>;
  dislikedTags?: Array<UserTag>;
}

export default UserPreferences;