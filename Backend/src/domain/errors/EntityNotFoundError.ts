import DomainError from "./DomainError";

export default class DomainEntityNotFoundError extends DomainError {
  constructor(props: { entity?: string; message?: string }) {
    if (props.entity && !props.message) {
      super(`No se pudo encontrar el/la ${props.entity}`);
      return;
    }
    super(props.message!);
  }
}

export type entityNotFoundErrorProps = {
  entity?: string;
  message?: string;
};
