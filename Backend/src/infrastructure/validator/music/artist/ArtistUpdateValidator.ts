import Joi from "joi";

const artistUpdateSchema = Joi.object({
  artist_name: Joi.string().min(2).max(150).optional(),
  biography: Joi.string().max(2000).allow(null, "").optional(),
  formation_year: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
  country_code: Joi.string().alphanum().min(2).max(6).optional(),
}).min(1);

export default artistUpdateSchema;
