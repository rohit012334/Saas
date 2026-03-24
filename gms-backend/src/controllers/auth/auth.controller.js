import prisma from "../../config/prisma.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../../utils/jwt.js"


export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const admin = await prisma.superAdmin.findUnique({ where: { email } })
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    if (!admin.isActive) {
      return res.status(403).json({ success: false, message: "This admin account is inactive" })
    }

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const permissions = []
    if (admin.role === "SUPER_ADMIN") permissions.push("full_access")
    if (admin.canManageTenants) permissions.push("tenants")
    if (admin.canManageSubs) permissions.push("subs")
    if (admin.canManageBanners) permissions.push("banners")
    if (admin.canManageAnnouncements) permissions.push("announcements")
    if (admin.canManageSupport) permissions.push("support")
    if (admin.canManageCms) permissions.push("cms")

    const token = generateToken(admin.id)
    res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions,
      },
    })
  } catch (err) {
    next(err)
  }
}


/**
 * Tenant / Staff Login
 */
export const tenantLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const staff = await prisma.staff.findUnique({ 
      where: { email },
      include: { tenant: true }
    })

    if (!staff) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    if (staff.role === "MECHANIC") {
      return res.status(403).json({ success: false, message: "Mechanics must use the dedicated Mobile App." })
    }

    // Check if the business/tenant is active
    if (staff.tenant.status !== "ACTIVE") {
      return res.status(403).json({ success: false, message: `Business is ${staff.tenant.status}` })
    }

    // Check if staff account is active
    if (!staff.isActive) {
      return res.status(403).json({ success: false, message: "Account disabled" })
    }

    const isMatch = await bcrypt.compare(password, staff.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const permissions = []
    
    // TENANT_ADMIN gets all permissions by default
    if (staff.role === "TENANT_ADMIN") {
      permissions.push("full_access")
    } else {
      if (staff.canAccessDashboard) permissions.push("dashboard")
      if (staff.canAccessRepairOrders) permissions.push("repair_orders")
      if (staff.canAccessDiagnostics) permissions.push("diagnostics")
      if (staff.canAccessInventory) permissions.push("inventory")
      if (staff.canAccessPartsSourcing) permissions.push("parts_sourcing")
      if (staff.canAccessFleet) permissions.push("fleet")
      if (staff.canAccessHr) permissions.push("hr")
      if (staff.canAccessCustomers) permissions.push("customers")
      if (staff.canAccessServices) permissions.push("services")
      if (staff.canAccessReports) permissions.push("reports")
      if (staff.canAccessBilling) permissions.push("billing")
      if (staff.canAccessSettings) permissions.push("settings")
    }

    const token = generateToken(staff.id)
    res.json({
      success: true,
      token,
      user: {
        id:     staff.id,
        name:   staff.name,
        email:  staff.email,
        role:   staff.role,
        permissions,
        tenant: {
          id:   staff.tenantId,
          name: staff.tenant.garageName,
        }
      },
    })
  } catch (err) {
    next(err)
  }
}
