import LoginRequest from "../../../application/dto/requests/User/LoginRequest";
import AuthResponse from "../../../application/dto/responses/AuthResponse";

export default interface AuthPort {
  loginUser(
    credentials: LoginRequest,
    payload: object,
    imageAndId: Pick<AuthResponse, "profile_image" | "id">,
  ): Promise<AuthResponse>;
  recoverAccount(email: string): Promise<boolean>;
  encryptPassword(password: string): Promise<string>;
}
