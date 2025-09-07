import User from "../../../../domain/models/User";

export default interface RegisterRequest
  extends Omit<
    User,
    | "id"
    | "status"
    | "learning_points"
    | "created_at"
    | "updated_at"
    | "concurrency_stamp"
    | "security_stamp"
  > {}
