import User from "../../models/User";

interface UserPort {
  createUser(user: Omit<User, "id">): Promise<number>;
  updateUser(id: number, user: Partial<User>): Promise<boolean>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<Array<User>>;
  getUserById(id: number): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
}

export default UserPort;