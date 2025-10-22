export default class Result<T = void, E = Error> {
  private constructor(
    public readonly isSuccess: boolean,
    public readonly value?: T,
    public readonly error?: E,
  ) {}

  static ok<T>(value: T): Result<T, any> {
    return new Result(true, value);
  }

  static fail<E>(error: E): Result<never, E> {
    return new Result<never, E>(false, undefined, error);
  }

  public getValue(): T {
    if (!this.isSuccess) throw new Error("No value on failed result");
    return this.value!;
  }
}
