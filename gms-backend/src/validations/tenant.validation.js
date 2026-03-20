import Joi from "joi"

export const startOnboardingSchema = Joi.object({
  ownerName: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
})

export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
})

export const createOrderSchema = Joi.object({
  tenantId: Joi.string().required(),
  planId: Joi.string().required(),
  interval: Joi.string().valid("MONTHLY", "YEARLY").default("MONTHLY"),
})
