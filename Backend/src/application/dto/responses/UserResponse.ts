import User from "../../../domain/models/User";

export default interface UserResponse
  extends Omit<
    User,
    "password" | "security_stamp" | "concurrency_stamp" | "normalized_email" | "normalized_username"
  > {}
