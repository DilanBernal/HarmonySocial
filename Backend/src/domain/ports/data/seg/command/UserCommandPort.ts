import Response from "../../../../shared/Result";
import User from "../../../../models/seg/User";

export default interface UserCommandPort {
  createUser(user: Omit<User, "id" | "updatedAt">): Promise<Response<number, Error>>;
  updateUser(id: number, user: Partial<User>): Promise<Response>;
  deleteUser(id: number): Promise<Response>;
}
