const Joi =require('joi');
const JoiPasswordComplexity = require('joi-password-complexity')

const complexityOptions = {
  min: 8,
  max: 50,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

function userValidation(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(3).required().email(),
    password: JoiPasswordComplexity(complexityOptions).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password'))
  }).unknown();
  
  return schema.validate(user)
}

function loginValidation(user) {
  const schema = Joi.object({
    email: Joi.string().min(2).max(255).required().email(),
    password: Joi.string().min(2).max(255).required(),
  }).unknown();

  return schema.validate(user)
}

module.exports= {userValidation, loginValidation}