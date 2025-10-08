import * as joi from 'joi';
import { userFindRegex } from '../../../../application/shared/utils/regexIndex';

const userSearchParamsSchema = joi.object({
  email: joi.string().email().optional().allow(null),
  full_name: joi.string().trim().optional().allow(null).min(3).max(150).pattern(userFindRegex("fullNameRegex")).messages({
    "string.pattern.base": "El nombre completo contiene caracteres no permitidos",
    "string.min": "El nombre completo debe tener al menos {#limit} caracteres",
    "string.max": "El nombre completo debe tener como máximo {#limit} caracteres"
  }),
  username: joi.string().trim().optional().min(3).allow(null).max(50).pattern(userFindRegex("usernameRegex")).messages({
    "string.pattern.base": "El nombre de usuario contiene caracteres no permitidos",
    "string.min": "El nombre de usuario debe tener al menos {#limit} caracteres",
    "string.max": "El nombre de usuario debe tener como máximo {#limit} caracteres"
  }),
});

export default userSearchParamsSchema;