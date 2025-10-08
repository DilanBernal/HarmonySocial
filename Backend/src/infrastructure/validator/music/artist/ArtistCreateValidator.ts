import Joi from "joi";
import { findRegex } from "../../../../application/shared/utils/regexIndex";
import { artistValidations } from "../../../../application/shared/utils/regex/artistValidations";

const artistCreateSchema = Joi.object({
  artist_name: Joi.string().min(2).max(150).regex(findRegex("artist_name", artistValidations)).required(),
  biography: Joi.string().max(2000).regex(findRegex("artist_biography", artistValidations)).optional(),
  formation_year: Joi.number().positive().integer().min(1900).max(new Date().getFullYear()).required(),
  country_code: Joi.string().alphanum().min(2).max(6).optional().regex(findRegex("country_code", artistValidations)),
});

export default artistCreateSchema;
