import { ApplicationResponse } from "../../../../../application/shared/ApplicationReponse";
import User from "../../../../models/seg/User";

export default interface UserCommandPort {
  createUser(user: Omit<User, "id">): Promise<ApplicationResponse<number>>;
  updateUser(id: number, user: Partial<User>): Promise<ApplicationResponse>;
  deleteUser(id: number): Promise<ApplicationResponse>;
}
