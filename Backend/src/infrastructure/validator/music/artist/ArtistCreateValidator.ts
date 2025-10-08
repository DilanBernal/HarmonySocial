import Joi from "joi";

const artistCreateSchema = Joi.object({
  artist_name: Joi.string().min(2).max(150).required(),
  biography: Joi.string().max(2000).optional(),
  formation_year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
  country_code: Joi.string().alphanum().min(2).max(6).optional(),
});

export default artistCreateSchema;
