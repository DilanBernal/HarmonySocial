import User from "../../../../../domain/models/seg/User";

export default interface UserResponse
  extends Omit<
    User,
    "password" | "securityStamp" | "concurrencyStamp" | "normalizedEmail" | "normalizedUsername"
  > {}
