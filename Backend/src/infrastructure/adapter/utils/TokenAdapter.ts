import jwt from "jsonwebtoken";
import TokenPort from "../../../domain/ports/utils/TokenPort";
import envs from "../../config/environment-vars";
import { v4 as uuidv4 } from "uuid";

export default class TokenAdapter implements TokenPort {
  generateStamp(): string {
    return uuidv4();
  }
  generateConfirmAccountToken(securityStamp: string, concurrencyStamp: string): string {
    const stampsCombined = this.combineStamps(securityStamp, concurrencyStamp);
    return jwt.sign({ securityStamp, concurrencyStamp, stampsCombined }, envs.JWT_SECRET, {
      expiresIn: "24h",
    });
  }
  generateRecoverPasswordToken(securityStamp: string, concurrencyStamp: string): string {
    const stampsCombined = this.combineStamps(securityStamp, concurrencyStamp);
    return jwt.sign({ securityStamp, concurrencyStamp, stampsCombined }, envs.JWT_SECRET, {
      expiresIn: "24h",
    });
  }
  verifyToken(token: string): any | null {
    try {
      const payload = jwt.verify(token, envs.JWT_SECRET);
      return payload;
    } catch {
      return null;
    }
  }

  private combineStamps(stamp1: string, stamp2: string): string {
    const half1 = Math.floor(stamp1.length / 2);
    const half2 = Math.floor(stamp2.length / 2);
    const quarter2 = Math.floor(stamp2.length / 4);

    const part1 = stamp1.slice(0, half1);
    const part2 = stamp2.slice(0, half2);
    const part3 = stamp2.slice(0, quarter2);
    const part4 = stamp1.slice(0, half1);
    const part5 = stamp2.slice(half2);

    return part1 + part2 + part3 + part4 + part5;
  }
}
