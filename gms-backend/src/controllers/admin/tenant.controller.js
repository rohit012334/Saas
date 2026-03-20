import prisma from "../../config/prisma.js"
import bcrypt from "bcryptjs"
import sendEmail from "../../utils/email.js"
import crypto from "crypto"


export const getPendingTenants = async (req, res, next) => {
  try {
    const tenants = await prisma.tenant.findMany({
      where: { status: { in: ["PENDING_VERIFICATION", "RESUBMITTED"] } },
      include: { subscriptions: { where: { status: "CAPTURED" }, take: 1 } },
      orderBy: { createdAt: "desc" },
    })

    res.json({ success: true, count: tenants.length, data: tenants })
  } catch (err) {
    next(err)
  }
}

export const approveTenant = async (req, res, next) => {
  try {
    const { id } = req.params
    const { adminId } = req.body

    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: { subscriptions: { where: { status: "CAPTURED" }, take: 1 } },
    })

    if (!tenant) return res.status(404).json({ success: false, message: "Tenant not found" })

    const tempPassword = crypto.randomBytes(4).toString("hex")
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    const now = new Date()
    const sub = tenant.subscriptions[0]
    const expiryDate = new Date()
    if (sub.interval === "YEARLY") expiryDate.setFullYear(now.getFullYear() + 1)
    else expiryDate.setMonth(now.getMonth() + 1)

    await prisma.$transaction([
      prisma.tenant.update({
        where: { id },
        data: { status: "ACTIVE", password: hashedPassword, verifiedById: adminId, verifiedAt: now },
      }),
      prisma.tenantSubscription.update({
        where: { id: sub.id },
        data: { isActive: true, startDate: now, endDate: expiryDate },
      }),
    ])

    await sendEmail({
      to: tenant.email,
      subject: " Welcome to GMS — Approved!",
      html: `<h2>Welcome ${tenant.ownerName}!</h2><p>Temp Password: ${tempPassword}</p>`,
    })

    res.json({ success: true, message: "Tenant approved" })
  } catch (err) {
    next(err)
  }
}

export const rejectTenant = async (req, res, next) => {
  try {
    const { id } = req.params
    const { reason } = req.body

    await prisma.tenant.update({
      where: { id },
      data: { status: "REJECTED", rejectionReason: reason },
    })

    res.json({ success: true, message: "Tenant rejected" })
  } catch (err) {
    next(err)
  }
}
