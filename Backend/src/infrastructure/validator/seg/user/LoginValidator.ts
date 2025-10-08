import * as joi from "joi";
import { findRegex, userFindRegex, userValidations } from "../../../../application/shared/utils/regexIndex";

const loginSchema = joi.object({
  userOrEmail: joi.string().trim().min(3).max(50).pattern(userFindRegex("userOrEmailRegex")).required(),
  password: joi.string().min(8).max(128).pattern(userFindRegex("passwordRegex")).required(),
});

export default loginSchema;
