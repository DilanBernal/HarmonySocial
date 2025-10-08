import Joi from "joi";
import { artistValidations } from "../../../../application/shared/utils/regex/artistValidations";
import { findRegex } from "../../../../application/shared/utils/regexIndex";

const artistUpdateSchema = Joi.object({
  artist_name: Joi.string().min(2).max(150).regex(/n/).optional(),
  biography: Joi.string().max(2000).allow(null, "").regex(findRegex("artist_biography", artistValidations)).optional(),
  formation_year: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
  country_code: Joi.string().alphanum().min(2).max(6).optional(),
});

export default artistUpdateSchema;
