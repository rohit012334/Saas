import express from "express"
import * as settings from "../controllers/tenant/settings.controller.js"
import { protect, authorize, authorizeStaffPermission } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/upload.middleware.js"

const router = express.Router()

// All routes are protected and require a tenant staff context
router.use(protect)

// Get platform settings (Required for setting state in frontend)
router.get("/platform", authorizeStaffPermission("settings"), settings.getPlatformSettings)

// Update platform settings (Requires settings permission)
router.patch(
  "/platform",
  authorizeStaffPermission("settings"),
  upload.single("logo"),
  settings.updatePlatformSettings
)

export default router
