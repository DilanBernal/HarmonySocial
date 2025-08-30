export default interface EmailPort {
  sendEmail(): Promise<boolean>;
}