import * as joi from 'Joi';

const artistPaginatedRequestValidator = joi.object({
  name: joi.string().trim().min(1).max(150).optional(),
  country: joi.string().length(3).optional(),
  formationYear: joi.number().min(1500).max(new Date().getFullYear()).optional()
});

export default artistPaginatedRequestValidator;