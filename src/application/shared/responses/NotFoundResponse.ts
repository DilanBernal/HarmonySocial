import { ApplicationResponse } from "../ApplicationReponse";
import NotFoundError, { notFoundErrorDetails } from "../errors/NotFoundError";

export default class NotFoundResponse<T = void> extends ApplicationResponse<T> {
  constructor(notFoundErrorDetails: notFoundErrorDetails, details?: any, originalError?: Error) {
    super(false, undefined, new NotFoundError(notFoundErrorDetails, details, originalError));
  }
}
