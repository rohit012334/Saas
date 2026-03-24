import prisma from "../../config/prisma.js"
import bcrypt from "bcryptjs"
import { getFileUrl } from "../../middleware/upload.middleware.js"

// ─────────────────────────────────────────────────────────────────────────────
// STAFF CONTROLLER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get all staff for a tenant
 */
export const getAllStaff = async (req, res, next) => {
  try {
    const { tenantId } = req.user
    const { search, role, isActive } = req.query

    const where = {
      tenantId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(role && { role }),
      ...(isActive !== undefined && { isActive: isActive === "true" }),
    }

    const staff = await prisma.staff.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    res.json({ success: true, count: staff.length, data: staff })
  } catch (err) {
    next(err)
  }
}

/**
 * Get single staff member
 */
export const getStaffById = async (req, res, next) => {
  try {
    const { id } = req.params
    const { tenantId } = req.user

    const staff = await prisma.staff.findFirst({
      where: { id, tenantId },
    })

    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff member not found" })
    }

    res.json({ success: true, data: staff })
  } catch (err) {
    next(err)
  }
}

/**
 * Create new staff member
 */
export const createStaff = async (req, res, next) => {
  try {
    const { tenantId } = req.user
    const {
      name, email, password, role, phone, address, skills,
      canAccessDashboard, canAccessRepairOrders, canAccessDiagnostics,
      canAccessInventory, canAccessPartsSourcing, canAccessFleet,
      canAccessHr, canAccessCustomers, canAccessServices,
      canAccessReports, canAccessBilling, canAccessSettings
    } = req.body

    // Check if email already exists
    const existingStaff = await prisma.staff.findUnique({ where: { email } })
    if (existingStaff) {
      return res.status(400).json({ success: false, message: "Email already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Handle skills (String from frontend -> Array for backend)
    const skillsArray = skills ? skills.split(",").map(s => s.trim()) : []

    // Handle files
    const files = req.files || {}
    const idCardFrontUrl = files.idCardFront ? getFileUrl(files.idCardFront[0]) : null
    const idCardBackUrl = files.idCardBack ? getFileUrl(files.idCardBack[0]) : null
    const contractUrl = files.contract ? getFileUrl(files.contract[0]) : null
    const otherDocUrl = files.otherDoc ? getFileUrl(files.otherDoc[0]) : null

    const staff = await prisma.staff.create({
      data: {
        tenantId,
        name,
        email,
        password: hashedPassword,
        role: role || "STAFF",
        phone,
        address,
        skills: skillsArray,
        canAccessDashboard: canAccessDashboard === "true" || canAccessDashboard === true,
        canAccessRepairOrders: canAccessRepairOrders === "true" || canAccessRepairOrders === true,
        canAccessDiagnostics: canAccessDiagnostics === "true" || canAccessDiagnostics === true,
        canAccessInventory: canAccessInventory === "true" || canAccessInventory === true,
        canAccessPartsSourcing: canAccessPartsSourcing === "true" || canAccessPartsSourcing === true,
        canAccessFleet: canAccessFleet === "true" || canAccessFleet === true,
        canAccessHr: canAccessHr === "true" || canAccessHr === true,
        canAccessCustomers: canAccessCustomers === "true" || canAccessCustomers === true,
        canAccessServices: canAccessServices === "true" || canAccessServices === true,
        canAccessReports: canAccessReports === "true" || canAccessReports === true,
        canAccessBilling: canAccessBilling === "true" || canAccessBilling === true,
        canAccessSettings: canAccessSettings === "true" || canAccessSettings === true,
        idCardFrontUrl,
        idCardBackUrl,
        contractUrl,
        otherDocUrl,
      },
    })

    res.status(201).json({ success: true, message: "Staff created successfully", data: staff })
  } catch (err) {
    next(err)
  }
}

/**
 * Update staff member
 */
export const updateStaff = async (req, res, next) => {
  try {
    const { id } = req.params
    const { tenantId } = req.user
    const {
      name, email, password, role, phone, address, skills, isActive,
      canAccessDashboard, canAccessRepairOrders, canAccessDiagnostics,
      canAccessInventory, canAccessPartsSourcing, canAccessFleet,
      canAccessHr, canAccessCustomers, canAccessServices,
      canAccessReports, canAccessBilling, canAccessSettings
    } = req.body

    const existingStaff = await prisma.staff.findFirst({
      where: { id, tenantId },
    })

    if (!existingStaff) {
      return res.status(404).json({ success: false, message: "Staff member not found" })
    }

    const data = {
      name,
      email,
      role,
      phone,
      address,
      isActive: isActive === "true" || isActive === true,
      canAccessDashboard: canAccessDashboard === "true" || canAccessDashboard === true,
      canAccessRepairOrders: canAccessRepairOrders === "true" || canAccessRepairOrders === true,
      canAccessDiagnostics: canAccessDiagnostics === "true" || canAccessDiagnostics === true,
      canAccessInventory: canAccessInventory === "true" || canAccessInventory === true,
      canAccessPartsSourcing: canAccessPartsSourcing === "true" || canAccessPartsSourcing === true,
      canAccessFleet: canAccessFleet === "true" || canAccessFleet === true,
      canAccessHr: canAccessHr === "true" || canAccessHr === true,
      canAccessCustomers: canAccessCustomers === "true" || canAccessCustomers === true,
      canAccessServices: canAccessServices === "true" || canAccessServices === true,
      canAccessReports: canAccessReports === "true" || canAccessReports === true,
      canAccessBilling: canAccessBilling === "true" || canAccessBilling === true,
      canAccessSettings: canAccessSettings === "true" || canAccessSettings === true,
    }

    if (skills) {
      data.skills = skills.split(",").map(s => s.trim())
    }

    if (password) {
      data.password = await bcrypt.hash(password, 10)
    }

    // Handle files
    const files = req.files || {}
    if (files.idCardFront) data.idCardFrontUrl = getFileUrl(files.idCardFront[0])
    if (files.idCardBack) data.idCardBackUrl = getFileUrl(files.idCardBack[0])
    if (files.contract) data.contractUrl = getFileUrl(files.contract[0])
    if (files.otherDoc) data.otherDocUrl = getFileUrl(files.otherDoc[0])

    const updatedStaff = await prisma.staff.update({
      where: { id },
      data,
    })

    res.json({ success: true, message: "Staff updated successfully", data: updatedStaff })
  } catch (err) {
    next(err)
  }
}

/**
 * Delete staff member
 */
export const deleteStaff = async (req, res, next) => {
  try {
    const { id } = req.params
    const { tenantId } = req.user

    const staff = await prisma.staff.findFirst({
      where: { id, tenantId },
    })

    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff member not found" })
    }

    await prisma.staff.delete({ where: { id } })

    res.json({ success: true, message: "Staff deleted successfully" })
  } catch (err) {
    next(err)
  }
}
