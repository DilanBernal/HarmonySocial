import User from "../../../../domain/models/seg/User";

export default interface UpdateUserRequest
  extends Partial<
    Pick<User, "fullName" | "email" | "username" | "profileImage" | "favoriteInstrument">
  > {
  current_password?: string;
  new_password?: string;
}
