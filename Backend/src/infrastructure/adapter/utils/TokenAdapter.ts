import jwt from "jsonwebtoken";
import TokenPort from "../../../domain/ports/utils/TokenPort";
import envs from "../../config/environment-vars";
import { v4 as uuidv4 } from "uuid";

export default class TokenAdapter implements TokenPort {
  generateStamp(): string {
    return uuidv4();
  }
  generateConfirmAccountToken(securityStamp: string): string {
    return jwt.sign({ securityStamp }, envs.JWT_SECRET, { expiresIn: "24h" });
  }
  generateRecoverPasswordToken(securityStamp: string): string {
    return jwt.sign({ securityStamp }, envs.JWT_SECRET, { expiresIn: "24h" });
  }
  verifyToken(token: string): any | null {
    try {
      const payload = jwt.verify(token, envs.JWT_SECRET);
      return payload;
    } catch {
      return null;
    }
  }
}
