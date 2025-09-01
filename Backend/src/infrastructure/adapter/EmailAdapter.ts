import EmailPort from "../../domain/ports/extras/EmailPort";

export default class EmailAdapter implements EmailPort {
  sendEmail(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
