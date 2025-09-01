import User from "../../../domain/models/User";

export default interface LoginRequest extends Pick<User, "password"> {
  userOrEmail: string;
}
