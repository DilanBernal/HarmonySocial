export default class DomainError extends Error {
  constructor(
    message: string,
    public readonly originalError?: Error,
  ) {
    super(message);
    this.name = "DomainError";
  }
}
