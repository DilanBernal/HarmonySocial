import LoginRequest from "../../../application/dto/requests/LoginRequest";
import AuthResponse from "../../../application/dto/responses/AuthResponse";

interface AuthPort {
  loginUser(credentials: LoginRequest): Promise<AuthResponse>;
  recoverAccount(email: string): Promise<boolean>;
  encryptPassword(password: string): Promise<string>;
  generateLoginToken(payload: object): Promise<string>;
}

export default AuthPort;