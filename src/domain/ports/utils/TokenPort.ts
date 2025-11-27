export default interface TokenPort {
  generateStamp(): string;
  generateConfirmAccountToken(securityStamp: string, concurrencyStamp: string): string;
  generateRecoverPasswordToken(securityStamp: string, concurrencyStamp: string): string;
  verifyToken(token: string): any | null;
}
