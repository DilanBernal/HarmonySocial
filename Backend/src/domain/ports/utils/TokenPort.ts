export default interface TokenPort {
  generateStamp(): string;
  generateConfirmAccountToken(securityStamp: string): string;
  generateRecoverPasswordToken(securityStamp: string): string;
  verifyToken(token: string): any | null;
}
