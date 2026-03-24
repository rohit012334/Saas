import prisma from "../../config/prisma.js"
import { getFileUrl } from "../../middleware/upload.middleware.js"

// @desc    Get all banners
// @route   GET /api/admin/banners
// @access  Private/Admin
export const getBanners = async (req, res, next) => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { priority: "desc" },
    })

    res.json({ success: true, count: banners.length, data: banners })
  } catch (err) {
    next(err)
  }
}

// @desc    Create new banner
// @route   POST /api/admin/banners
// @access  Private/Admin
export const createBanner = async (req, res, next) => {
  try {
    const { title, linkUrl, target, isActive, priority } = req.body

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Banner image is required" })
    }

    const imageUrl = getFileUrl(req.file)

    const banner = await prisma.banner.create({
      data: {
        title,
        imageUrl,
        linkUrl,
        target: target || "TENANT",
        isActive: isActive === "false" ? false : true,
        priority: parseInt(priority) || 0,
      },
    })

    res.status(201).json({ success: true, data: banner })
  } catch (err) {
    next(err)
  }
}

// @desc    Update banner
// @route   PUT /api/admin/banners/:id
// @access  Private/Admin
export const updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, linkUrl, target, isActive, priority } = req.body

    const existingBanner = await prisma.banner.findUnique({ where: { id } })
    if (!existingBanner) {
      return res.status(404).json({ success: false, message: "Banner not found" })
    }

    let imageUrl = existingBanner.imageUrl
    if (req.file) {
      imageUrl = getFileUrl(req.file)
    }

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existingBanner.title,
        imageUrl,
        linkUrl: linkUrl !== undefined ? linkUrl : existingBanner.linkUrl,
        target: target !== undefined ? target : existingBanner.target,
        isActive: isActive !== undefined ? (isActive === "false" ? false : true) : existingBanner.isActive,
        priority: priority !== undefined ? parseInt(priority) : existingBanner.priority,
      },
    })

    res.json({ success: true, data: banner })
  } catch (err) {
    next(err)
  }
}

// @desc    Delete banner
// @route   DELETE /api/admin/banners/:id
// @access  Private/Admin
export const deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params

    const existingBanner = await prisma.banner.findUnique({ where: { id } })
    if (!existingBanner) {
      return res.status(404).json({ success: false, message: "Banner not found" })
    }

    await prisma.banner.delete({ where: { id } })

    res.json({ success: true, message: "Banner deleted successfully" })
  } catch (err) {
    next(err)
  }
}

// @desc    Get banners for public/tenant view
// @route   GET /api/public/banners
// @access  Public
export const getPublicBanners = async (req, res, next) => {
  try {
    const { target } = req.query
    const where = { isActive: true }
    if (target) {
      where.target = target // e.g., 'TENANT' or 'SUPER_ADMIN'
    }

    const banners = await prisma.banner.findMany({
      where,
      orderBy: { priority: "desc" },
    })

    res.json({ success: true, count: banners.length, data: banners })
  } catch (err) {
    next(err)
  }
}
