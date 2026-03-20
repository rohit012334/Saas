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

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const token = generateToken(admin.id)
    res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    })
  } catch (err) {
    next(err)
  }
}

export const tenantLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const tenant = await prisma.tenant.findUnique({ where: { email } })
    if (!tenant) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    if (tenant.status !== "ACTIVE") {
      return res.status(403).json({ success: false, message: `Account is ${tenant.status}` })
    }

    const isMatch = await bcrypt.compare(password, tenant.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const token = generateToken(tenant.id)
    res.json({
      success: true,
      token,
      user: {
        id: tenant.id,
        name: tenant.ownerName,
        email: tenant.email,
        status: tenant.status,
      },
    })
  } catch (err) {
    next(err)
  }
}
