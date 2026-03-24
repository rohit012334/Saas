import prisma from "../../config/prisma.js"

// @desc    Get all CMS content
// @route   GET /api/admin/cms
// @access  Private/Admin
export const getAllCms = async (req, res, next) => {
  try {
    const { type, target } = req.query
    const where = {}
    if (type) where.type = type
    if (target) where.target = target

    const content = await prisma.cmsContent.findMany({
      where,
      orderBy: { priority: "desc" },
    })

    res.json({ success: true, count: content.length, data: content })
  } catch (err) {
    next(err)
  }
}

// @desc    Create CMS content
// @route   POST /api/admin/cms
// @access  Private/Admin
export const createCms = async (req, res, next) => {
  try {
    const { type, title, content, target, isActive, priority } = req.body

    const cms = await prisma.cmsContent.create({
      data: {
        type,
        title,
        content,
        target: target || "USER",
        isActive: isActive !== undefined ? isActive : true,
        priority: priority !== undefined ? parseInt(priority) : 0,
      },
    })

    res.status(201).json({ success: true, data: cms })
  } catch (err) {
    next(err)
  }
}

// @desc    Update CMS content
// @route   PUT /api/admin/cms/:id
// @access  Private/Admin
export const updateCms = async (req, res, next) => {
  try {
    const { id } = req.params
    const { type, title, content, target, isActive, priority } = req.body

    const existing = await prisma.cmsContent.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ success: false, message: "Content not found" })

    const cms = await prisma.cmsContent.update({
      where: { id },
      data: {
        type: type || existing.type,
        title: title || existing.title,
        content: content || existing.content,
        target: target || existing.target,
        isActive: isActive !== undefined ? isActive : existing.isActive,
        priority: priority !== undefined ? parseInt(priority) : existing.priority,
      },
    })

    res.json({ success: true, data: cms })
  } catch (err) {
    next(err)
  }
}

// @desc    Delete CMS content
// @route   DELETE /api/admin/cms/:id
// @access  Private/Admin
export const deleteCms = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.cmsContent.delete({ where: { id } })
    res.json({ success: true, message: "Content deleted successfully" })
  } catch (err) {
    next(err)
  }
}

// @desc    Get CMS content for public view
// @route   GET /api/common/cms
// @access  Public
export const getPublicCms = async (req, res, next) => {
  try {
    const { type, target } = req.query
    const where = { isActive: true }
    if (type) where.type = type
    if (target) where.target = target

    const content = await prisma.cmsContent.findMany({
      where,
      orderBy: { priority: "desc" },
    })

    // If it's policy/terms (which are usually single items), return the first one or the whole list
    res.json({ success: true, data: content })
  } catch (err) {
    next(err)
  }
}
