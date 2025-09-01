export default interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
