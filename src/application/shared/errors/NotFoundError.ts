import { ApplicationError, ErrorCodes } from "./ApplicationError";

export type notFoundErrorDetails = {
  message?: string;
  entity?: string;
};
export default class NotFoundError extends ApplicationError {
  constructor(noje: notFoundErrorDetails, details?: any, originalError?: Error) {
    super(
      noje.message ?? `No se encontro ${noje.entity}`,
      ErrorCodes.VALUE_NOT_FOUND,
      details,
      originalError,
    );
  }
}
