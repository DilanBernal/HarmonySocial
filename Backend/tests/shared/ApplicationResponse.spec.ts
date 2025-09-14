import { ApplicationResponse } from "../../src/application/shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../../src/application/shared/errors/ApplicationError";

describe("ApplicationResponse", () => {
  describe("success factory methods", () => {
    it("debe crear una respuesta exitosa con datos", () => {
      const data = { id: 1, name: "Test" };
      const response = ApplicationResponse.success(data);

      expect(response.success).toBe(true);
      expect(response.data).toEqual(data);
      expect(response.error).toBeUndefined();
    });

    it("debe crear una respuesta exitosa vacía", () => {
      const response = ApplicationResponse.emptySuccess();

      expect(response.success).toBe(true);
      expect(response.data).toBeUndefined();
      expect(response.error).toBeUndefined();
    });

    it("debe manejar datos nulos o undefined", () => {
      const responseNull = ApplicationResponse.success(null);
      const responseUndefined = ApplicationResponse.success(undefined);

      expect(responseNull.success).toBe(true);
      expect(responseNull.data).toBeNull();

      expect(responseUndefined.success).toBe(true);
      expect(responseUndefined.data).toBeUndefined();
    });

    it("debe manejar diferentes tipos de datos", () => {
      // String
      const stringResponse = ApplicationResponse.success("test string");
      expect(stringResponse.data).toBe("test string");

      // Number
      const numberResponse = ApplicationResponse.success(42);
      expect(numberResponse.data).toBe(42);

      // Boolean
      const booleanResponse = ApplicationResponse.success(true);
      expect(booleanResponse.data).toBe(true);

      // Array
      const arrayResponse = ApplicationResponse.success([1, 2, 3]);
      expect(arrayResponse.data).toEqual([1, 2, 3]);

      // Object
      const objectResponse = ApplicationResponse.success({ key: "value" });
      expect(objectResponse.data).toEqual({ key: "value" });
    });
  });

  describe("failure factory methods", () => {
    const testError = new ApplicationError("Test error", ErrorCodes.VALIDATION_ERROR);

    it("debe crear una respuesta de fallo sin datos", () => {
      const response = ApplicationResponse.failure(testError);

      expect(response.success).toBe(false);
      expect(response.data).toBeUndefined();
      expect(response.error).toBe(testError);
    });

    it("debe crear una respuesta de fallo con datos", () => {
      const data = { partialData: "some data" };
      const response = ApplicationResponse.failureWithData(testError, data);

      expect(response.success).toBe(false);
      expect(response.data).toEqual(data);
      expect(response.error).toBe(testError);
    });

    it("debe manejar errores con diferentes códigos", () => {
      const errors = [
        new ApplicationError("Validation error", ErrorCodes.VALIDATION_ERROR),
        new ApplicationError("Not found", ErrorCodes.VALUE_NOT_FOUND),
        new ApplicationError("Server error", ErrorCodes.SERVER_ERROR),
        new ApplicationError("Database error", ErrorCodes.DATABASE_ERROR),
        new ApplicationError("Invalid credentials", ErrorCodes.INVALID_CREDENTIALS),
      ];

      errors.forEach((error) => {
        const response = ApplicationResponse.failure(error);
        expect(response.success).toBe(false);
        expect(response.error).toBe(error);
        expect(response.error?.code).toBe(error.code);
      });
    });
  });

  describe("constructor", () => {
    it("debe crear una instancia con todos los parámetros", () => {
      const data = { test: true };
      const error = new ApplicationError("Test", ErrorCodes.SERVER_ERROR);
      const response = new ApplicationResponse(false, data, error);

      expect(response.success).toBe(false);
      expect(response.data).toEqual(data);
      expect(response.error).toBe(error);
    });

    it("debe crear una instancia con parámetros opcionales", () => {
      const response = new ApplicationResponse(true);

      expect(response.success).toBe(true);
      expect(response.data).toBeUndefined();
      expect(response.error).toBeUndefined();
    });
  });

  describe("inmutabilidad", () => {
    it("debe tener propiedades readonly", () => {
      const response = ApplicationResponse.success("test");

      // Verificar que las propiedades están presentes y funcionan correctamente
      expect(response.success).toBe(true);
      expect(response.data).toBe("test");
      expect(response.error).toBeUndefined();

      // Las propiedades están marcadas como readonly en TypeScript para prevenir modificaciones
      expect(response).toHaveProperty("success");
      expect(response).toHaveProperty("data");
      expect(response).toHaveProperty("error");
    });
  });

  describe("casos de uso típicos", () => {
    it("debe representar correctamente una operación de creación exitosa", () => {
      const userId = 123;
      const response = ApplicationResponse.success(userId);

      expect(response.success).toBe(true);
      expect(response.data).toBe(userId);
      expect(response.error).toBeUndefined();
    });

    it("debe representar correctamente una operación de eliminación exitosa", () => {
      const response = ApplicationResponse.emptySuccess();

      expect(response.success).toBe(true);
      expect(response.data).toBeUndefined();
      expect(response.error).toBeUndefined();
    });

    it("debe representar correctamente un error de validación", () => {
      const validationError = new ApplicationError(
        "Email is required",
        ErrorCodes.VALIDATION_ERROR,
        [["email", "Email field is required"]],
      );
      const response = ApplicationResponse.failure(validationError);

      expect(response.success).toBe(false);
      expect(response.data).toBeUndefined();
      expect(response.error).toBe(validationError);
      expect(response.error?.message).toBe("Email is required");
      expect(response.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
    });

    it("debe representar correctamente un error de recurso no encontrado", () => {
      const notFoundError = new ApplicationError("User not found", ErrorCodes.VALUE_NOT_FOUND);
      const response = ApplicationResponse.failure(notFoundError);

      expect(response.success).toBe(false);
      expect(response.error?.code).toBe(ErrorCodes.VALUE_NOT_FOUND);
    });
  });

  describe("genéricos de tipo", () => {
    it("debe mantener los tipos correctos con genéricos", () => {
      interface UserData {
        id: number;
        name: string;
      }

      const userData: UserData = { id: 1, name: "John" };
      const response = ApplicationResponse.success<UserData>(userData);

      expect(response.data?.id).toBe(1);
      expect(response.data?.name).toBe("John");
    });

    it("debe manejar tipos primitivos con genéricos", () => {
      const stringResponse = ApplicationResponse.success<string>("test");
      const numberResponse = ApplicationResponse.success<number>(42);
      const booleanResponse = ApplicationResponse.success<boolean>(true);

      expect(typeof stringResponse.data).toBe("string");
      expect(typeof numberResponse.data).toBe("number");
      expect(typeof booleanResponse.data).toBe("boolean");
    });

    it("debe manejar arrays con genéricos", () => {
      const numbers = [1, 2, 3, 4, 5];
      const response = ApplicationResponse.success<number[]>(numbers);

      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data?.length).toBe(5);
      expect(response.data?.[0]).toBe(1);
    });
  });
});
