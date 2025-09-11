import {
  ApplicationError,
  ErrorCodes,
  ErrorCode,
} from "../../src/application/shared/errors/ApplicationError";

describe("ApplicationError", () => {
  describe("constructor", () => {
    it("debe crear un error con mensaje y código", () => {
      const error = new ApplicationError("Test error", ErrorCodes.VALIDATION_ERROR);

      expect(error.message).toBe("Test error");
      expect(error.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(error.name).toBe("ApplicationError");
      expect(error.details).toBeUndefined();
      expect(error.originalError).toBeUndefined();
    });

    it("debe crear un error con todos los parámetros", () => {
      const originalError = new Error("Original error");
      const details = [
        ["field1", "error1"],
        ["field2", "error2"],
      ];

      const error = new ApplicationError(
        "Test error",
        ErrorCodes.VALIDATION_ERROR,
        details,
        originalError,
      );

      expect(error.message).toBe("Test error");
      expect(error.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(error.details).toEqual(details);
      expect(error.originalError).toBe(originalError);
    });

    it("debe heredar de Error correctamente", () => {
      const error = new ApplicationError("Test", ErrorCodes.SERVER_ERROR);

      expect(error instanceof Error).toBe(true);
      expect(error instanceof ApplicationError).toBe(true);
    });

    it("debe mantener el stack trace", () => {
      const error = new ApplicationError("Test", ErrorCodes.SERVER_ERROR);

      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe("string");
    });
  });

  describe("toResponse", () => {
    it("debe convertir a ErrorResponse con propiedades básicas", () => {
      const error = new ApplicationError("Test error", ErrorCodes.VALIDATION_ERROR);
      const response = error.toResponse();

      expect(response).toEqual({
        code: ErrorCodes.VALIDATION_ERROR,
        message: "Test error",
        details: undefined,
      });
    });

    it("debe incluir details en la respuesta cuando están presentes", () => {
      const details = [
        ["email", "Email is required"],
        ["password", "Password is too weak"],
      ];
      const error = new ApplicationError("Validation failed", ErrorCodes.VALIDATION_ERROR, details);
      const response = error.toResponse();

      expect(response).toEqual({
        code: ErrorCodes.VALIDATION_ERROR,
        message: "Validation failed",
        details: details,
      });
    });

    it("debe excluir el originalError de la respuesta", () => {
      const originalError = new Error("Database connection failed");
      const error = new ApplicationError(
        "Server error",
        ErrorCodes.SERVER_ERROR,
        undefined,
        originalError,
      );
      const response = error.toResponse();

      expect(response).toEqual({
        code: ErrorCodes.SERVER_ERROR,
        message: "Server error",
        details: undefined,
      });
      expect(response).not.toHaveProperty("originalError");
    });
  });

  describe("diferentes tipos de errores", () => {
    it("debe manejar errores de validación", () => {
      const validationDetails = [
        ["username", "Username must be at least 3 characters"],
        ["email", "Invalid email format"],
        ["password", "Password must contain special characters"],
      ];

      const error = new ApplicationError(
        "Validation failed",
        ErrorCodes.VALIDATION_ERROR,
        validationDetails,
      );

      expect(error.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(error.details).toHaveLength(3);
      expect(error.details).toEqual(validationDetails);
    });

    it("debe manejar errores de recurso no encontrado", () => {
      const error = new ApplicationError("User with ID 123 not found", ErrorCodes.VALUE_NOT_FOUND);

      expect(error.code).toBe(ErrorCodes.VALUE_NOT_FOUND);
      expect(error.message).toBe("User with ID 123 not found");
    });

    it("debe manejar errores de servidor", () => {
      const dbError = new Error("Connection timeout");
      const error = new ApplicationError(
        "Internal server error",
        ErrorCodes.SERVER_ERROR,
        ["Database", "Connection failed"],
        dbError,
      );

      expect(error.code).toBe(ErrorCodes.SERVER_ERROR);
      expect(error.originalError).toBe(dbError);
      expect(error.details).toEqual(["Database", "Connection failed"]);
    });

    it("debe manejar errores de base de datos", () => {
      const error = new ApplicationError("Failed to insert record", ErrorCodes.DATABASE_ERROR);

      expect(error.code).toBe(ErrorCodes.DATABASE_ERROR);
    });

    it("debe manejar errores de credenciales inválidas", () => {
      const error = new ApplicationError(
        "Invalid username or password",
        ErrorCodes.INVALID_CREDENTIALS,
      );

      expect(error.code).toBe(ErrorCodes.INVALID_CREDENTIALS);
    });

    it("debe manejar errores de permisos insuficientes", () => {
      const error = new ApplicationError(
        "User does not have permission to perform this action",
        ErrorCodes.INSUFFICIENT_PERMISSIONS,
      );

      expect(error.code).toBe(ErrorCodes.INSUFFICIENT_PERMISSIONS);
    });

    it("debe manejar errores de reglas de negocio", () => {
      const error = new ApplicationError(
        "Cannot delete user with active sessions",
        ErrorCodes.BUSINESS_RULE_VIOLATION,
      );

      expect(error.code).toBe(ErrorCodes.BUSINESS_RULE_VIOLATION);
    });
  });

  describe("details con diferentes formatos", () => {
    it("debe manejar details como array de strings", () => {
      const details = ["Error 1", "Error 2", "Error 3"];
      const error = new ApplicationError("Multiple errors", ErrorCodes.VALIDATION_ERROR, details);

      expect(error.details).toEqual(details);
    });

    it("debe manejar details como array de tuplas", () => {
      const details = [
        ["field1", "error1"],
        ["field2", "error2"],
      ];
      const error = new ApplicationError("Field errors", ErrorCodes.VALIDATION_ERROR, details);

      expect(error.details).toEqual(details);
    });

    it("debe manejar details como objeto", () => {
      const details = { field1: "error1", field2: "error2" };
      const error = new ApplicationError("Object errors", ErrorCodes.VALIDATION_ERROR, details);

      expect(error.details).toEqual(details);
    });

    it("debe manejar details como valor primitivo", () => {
      const details = "Simple error detail";
      const error = new ApplicationError("Simple error", ErrorCodes.VALIDATION_ERROR, details);

      expect(error.details).toBe(details);
    });
  });

  describe("originalError con diferentes tipos", () => {
    it("debe manejar Error estándar como originalError", () => {
      const originalError = new Error("Standard error");
      const error = new ApplicationError(
        "Wrapped error",
        ErrorCodes.SERVER_ERROR,
        undefined,
        originalError,
      );

      expect(error.originalError).toBe(originalError);
      expect(error.originalError?.message).toBe("Standard error");
    });

    it("debe manejar TypeError como originalError", () => {
      const originalError = new TypeError("Type error occurred");
      const error = new ApplicationError(
        "Type error wrapper",
        ErrorCodes.SERVER_ERROR,
        undefined,
        originalError,
      );

      expect(error.originalError).toBe(originalError);
      expect(error.originalError instanceof TypeError).toBe(true);
    });

    it("debe manejar ReferenceError como originalError", () => {
      const originalError = new ReferenceError("Reference error occurred");
      const error = new ApplicationError(
        "Reference error wrapper",
        ErrorCodes.SERVER_ERROR,
        undefined,
        originalError,
      );

      expect(error.originalError).toBe(originalError);
      expect(error.originalError instanceof ReferenceError).toBe(true);
    });
  });

  describe("casos de uso comunes", () => {
    it("debe crear errores de validación con múltiples campos", () => {
      const validationErrors = [
        ["email", "Email is required"],
        ["password", "Password must be at least 8 characters"],
        ["confirmPassword", "Passwords do not match"],
      ];

      const error = new ApplicationError(
        "Registration validation failed",
        ErrorCodes.VALIDATION_ERROR,
        validationErrors,
      );

      expect(error.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(error.details).toHaveLength(3);

      const response = error.toResponse();
      expect(response.details).toEqual(validationErrors);
    });

    it("debe crear errores de servidor con contexto de error original", () => {
      const dbError = new Error("ECONNREFUSED: Connection refused");
      dbError.stack = "Database connection stack trace...";

      const error = new ApplicationError(
        "Unable to save user",
        ErrorCodes.DATABASE_ERROR,
        ["UserService", "saveUser method"],
        dbError,
      );

      expect(error.originalError).toBe(dbError);
      expect(error.details).toEqual(["UserService", "saveUser method"]);

      // El stack trace original se mantiene para debugging
      expect(error.originalError?.stack).toBeDefined();
    });

    it("debe crear errores de autorización simples", () => {
      const error = new ApplicationError("Access denied", ErrorCodes.INSUFFICIENT_PERMISSIONS);

      const response = error.toResponse();
      expect(response).toEqual({
        code: ErrorCodes.INSUFFICIENT_PERMISSIONS,
        message: "Access denied",
        details: undefined,
      });
    });
  });
});

describe("ErrorCodes", () => {
  it("debe contener todos los códigos de error esperados", () => {
    const expectedCodes = [
      "USER_ALREADY_EXISTS",
      "VALUE_NOT_FOUND",
      "INVALID_CREDENTIALS",
      "VALIDATION_ERROR",
      "REQUIRED_FIELD",
      "INVALID_EMAIL",
      "DATABASE_ERROR",
      "NETWORK_ERROR",
      "INSUFFICIENT_PERMISSIONS",
      "BUSINESS_RULE_VIOLATION",
      "SERVER_ERROR",
    ];

    expectedCodes.forEach((code) => {
      expect(ErrorCodes).toHaveProperty(code);
      expect(typeof ErrorCodes[code as keyof typeof ErrorCodes]).toBe("number");
    });
  });

  it("debe tener valores únicos para cada código", () => {
    const values = Object.values(ErrorCodes);
    const uniqueValues = new Set(values);

    expect(values.length).toBe(uniqueValues.size);
  });

  it("debe ser compatible con el tipo ErrorCode", () => {
    // Esta es una verificación de tipos en tiempo de compilación
    const testFunction = (code: ErrorCode) => {
      return code;
    };

    // Todos estos deberían ser válidos
    expect(testFunction(ErrorCodes.VALIDATION_ERROR)).toBe(ErrorCodes.VALIDATION_ERROR);
    expect(testFunction(ErrorCodes.SERVER_ERROR)).toBe(ErrorCodes.SERVER_ERROR);
    expect(testFunction(ErrorCodes.VALUE_NOT_FOUND)).toBe(ErrorCodes.VALUE_NOT_FOUND);
  });
});
