import express from "express"
import * as auth from "../controllers/auth/auth.controller.js"
import { validate } from "../middleware/validate.middleware.js"
import { loginSchema } from "../validations/auth.validation.js"

const router = express.Router()

router.post("/admin/login", validate(loginSchema), auth.adminLogin)
router.post("/tenant/login", validate(loginSchema), auth.tenantLogin)

export default router
