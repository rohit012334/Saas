import Joi from "joi"

export const bannerSchema = Joi.object({
  title: Joi.string().allow("", null).optional(),
  linkUrl: Joi.string().uri().allow("", null).optional(),
  target: Joi.string().valid("TENANT", "USER", "MECHANIC").default("TENANT"),
  isActive: Joi.boolean().default(true),
  priority: Joi.number().integer().min(0).default(0),
})
