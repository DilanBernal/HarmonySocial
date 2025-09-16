import { findRegex, userValidations } from "../../src/application/shared/utils/regex";

describe("Regex Utils", () => {
  describe("userValidations", () => {
    it("debe contener todas las validaciones esperadas", () => {
      const validationNames = userValidations.map((v) => v.name);

      expect(validationNames).toContain("usernameRegex");
      expect(validationNames).toContain("fullNameRegex");
      expect(validationNames).toContain("userOrEmailRegex");
      expect(validationNames).toContain("passwordRegex");
      expect(validationNames).toContain("emailRegex");
      expect(validationNames).toContain("profileImageRegex");
    });

    it("debe tener el formato correcto para cada validación", () => {
      userValidations.forEach((validation) => {
        expect(validation).toHaveProperty("name");
        expect(validation).toHaveProperty("regex");
        expect(typeof validation.name).toBe("string");
        expect(validation.regex).toBeInstanceOf(RegExp);
      });
    });
  });

  describe("findRegex", () => {
    it("debe retornar el regex correcto para usernameRegex", () => {
      const regex = findRegex("usernameRegex");

      // Casos válidos
      expect(regex.test("johndoe")).toBe(true);
      expect(regex.test("user123")).toBe(true);
      expect(regex.test("test_user")).toBe(true);
      expect(regex.test("user-name")).toBe(true);
      expect(regex.test("user#123")).toBe(true);
      expect(regex.test("user$test")).toBe(true);
      expect(regex.test("user|name")).toBe(true);
      expect(regex.test("user°test")).toBe(true);
      expect(regex.test("user.name")).toBe(true);
      expect(regex.test("user+name")).toBe(true);

      // Casos inválidos
      expect(regex.test("a")).toBe(false); // Muy corto
      expect(regex.test("")).toBe(false); // Vacío
      expect(regex.test("a".repeat(51))).toBe(false); // Muy largo
      expect(regex.test("user@name")).toBe(false); // Carácter no permitido
      expect(regex.test("user name")).toBe(false); // Espacios
    });

    it("debe retornar el regex correcto para fullNameRegex", () => {
      const regex = findRegex("fullNameRegex");

      // Casos válidos
      expect(regex.test("John Doe")).toBe(true);
      expect(regex.test("María José García")).toBe(true);
      expect(regex.test("Jean-Paul")).toBe(true);
      expect(regex.test("O'Connor")).toBe(true);
      expect(regex.test("José María")).toBe(true);
      expect(regex.test("Ana Sofía")).toBe(true);
      expect(regex.test("François")).toBe(true);
      expect(regex.test("Müller")).toBe(true);
      expect(regex.test("Çelik")).toBe(true);

      // Casos inválidos
      expect(regex.test("")).toBe(false); // Vacío
      expect(regex.test("123")).toBe(false); // Solo números
      expect(regex.test("John@Doe")).toBe(false); // Caracteres especiales no permitidos
      expect(regex.test("Name With Too Many Spaces In Between Words")).toBe(false); // Demasiadas palabras
    });

    it("debe retornar el regex correcto para emailRegex", () => {
      const regex = findRegex("emailRegex");

      // Casos válidos
      expect(regex.test("test@example.com")).toBe(true);
      expect(regex.test("user.name@domain.org")).toBe(true);
      expect(regex.test("user+tag@example.co.uk")).toBe(true);
      expect(regex.test("123@numbers.net")).toBe(true);
      expect(regex.test("test_email@sub.domain.com")).toBe(true);

      // Casos inválidos
      expect(regex.test("")).toBe(false); // Vacío
      expect(regex.test("invalid-email")).toBe(false); // Sin @
      expect(regex.test("@domain.com")).toBe(false); // Sin usuario
      expect(regex.test("user@")).toBe(false); // Sin dominio
      expect(regex.test("user@domain")).toBe(false); // Sin TLD
      expect(regex.test("user@@domain.com")).toBe(false); // Doble @
    });

    it("debe retornar el regex correcto para passwordRegex", () => {
      const regex = findRegex("passwordRegex");

      // Casos válidos
      expect(regex.test("Password123!")).toBe(true);
      expect(regex.test("MySecure$Pass1")).toBe(true);
      expect(regex.test("Complex@Password2")).toBe(true);
      expect(regex.test("StrongP@ss3")).toBe(true);

      // Casos inválidos
      expect(regex.test("")).toBe(false); // Vacío
      expect(regex.test("password")).toBe(false); // Sin mayúscula, número o especial
      expect(regex.test("PASSWORD")).toBe(false); // Sin minúscula, número o especial
      expect(regex.test("Password")).toBe(false); // Sin número o especial
      expect(regex.test("Password123")).toBe(false); // Sin carácter especial
      expect(regex.test("Pass1!")).toBe(false); // Muy corto
      expect(regex.test("pass123!")).toBe(false); // Sin mayúscula
    });

    it("debe retornar el regex correcto para profileImageRegex", () => {
      const regex = findRegex("profileImageRegex");

      // Casos válidos
      expect(regex.test("https://example.com/image.jpg")).toBe(true);
      expect(regex.test("http://domain.org/photo.png")).toBe(true);
      expect(regex.test("avatar1")).toBe(true);
      expect(regex.test("avatar2")).toBe(true);
      expect(regex.test("avatar3")).toBe(true);
      expect(regex.test("avatar4")).toBe(true);
      expect(regex.test("avatar5")).toBe(true);
      expect(regex.test("avatar6")).toBe(true);
      expect(regex.test("avatar7")).toBe(true);
      expect(regex.test("avatar8")).toBe(true);

      // Casos inválidos
      expect(regex.test("")).toBe(false); // Vacío
      expect(regex.test("not-a-url")).toBe(false); // No es URL
      expect(regex.test("file://local/image.jpg")).toBe(false); // Protocolo no permitido
    });

    it("debe retornar el regex correcto para userOrEmailRegex", () => {
      const regex = findRegex("userOrEmailRegex");

      // Casos válidos como username
      expect(regex.test("johndoe")).toBe(true);
      expect(regex.test("user123")).toBe(true);
      expect(regex.test("test_user")).toBe(true);

      // Casos válidos como email
      expect(regex.test("test@example.com")).toBe(true);
      expect(regex.test("user.name@domain.org")).toBe(true);

      // Casos inválidos
      expect(regex.test("")).toBe(false); // Vacío
      expect(regex.test("a")).toBe(false); // Muy corto para username
      expect(regex.test("@domain.com")).toBe(false); // Email inválido
      expect(regex.test("user@")).toBe(false); // Email incompleto
    });

    it("debe lanzar error si no encuentra el regex", () => {
      expect(() => {
        findRegex("nonExistentRegex");
      }).toThrow();
    });
  });

  describe("Casos de borde y validaciones específicas", () => {
    it("debe validar usernames con caracteres especiales permitidos", () => {
      const regex = findRegex("usernameRegex");

      // Todos los caracteres especiales permitidos
      expect(regex.test("user_name")).toBe(true);
      expect(regex.test("user*name")).toBe(true);
      expect(regex.test("user-name")).toBe(true);
      expect(regex.test("user#name")).toBe(true);
      expect(regex.test("user$name")).toBe(true);
      expect(regex.test("user!name")).toBe(true);
      expect(regex.test("user|name")).toBe(true);
      expect(regex.test("user°name")).toBe(true);
      expect(regex.test("user.name")).toBe(true);
      expect(regex.test("user+name")).toBe(true);
    });

    it("debe validar nombres con acentos y caracteres especiales", () => {
      const regex = findRegex("fullNameRegex");

      // Acentos españoles
      expect(regex.test("José María")).toBe(true);
      expect(regex.test("María José")).toBe(true);

      // Caracteres especiales
      expect(regex.test("Jean-Pierre")).toBe(true);
      expect(regex.test("O'Connor")).toBe(true);
      expect(regex.test("Van Der Berg")).toBe(true);

      // Caracteres internacionales
      expect(regex.test("François Müller")).toBe(true);
      expect(regex.test("Ñoño")).toBe(true);
    });

    it("debe validar emails con diferentes formatos válidos", () => {
      const regex = findRegex("emailRegex");

      // Subdominios
      expect(regex.test("user@mail.example.com")).toBe(true);
      expect(regex.test("test@subdomain.domain.co.uk")).toBe(true);

      // Caracteres especiales en la parte local
      expect(regex.test("user.name@example.com")).toBe(true);
      expect(regex.test("user+tag@example.com")).toBe(true);
      expect(regex.test("user_name@example.com")).toBe(true);

      // Números
      expect(regex.test("123456@numbers.org")).toBe(true);
      expect(regex.test("user123@example123.com")).toBe(true);
    });

    it("debe validar contraseñas con diferentes combinaciones", () => {
      const regex = findRegex("passwordRegex");

      // Diferentes caracteres especiales
      expect(regex.test("Password1!")).toBe(true);
      expect(regex.test("Password1@")).toBe(true);
      expect(regex.test("Password1#")).toBe(true);
      expect(regex.test("Password1$")).toBe(true);
      expect(regex.test("Password1%")).toBe(true);
      expect(regex.test("Password1^")).toBe(true);
      expect(regex.test("Password1&")).toBe(true);
      expect(regex.test("Password1*")).toBe(true);

      // Longitudes mínimas
      expect(regex.test("Pass1!")).toBe(false); // Menos de 8 caracteres
      expect(regex.test("Password1!")).toBe(true); // 10 caracteres
    });

    it("debe validar URLs con diferentes protocolos", () => {
      const regex = findRegex("profileImageRegex");

      // Protocolos válidos
      expect(regex.test("https://example.com/image.jpg")).toBe(true);
      expect(regex.test("http://example.com/image.jpg")).toBe(true);

      expect(regex.test("avatar1")).toBe(true);
      expect(regex.test("avatar2")).toBe(true);
      expect(regex.test("avatar3")).toBe(true);
      expect(regex.test("avatar4")).toBe(true);
      expect(regex.test("avatar5")).toBe(true);
      expect(regex.test("avatar6")).toBe(true);
      expect(regex.test("avatar7")).toBe(true);
      expect(regex.test("avatar8")).toBe(true);

      // Con parámetros
      expect(regex.test("https://example.com/image.jpg?size=large")).toBe(true);
      expect(regex.test("https://example.com/path/to/image.png")).toBe(true);

      // Subdominios
      expect(regex.test("https://cdn.example.com/images/profile.jpg")).toBe(true);
    });
  });
});
