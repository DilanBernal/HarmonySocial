export class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly details?: unknown,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'ApplicationError';
  }

  // Métodos de utilidad
  toResponse(): ErrorResponse {
    return {
      code: this.code,
      message: this.message,
      details: this.details
    };
  }
}

/** Códigos de error específicos y descriptivos */
export enum ErrorCodes {
  // Errores de dominio específicos
  USER_ALREADY_EXISTS,
  VALUE_NOT_FOUND,
  INVALID_CREDENTIALS,

  // Errores de validación
  VALIDATION_ERROR,
  REQUIRED_FIELD,
  INVALID_EMAIL,

  // Errores de infraestructura
  DATABASE_ERROR,
  NETWORK_ERROR,

  // Errores de negocio
  INSUFFICIENT_PERMISSIONS,
  BUSINESS_RULE_VIOLATION,
}

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

export interface ErrorResponse {
  code: ErrorCode;
  message: string;
  details?: unknown;
}