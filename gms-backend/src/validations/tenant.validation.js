import Joi from "joi"

export const startOnboardingSchema = Joi.object({
  ownerName: Joi.string().min(3).max(50).required(),
  email:     Joi.string().email().required(),
  phone:     Joi.string().required(),
})

export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp:   Joi.string().length(6).required(),
})

export const createOrderSchema = Joi.object({
  tenantId: Joi.string().required(),
  planId:   Joi.string().required(),
  interval: Joi.string().valid("MONTHLY", "YEARLY").default("MONTHLY"),
})

export const submitDocumentsSchema = Joi.object({
  tenantId:           Joi.string().required(),
  garageName:         Joi.string().min(2).required(),
  garageAddress:      Joi.string().min(5).required(),
  city:               Joi.string().required(),
  country:            Joi.string().required(),
  garagePhone:        Joi.string().required(),
  garageEmail:        Joi.string().email().required(),
  numberOfBranches:   Joi.number().min(1).required(),
  serviceTypes:       Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).required(),
  trnNumber:          Joi.string().required(),
  companyBillingName: Joi.string().required(),
  billingAddress:     Joi.string().required(),
})
