const Joi = require("joi");

const validateOrg = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
  });

  return schema.validate(data);
};

const validateUserId = (data) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = { validateOrg, validateUserId };
