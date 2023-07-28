const Joi = require("joi");
  const schema = Joi.object({
    FirstName: Joi.string().required(),
    LastName: Joi.string().required(),
    UserName: Joi.string().required(),
    Password: Joi.string().required(),
    PhoneNumber: Joi.string().required(),
    Email: Joi.string().email().required(),
    Address: Joi.string().required(),
    Role: Joi.string(),
  });
module.exports =  schema