// src/middleware/auth.middleware.js
import prisma from "../config/prisma.js"
import { verifyToken } from "../utils/jwt.js"

/**
 * Protect routes - Verification of JWT
 */
export const protect = async (req, res, next) => {
  let token
  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized to access this route" })
  }

  try {
    const decoded = verifyToken(token)
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" })
    }

    // 1. Check SuperAdmin
    const admin = await prisma.superAdmin.findUnique({ where: { id: decoded.id } })
    if (admin) {
      req.user = admin
      req.userType = "SUPER_ADMIN"
      return next()
    }

    // 2. Check Tenant Staff (includes Tenant Admin)
    const staff = await prisma.staff.findUnique({ 
      where: { id: decoded.id },
      include: { tenant: true }
    })
    
    if (staff) {
      if (!staff.isActive) return res.status(403).json({ success: false, message: "Account disabled" })
      if (staff.tenant.status !== "ACTIVE") return res.status(403).json({ success: false, message: "Tenant account is not active" })
      
      req.user = staff
      req.userType = "STAFF"
      req.tenantId = staff.tenantId
      return next()
    }

    // 3. Fallback check for Tenant (Onboarding state / Old legacy)
    const tenant = await prisma.tenant.findUnique({ where: { id: decoded.id } })
    if (tenant) {
       req.user = tenant
       req.userType = "TENANT_OWNER"
       return next()
    }

    return res.status(401).json({ success: false, message: "User not found" })
  } catch (err) {
    return res.status(401).json({ success: false, message: "Authorization failed" })
  }
}

/**
 * Grant access to specific roles (SUPER_ADMIN, TENANT_ADMIN, MANAGER, etc.)
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not authenticated" })
    }
    
    // Logic: 
    // If SuperAdmin, they have their own roles.
    // If Staff, they have Staff roles.

    const userRole = req.userType === "SUPER_ADMIN" ? req.user.role : req.user.role
    
    if (!roles.includes(userRole) && !roles.includes(req.userType)) {
       return res.status(403).json({ success: false, message: `Access denied for role: ${userRole}` })
    }

    next()
  }
}

/**
 * Grant access based on granular permissions for Super Admin Staff
 * @param {string} permission - e.g. 'tenants', 'subs', 'banners', etc.
 */
export const authorizePermission = (permission) => {
  return (req, res, next) => {
    if (req.userType !== "SUPER_ADMIN") {
      return res.status(403).json({ success: false, message: "Only Super Admin staff can access this" })
    }

    // 1. If absolute SUPER_ADMIN role, allow everything
    if (req.user.role === "SUPER_ADMIN") {
      return next()
    }

    // 2. Mapping permission key to DB field
    const permissionMap = {
      tenants: "canManageTenants",
      subs:    "canManageSubs",
      banners: "canManageBanners",
      announcements: "canManageAnnouncements",
      support: "canManageSupport",
      cms:     "canManageCms"
    }

    const field = permissionMap[permission]
    if (field && req.user[field]) {
      return next()
    }

    return res.status(403).json({ 
      success: false, 
      message: `Access denied. You do not have permission to manage ${permission}.` 
    })
  }
}

/**
 * Grant access based on granular permissions for Tenant Staff
 * @param {string} module - e.g. 'dashboard', 'repair_orders', 'inventory', etc.
 */
export const authorizeStaffPermission = (module) => {
  return (req, res, next) => {
    if (req.userType !== "STAFF") {
      return res.status(403).json({ success: false, message: "Only tenant staff can access this" })
    }

    // 1. If TENANT_ADMIN, allow everything (highest level in tenant)
    if (req.user.role === "TENANT_ADMIN") {
      return next()
    }

    // 2. Mapping module key to DB field
    const permissionMap = {
      dashboard:      "canAccessDashboard",
      repair_orders:  "canAccessRepairOrders",
      diagnostics:    "canAccessDiagnostics",
      inventory:      "canAccessInventory",
      parts_sourcing: "canAccessPartsSourcing",
      fleet:          "canAccessFleet",
      hr:             "canAccessHr",
      customers:      "canAccessCustomers",
      services:       "canAccessServices",
      reports:        "canAccessReports",
      billing:        "canAccessBilling",
      settings:       "canAccessSettings"
    }

    const field = permissionMap[module]
    if (field && req.user[field]) {
      return next()
    }

    return res.status(403).json({ 
      success: false, 
      message: `Access denied. You do not have permission to access ${module}.` 
    })
  }
}

