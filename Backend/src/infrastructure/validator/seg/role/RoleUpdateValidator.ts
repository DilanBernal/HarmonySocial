import joi from "joi";
export default joi.object({
  name: joi.string().min(3).max(50).optional(),
  description: joi.string().max(255).optional(),
});
