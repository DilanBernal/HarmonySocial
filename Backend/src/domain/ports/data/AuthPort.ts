import LoginRequest from "../../../application/dto/requests/LoginRequest";
import AuthResponse from "../../../application/dto/responses/AuthResponse";

export default interface AuthPort {
  loginUser(credentials: LoginRequest): Promise<AuthResponse>;
  recoverAccount(email: string): Promise<boolean>;
  encryptPassword(password: string): Promise<string>;
}
