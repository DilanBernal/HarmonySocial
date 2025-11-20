import User from "../../../../domain/models/seg/User";

export default interface LoginRequest extends Pick<User, "password"> {
  userOrEmail: string;
}
