const joi = require("joi");


const registerSchema = joi.object({
  Email: joi.string().email().required(),
  Password: joi.string().min(6).required(),
});


const loginSchema = joi.object({
  Email: joi.string().email().required(),
  Password: joi.string().required(),
});

module.exports = { registerSchema  , loginSchema };