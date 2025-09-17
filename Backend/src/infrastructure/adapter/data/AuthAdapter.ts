import bcrypt from "bcryptjs";
import LoginRequest from "../../../application/dto/requests/User/LoginRequest";
import AuthResponse from "../../../application/dto/responses/AuthResponse";
import AuthPort from "../../../domain/ports/data/AuthPort";
import envs from "../../config/environment-vars";
import jwt from "jsonwebtoken";
import Email from "../../../application/dto/utils/Email";

export default class AuthAdapter implements AuthPort {
  async comparePasswords(password: string, hashPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }
  async encryptPassword(password: string): Promise<string> {
    try {
      const encryptedPassword: string = await bcrypt.hash(password, envs.PASSWORD_SALT);

      return encryptedPassword;
    } catch (error) {
      throw new Error("Ocurrio un error al encriptar la contraseña");
    }
  }
  private generateLoginToken(payload: object): string {
    return jwt.sign(payload, envs.JWT_SECRET, { expiresIn: "2d" });
  }
  async loginUser(
    credentials: LoginRequest,
    payload: object,
    imageAndId: Pick<AuthResponse, "profile_image" | "id">,
  ): Promise<AuthResponse> {
    const email = credentials.userOrEmail;
    const token = this.generateLoginToken({ email, payload, id: imageAndId.id });
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
