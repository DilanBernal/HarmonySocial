import { ApplicationResponse } from "../ApplicationReponse";
import EmptyRequestError, { emptyRequestErrorDetails } from "../errors/EmptyRequestError";

export default class EmptyRequestResponse<T = void> extends ApplicationResponse<T> {
  constructor(emptyRequestDetails: emptyRequestErrorDetails, details?: any, originalError?: Error) {
    super(false, undefined, new EmptyRequestError(emptyRequestDetails, details, originalError));
  }
}
