import User from "../../../domain/models/User";

export default interface RegisterRequest extends Omit<User, "id" | "status" | 'created_at' | 'updated_at'> {
}