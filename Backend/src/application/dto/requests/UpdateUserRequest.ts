import User from "../../../domain/models/User";

export default interface UpdateUserRequest extends Partial<Pick<User, "full_name" | "email" | "username" | "profile_image" | "favorite_instrument" | "is_artist">> {
  current_password?: string;
  new_password?: string;
}
