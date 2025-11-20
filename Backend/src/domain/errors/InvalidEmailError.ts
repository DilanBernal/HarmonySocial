import DomainError from "./DomainError";

export default class InvalidEmailError extends DomainError {
  constructor() {
    super("El email ingresado no es valido");
  }
}
