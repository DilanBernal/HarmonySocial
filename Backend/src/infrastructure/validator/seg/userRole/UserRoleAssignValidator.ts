import joi from "joi";
export default joi.object({
  userId: joi.number().integer().positive().required(),
  roleId: joi.number().integer().positive().required(),
});
