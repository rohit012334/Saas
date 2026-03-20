import express from "express"
import * as admin from "../controllers/admin/tenant.controller.js"
import { protect, authorize } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/tenants/pending", protect, authorize("SUPER_ADMIN"), admin.getPendingTenants)
router.post("/tenants/:id/approve", protect, authorize("SUPER_ADMIN"), admin.approveTenant)
router.post("/tenants/:id/reject", protect, authorize("SUPER_ADMIN"), admin.rejectTenant)

export default router
