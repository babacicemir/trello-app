const Joi = require("joi")

const loginSchema = Joi.object({

  email: Joi.string().email().required().messages({
    "string.base": "Email should be a type of 'text'",
    "string.empty": "Email cannot be an empty field",
    "string.email": "Email should be a valid email address",
    "any.required": "Email is a required field"
  }),

  password: Joi.string().pattern(/^[a-zA-Z0-9]+$/).min(5).max(15).required().messages({
    "string.base": "Password should be a type of 'text'",
    "string.empty": "Password cannot be an empty field",
    "string.min": "Password should have a minimum length of {#limit}",
    "string.max": "Password should have a maximum length of {#limit}",
    "string.pattern.base": "Password should only contain alphanumeric characters",
    "any.required": "Password is a required field",
  })
})

function validateLogin (req, res, next) {
  const { error, value } = loginSchema.validate(req.body, { abortEarly: false })

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message)
    return res.status(400).json({ errors: errorMessages })
  }
  req.body = value
  next()
}

const signupSchema = Joi.object({
  firstName: Joi.string().required().messages({
    "string.base": "First name should be a type of 'text'",
    "string.empty": "First name cannot be an empty field",
    "any.required": "First name is a required field"
  }),
  lastName: Joi.string().required().messages({
    "string.base": "Last name should be a type of 'text'",
    "string.empty": "Last name cannot be an empty field",
    "any.required": "Last name is a required field"
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email should be a type of 'text'",
    "string.empty": "Email cannot be an empty field",
    "string.email": "Email should be a valid email address",
    "any.required": "Email is a required field"
  }),
  password: Joi.string().pattern(/^[a-zA-Z0-9]+$/).min(5).max(15).required().messages({
    "string.base": "Password should be a type of 'text'",
    "string.empty": "Password cannot be an empty field",
    "string.min": "Password should have a minimum length of {#limit}",
    "string.max": "Password should have a maximum length of {#limit}",
    "string.pattern.base": "Password should only contain alphanumeric characters",
    "any.required": "Password is a required field",
  })
})

const signupValidate = (req, res, next) => {
  const { error, value } = signupSchema.validate(req.body, { abortEarly: false })
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message)
    return res.status(400).json({ errors: errorMessages })
  }
  req.body = value
  next()
}

const inviteSchema = Joi.object({
  idBoard: Joi.string().required().messages({
    "any.required": "Board ID is required.",
    "string.base": "Board ID must be a string.",
    "string.empty": "Board ID cannot be an empty field"
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required.",
    "string.empty": "Email must not be empty.",
    "string.email": "Email must be a valid email address.",
  }),
})

const inviteValidate = (req, res, next) => {
  const { error, value } = inviteSchema.validate(req.body, { abortEarly: false })
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message)
    return res.status(400).json({ errors: errorMessages })
  }
  req.body = value
  next()
}

const boardSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Board name is required",
    "string.base": "Board name must be a string",
    "string.empty": "Board name must not be empty",
  }),
  users: Joi.array().items(
    Joi.object({
      email: Joi.string().email().required().messages({
        "any.required": "User email is required",
        "string.base": "User email must be a string",
        "string.empty": "User email must not be empty",
        "string.email": "User email must be a valid email address",
      }),
      role: Joi.string().valid("admin", "member", "guest").messages({
        "string.base": "User role must be a string",
        "any.only": "User role must be one of 'admin', 'member', or 'guest'",
      }),
    })
  ),
})

const boardValidate = (req, res, next) => {
  const { error, value } = boardSchema.validate(req.body, { abortEarly: false })
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message)
    return res.status(400).json({ errors: errorMessages })
  }
  req.body = value
  next()
}

const columnSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Column name is required",
    "string.base": "Column must be a string",
    "string.empty": "Column name is empty"
  }),
  boardId: Joi.string().required().messages({
    "any.required": "Board ID is required",
    "string.base": "Board ID must be string",
    "string.empty": "Board ID is empty"
  }),

  default: Joi.boolean().messages({
    "boolean.base": "Default must be boolean"
  })
})


const columnValidate = (req, res, next) => {
  const { error, value } = columnSchema.validate(req.body, { abortEarly: false })
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message)
    return res.status(400).json({ errors: errorMessages })
  }
  req.body = value
  next()
}

module.exports = {
  validateLogin,
  signupValidate,
  inviteValidate,
  boardValidate,
  columnValidate
}
