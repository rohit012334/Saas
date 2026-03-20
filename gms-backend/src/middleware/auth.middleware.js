import prisma from "../config/prisma.js"
import { verifyToken } from "../utils/jwt.js"


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

    const admin = await prisma.superAdmin.findUnique({ where: { id: decoded.id } })
    if (admin) {
      req.user = admin
      req.userType = "ADMIN"
      return next()
    }

    const tenant = await prisma.tenant.findUnique({ where: { id: decoded.id } })
    if (tenant) {
      req.user = tenant
      req.userType = "TENANT"
      return next()
    }

    return res.status(401).json({ success: false, message: "User not found" })
  } catch (err) {
    return res.status(401).json({ success: false, message: "Authorization failed" })
  }
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not authenticated" })
    }

    if (req.userType === "ADMIN") {
      if (!roles.includes(req.user.role) && !roles.includes("SUPER_ADMIN")) {
        return res.status(403).json({ success: false, message: "Not authorized for this role" })
      }
    }
    if (req.userType === "TENANT" && !roles.includes("TENANT")) {
      return res.status(403).json({ success: false, message: "Not authorized for this role" })
    }

    next()
  }
}
