import User from "../../../../domain/models/seg/User";

export default interface RegisterRequest
  extends Omit<
    User,
    | "id"
    | "status"
    | "learningPoints"
    | "createdAt"
    | "updatedAt"
    | "concurrencyStamp"
    | "securityStamp"
    | "normalizedUsername"
    | "normalizedEmail"
  > {
  usesDefaultImage?: boolean;
}
