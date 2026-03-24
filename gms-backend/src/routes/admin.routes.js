import express from "express"
import * as admin from "../controllers/super-admin/admin.controller.js"
import * as banner from "../controllers/super-admin/banner.controller.js"
import * as cms from "../controllers/super-admin/cms.controller.js"
import { protect, authorize, authorizePermission } from "../middleware/auth.middleware.js"
import { validate } from "../middleware/validate.middleware.js"
import { adminStaffSchema } from "../validations/admin.validation.js"
import { upload } from "../middleware/upload.middleware.js"

const router = express.Router()

// Admin Staff / Access Management (Only those who have SUPER_ADMIN role can manage OTHER admins)
router.get("/staff", protect, authorize("SUPER_ADMIN"), admin.getAdminStaff)
router.post("/staff", protect, authorize("SUPER_ADMIN"), validate(adminStaffSchema), admin.addAdminStaff)
router.put("/staff/:id", protect, authorize("SUPER_ADMIN"), validate(adminStaffSchema), admin.updateAdminStaff)
router.delete("/staff/:id", protect, authorize("SUPER_ADMIN"), admin.deleteAdminStaff)

// Tenant Management (Require 'tenants' permission)
router.get("/tenants/pending", protect, authorizePermission("tenants"), admin.getPendingTenants)
router.post("/tenants/:id/approve", protect, authorizePermission("tenants"), admin.approveTenant)
router.post("/tenants/:id/reject", protect, authorizePermission("tenants"), admin.rejectTenant)

// Banner Management (Require 'banners' permission)
router.get("/banners", protect, authorizePermission("banners"), banner.getBanners)
router.post("/banners", protect, authorizePermission("banners"), upload.single("image"), banner.createBanner)
router.put("/banners/:id", protect, authorizePermission("banners"), upload.single("image"), banner.updateBanner)
router.delete("/banners/:id", protect, authorizePermission("banners"), banner.deleteBanner)

// CMS content Management (Require 'cms' permission)
router.get("/cms", protect, authorizePermission("cms"), cms.getAllCms)
router.post("/cms", protect, authorizePermission("cms"), cms.createCms)
router.put("/cms/:id", protect, authorizePermission("cms"), cms.updateCms)
router.delete("/cms/:id", protect, authorizePermission("cms"), cms.deleteCms)

export default router

