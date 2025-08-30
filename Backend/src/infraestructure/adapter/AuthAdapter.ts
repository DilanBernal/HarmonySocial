import bcrypt from "bcryptjs";
import LoginRequest from "../../application/dto/requests/LoginRequest";
import AuthResponse from "../../application/dto/responses/AuthResponse";
import AuthPort from "../../domain/ports/data/AuthPort";
import envs from "../config/environment-vars";

export default class AuthAdapter implements AuthPort {

  async encryptPassword(password: string): Promise<string> {
    try {
      const encryptedPassword: string = await bcrypt.hash(password, envs.PASSWORD_SALT);

      return encryptedPassword;
    } catch (error) {
      throw new Error("Ocurrio un error al encriptar la contraseña");
    }
  }
  async generateLoginToken(payload: object): Promise<string> {
    throw new Error("Method not implemented.");
  }
  async loginUser(credentials: LoginRequest): Promise<AuthResponse> {
    throw new Error("Method not implemented.");
  }
  async recoverAccount(email: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}