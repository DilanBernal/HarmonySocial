import Email from "../../../application/dto/utils/Email";

export default interface EmailPort {
  sendEmail(email: Email): Promise<boolean>;
  sendEmails(emais: Email[]): Promise<boolean>;
}
