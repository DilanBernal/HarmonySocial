import * as joi from "joi";
import { findRegex } from "../../application/shared/utils/regex";

const registerSchema = joi.object({
  userOrEmail: joi.string().trim().required().min(3).max(50).pattern(findRegex("userOrEmailRegex")),
  password: joi.string().required().min(8).max(128).pattern(findRegex("userOrEmailRegex")),
});

export default registerSchema;
