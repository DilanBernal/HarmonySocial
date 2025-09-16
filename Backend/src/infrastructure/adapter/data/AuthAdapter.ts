import bcrypt from "bcryptjs";
import LoginRequest from "../../../application/dto/requests/User/LoginRequest";
import AuthResponse from "../../../application/dto/responses/AuthResponse";
import AuthPort from "../../../domain/ports/data/AuthPort";
import envs from "../../config/environment-vars";
import jwt from "jsonwebtoken";

export default class AuthAdapter implements AuthPort {
  async encryptPassword(password: string): Promise<string> {
    try {
      const encryptedPassword: string = await bcrypt.hash(password, envs.PASSWORD_SALT);

      return encryptedPassword;
    } catch (error) {
      throw new Error("Ocurrio un error al encriptar la contraseña");
    }
  }
  private generateLoginToken(payload: object): string {
    return jwt.sign(payload, envs.JWT_SECRET, { expiresIn: "24d" });
  }
  async loginUser(
    credentials: LoginRequest,
    payload: object,
    imageAndId: Pick<AuthResponse, "profile_image" | "id">,
  ): Promise<AuthResponse> {
    const token = this.generateLoginToken({ credentials, payload });
    return {
      username: credentials.userOrEmail,
      token: token,
      profile_image: imageAndId.profile_image,
      id: imageAndId.id,
    };
  }
  async recoverAccount(email: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
