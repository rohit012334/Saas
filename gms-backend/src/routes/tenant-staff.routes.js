import express from "express"
import * as staffController from "../controllers/tenant/staff.controller.js"
import { protect, authorize, authorizeStaffPermission } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/upload.middleware.js"

const router = express.Router()

// All routes are protected and require a tenant staff context
router.use(protect)

const staffUploadFields = [
  { name: "idCardFront", maxCount: 1 },
  { name: "idCardBack", maxCount: 1 },
  { name: "contract", maxCount: 1 },
  { name: "otherDoc", maxCount: 1 },
]

// Staff Management (Only Tenant Admin and Managers can manage staff)
router.get("/", authorize("TENANT_ADMIN", "MANAGER"), staffController.getAllStaff)
router.get("/:id", authorize("TENANT_ADMIN", "MANAGER"), staffController.getStaffById)

router.post(
  "/",
  authorize("TENANT_ADMIN", "MANAGER"),
  upload.fields(staffUploadFields),
  staffController.createStaff
)

router.patch(
  "/:id",
  authorize("TENANT_ADMIN", "MANAGER"),
  upload.fields(staffUploadFields),
  staffController.updateStaff
)

router.delete("/:id", authorize("TENANT_ADMIN"), staffController.deleteStaff)

export default router
