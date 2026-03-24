import Joi from "joi"

export const adminStaffSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).allow('', null).optional(),
  role: Joi.string().valid("SUPER_ADMIN", "SUPPORT_MANAGER", "BILLING_ADMIN", "TECHNICAL_ADMIN").default("SUPPORT_MANAGER"),
  phone: Joi.string().allow('', null).optional(),

  isActive: Joi.boolean().default(true),
  status: Joi.string().valid("Active", "Inactive").optional(),
  
  // Modular Permissions (Explicit flags)
  canManageTenants: Joi.boolean().optional(),
  canManageSubs: Joi.boolean().optional(),
  canManageBanners: Joi.boolean().optional(),
  canManageAnnouncements: Joi.boolean().optional(),
  canManageSupport: Joi.boolean().optional(),
  canManageCms: Joi.boolean().optional(),

  // Permission Array (Handled for frontend convenience)
  permissions: Joi.array().items(
    Joi.string().valid('tenants', 'subs', 'banners', 'announcements', 'support', 'cms')
  ).optional()
})

