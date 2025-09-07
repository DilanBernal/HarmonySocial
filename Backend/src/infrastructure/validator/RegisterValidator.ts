import * as joi from "joi";
import { findRegex } from "../../application/shared/utils/regex";
import { UserInstrument } from "../../domain/models/User";

const instrumentValues = Object.values(UserInstrument);

const registerSchema = joi.object({
  full_name: joi.string().trim().required().min(3).max(150).pattern(findRegex("fullNameRegex")),
  username: joi.string().trim().required().min(3).max(50).pattern(findRegex("usernameRegex")),
  email: joi.string().trim().required().min(3).max(90).pattern(findRegex("emailRegex")),
  password: joi.string().required().min(8).max(128).pattern(findRegex("passwordRegex")),
  profile_image: joi
    .string()
    .trim()
    .optional()
    .allow("", null)
    .pattern(findRegex("profileImageRegex")),
  favorite_instrument: joi
    .any()
    .valid(...instrumentValues)
    .optional()
    .allow(null),
  is_artist: joi.boolean().optional(),
});

export default registerSchema;
