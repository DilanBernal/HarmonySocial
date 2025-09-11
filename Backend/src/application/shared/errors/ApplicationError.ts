export class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly details?: unknown,
    public readonly originalError?: Error,
  ) {
    super(message);
    this.name = "ApplicationError";
  }

  // Métodos de utilidad
  toResponse(): ErrorResponse {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
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

  // Errores de almacenamiento en la nube (Azure Blob Storage)
  /** El blob (archivo) no fue encontrado en el almacenamiento */
  BLOB_NOT_FOUND,
  /** Conflicto al crear o actualizar un blob (por ejemplo, ya existe) */
  BLOB_CONFLICT,
  /** Permiso denegado para acceder al blob o contenedor */
  BLOB_PERMISSION_DENIED,
  /** Error genérico de Azure Blob Storage */
  BLOB_STORAGE_ERROR,

  // Errores de negocio
  INSUFFICIENT_PERMISSIONS,
  BUSINESS_RULE_VIOLATION,
  SERVER_ERROR,
}

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export interface ErrorResponse {
  code: ErrorCode;
  message: string;
  details?: unknown;
}
