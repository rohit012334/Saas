import express from "express"
import * as tenant from "../controllers/tenant/tenant.controller.js"
import { upload } from "../middleware/upload.middleware.js"
import { validate } from "../middleware/validate.middleware.js"
import { startOnboardingSchema, verifyOtpSchema, createOrderSchema, submitDocumentsSchema } from "../validations/tenant.validation.js"

const router = express.Router()

router.post("/start", validate(startOnboardingSchema), tenant.startOnboarding)
router.post("/verify-otp", validate(verifyOtpSchema), tenant.verifyOtp)
router.post("/create-order", validate(createOrderSchema), tenant.createOrder)

const uploadFields = [
  { name: "tradeLicenseFront", maxCount: 1 },
  { name: "tradeLicenseBack", maxCount: 1 },
  { name: "ownerIdFront", maxCount: 1 },
  { name: "ownerIdBack", maxCount: 1 },
  { name: "vatCertificate", maxCount: 1 },
]

router.post("/submit-documents", upload.fields(uploadFields), validate(submitDocumentsSchema), tenant.submitDocuments)
router.post("/verify-payment", tenant.verifyPayment)
router.get("/status/:tenantId", tenant.getStatus)
router.get("/status-by-email/:email", tenant.getStatusByEmail)
router.post("/resubmit/:tenantId", upload.fields(uploadFields), tenant.resubmitDocuments)

export default router
