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
  // Errores de dominio específicos (10+)
  VALUE_NOT_FOUND = 10,
  USER_ALREADY_EXISTS = 11,
  INVALID_CREDENTIALS = 12,

  // Errores de validación (20+)
  VALIDATION_ERROR = 20,
  REQUIRED_FIELD = 21,
  INVALID_EMAIL = 22,

  // Errores de almacenamiento en la nube (Azure Blob Storage) (50+)
  /** El blob (archivo) no fue encontrado en el almacenamiento */
  BLOB_NOT_FOUND = 50,
  /** Conflicto al crear o actualizar un blob (por ejemplo, ya existe) */
  BLOB_CONFLICT = 51,
  /** Permiso denegado para acceder al blob o contenedor */
  BLOB_PERMISSION_DENIED = 52,
  /** Error genérico de Azure Blob Storage */
  BLOB_STORAGE_ERROR = 53,

  // Errores de infraestructura (60+)
  DATABASE_ERROR = 60,
  NETWORK_ERROR = 61,

  // Errores de negocio (70+)
  INSUFFICIENT_PERMISSIONS = 70,
  BUSINESS_RULE_VIOLATION = 71,
  SERVER_ERROR = 72,
}

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export interface ErrorResponse {
  code: ErrorCode;
  message: string;
  details?: unknown;
}
