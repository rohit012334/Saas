import express from "express"
import * as plans from "../controllers/plans/plans.controller.js"

const router = express.Router()

router.get("/", plans.getPlans)

export default router
