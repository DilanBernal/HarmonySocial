import * as joi from "joi";
import { findRegex } from "../../../../application/shared/utils/regexIndex";
import { UserInstrument } from "../../../../domain/models/User";

const instrumentValues = Object.values(UserInstrument);

const registerSchema = joi.object({
  full_name: joi.string().trim().required().min(3).max(150).pattern(findRegex("fullNameRegex")).messages({
    "string.empty": "El nombre completo es obligatorio",
    "any.required": "Debes ingresar el nombre completo",
    "string.pattern.base": "El nombre completo contiene caracteres no permitidos",
    "string.min": "El nombre completo debe tener al menos {#limit} caracteres",
    "string.max": "El nombre completo debe tener como máximo {#limit} caracteres"
  }),
  username: joi.string().trim().required().min(3).max(50).pattern(findRegex("usernameRegex")).messages({
    "string.empty": "El nombre de usuario es obligatorio",
    "any.required": "Debes ingresar el nombre de usuario",
    "string.pattern.base": "El nombre de usuario contiene caracteres no permitidos",
    "string.min": "El nombre de usuario debe tener al menos {#limit} caracteres",
    "string.max": "El nombre de usuario debe tener como máximo {#limit} caracteres"
  }),
  email: joi.string().trim().required().min(3).max(90).pattern(findRegex("emailRegex")).messages({
    "string.empty": "El correo electrónico es obligatorio",
    "any.required": "Debes ingresar el correo electrónico",
    "string.pattern.base": "El correo electrónico no tiene un formato válido",
    "string.min": "El correo electrónico debe tener al menos {#limit} caracteres",
    "string.max": "El correo electrónico debe tener como máximo {#limit} caracteres"
  }),
  password: joi.string().required().min(8).max(128).pattern(findRegex("passwordRegex")).messages({
    "string.empty": "La contraseña es obligatoria",
    "any.required": "Debes ingresar la contraseña",
    "string.pattern.base": "La contraseña no cumple con los requisitos de seguridad",
    "string.min": "La contraseña debe tener al menos {#limit} caracteres",
    "string.max": "La contraseña debe tener como máximo {#limit} caracteres"
  }),
  profile_image: joi
    .string()
    .trim()
    .optional()
    .allow("", null)
    .default("avatar1")
    .pattern(findRegex("profileImageRegex")).messages({
      "string.pattern.base": "La imagen de perfil no tiene un formato válido",
      "string.max": "La imagen de perfil debe tener como máximo {#limit} caracteres"
    }),
  favorite_instrument: joi
    .any()
    .valid(...instrumentValues)
    .optional()
    .allow(null)
});

export default registerSchema;
