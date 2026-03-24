import express from "express"
import * as banner from "../controllers/super-admin/banner.controller.js"
import * as cms from "../controllers/super-admin/cms.controller.js"

const router = express.Router()

router.get("/banners", banner.getPublicBanners)
router.get("/cms", cms.getPublicCms)

export default router
