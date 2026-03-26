import prisma from "../../config/prisma.js"
import bcrypt from "bcryptjs"
import sendEmail from "../../utils/email.js"
import crypto from "crypto"
import razorpay from "../../config/razorpay.js"


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
      prisma.staff.create({
        data: {
          tenantId: id,
          name: tenant.ownerName,
          email: tenant.email,
          password: hashedPassword,
          role: "TENANT_ADMIN",
        },
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
    const { reason, refundFull = true } = req.body

    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: { subscriptions: { where: { status: "CAPTURED" }, take: 1 } },
    })

    if (!tenant) return res.status(404).json({ success: false, message: "Tenant not found" })

    // 1. REFUND LOGIC (via Razorpay)
    const sub = tenant.subscriptions[0]
    let refundInfo = null

    if (sub && sub.razorpayPaymentId && refundFull) {
      try {
        refundInfo = await razorpay.payments.refund(sub.razorpayPaymentId, {
          amount: Math.round(Number(sub.amount) * 100), // Full refund in paise
          notes: { reason: `Application Rejected: ${reason}` },
        })

        // Update Subscription with refund status
        await prisma.tenantSubscription.update({
          where: { id: sub.id },
          data: {
            status: "REFUNDED",
            refundedAt: new Date(),
            refundAmount: sub.amount,
            refundReason: reason,
          },
        })
      } catch (err) {
        console.error("❌ Razorpay Refund Failed:", err)
        // We continue with rejection even if refund fails (maybe manual refund needed)
      }
    }

    // 2. Update Tenant Status
    await prisma.tenant.update({
      where: { id },
      data: { status: "REJECTED", rejectionReason: reason },
    })

    // 3. Send Rejection Email
    await sendEmail({
      to: tenant.email,
      subject: "Application Update — GMS",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #f44336;">Application Update</h2>
          <p>Hi ${tenant.ownerName}, your application for <strong>${tenant.garageName}</strong> was rejected.</p>
          <p><strong>Reason:</strong> ${reason}</p>
          ${refundInfo ? `<p><strong>Refund initiated:</strong> ₹${sub.amount} will be credited back in 5-7 days.</p>` : ""}
          <p>You can resubmit with corrected documents via the app.</p>
        </div>
      `,
    })

    res.json({ success: true, message: `Tenant rejected ${refundInfo ? "and refund initiated" : ""}` })
  } catch (err) {
    next(err)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN STAFF MANAGEMENT (Super Admin Management)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Mapping helper to convert DB flags to array for frontend table/badges
 * This matches the "Granular Access" labels in the frontend.
 */
const mapAdminPermissions = (admin) => {
  const permissions = []
  if (admin.role === "SUPER_ADMIN") permissions.push("full_access")
  if (admin.canManageTenants) permissions.push("tenants")
  if (admin.canManageSubs) permissions.push("subs")
  if (admin.canManageBanners) permissions.push("banners")
  if (admin.canManageAnnouncements) permissions.push("announcements")
  if (admin.canManageSupport) permissions.push("support")
  if (admin.canManageCms) permissions.push("cms")

  // Return formatted object for frontend
  return {
    ...admin,
    permissions,
    status: admin.isActive ? "Active" : "Inactive"
  }
}

/**
 * @desc    Get all admin staff
 * @route   GET /api/admin/staff
 */
export const getAdminStaff = async (req, res, next) => {
  try {
    const admins = await prisma.superAdmin.findMany({
      orderBy: { createdAt: "desc" }
    })

    const mappedAdmins = admins.map(mapAdminPermissions)
    res.json({ success: true, count: mappedAdmins.length, data: mappedAdmins })
  } catch (err) {
    next(err)
  }
}

/**
 * @desc    Invite/Add new admin staff
 * @route   POST /api/admin/staff
 */
export const addAdminStaff = async (req, res, next) => {
  try {
    const {
      name, email, password, role, phone, status,
      canManageTenants, canManageSubs, canManageBanners,
      canManageAnnouncements, canManageSupport, canManageCms,
      permissions // checkbox array from frontend
    } = req.body

    const existingAdmin = await prisma.superAdmin.findUnique({ where: { email } })
    if (existingAdmin) return res.status(400).json({ success: false, message: "Admin with this email already exists" })

    // If password is not provided (should be provided as temp password in modal)
    const finalPassword = password
    const hashedPassword = await bcrypt.hash(finalPassword, 10)

    const admin = await prisma.superAdmin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "SUPPORT_MANAGER",
        phone,
        isActive: status === "Inactive" ? false : true,
        // Checkboxes array or boolean flags
        canManageTenants: !!canManageTenants || permissions?.includes("tenants"),
        canManageSubs: !!canManageSubs || permissions?.includes("subs"),
        canManageBanners: !!canManageBanners || permissions?.includes("banners"),
        canManageAnnouncements: !!canManageAnnouncements || permissions?.includes("announcements"),
        canManageSupport: !!canManageSupport || permissions?.includes("support"),
        canManageCms: !!canManageCms || permissions?.includes("cms"),
      },
    })

    // Placeholder for sending invite email
    try {
      await sendEmail({
        to: email,
        subject: "Welcome to GMS Admin Panel",
        html: `
          <h1>Invitation to GMS Admin Panel</h1>
          <p>Hi ${name}, you have been added as an admin.</p>
          <p>Your Temporary Password: <strong>${finalPassword}</strong></p>
          <p>Login here: <a href="${process.env.FRONTEND_URL}/login">GMS Admin Panel</a></p>
        `
      })
    } catch (emailErr) {
      console.error("❌ Failed to send invite email:", emailErr)
    }

    res.status(201).json({ success: true, data: mapAdminPermissions(admin) })
  } catch (err) {
    next(err)
  }
}

/**
 * @desc    Update admin staff
 * @route   PUT /api/admin/staff/:id
 */
export const updateAdminStaff = async (req, res, next) => {
  try {
    const { id } = req.params
    const {
      name, email, role, phone, status, isActive, password,
      canManageTenants, canManageSubs, canManageBanners,
      canManageAnnouncements, canManageSupport, canManageCms,
      permissions
    } = req.body

    // Check if updating another admin's email to one already in use
    if (email) {
      const existing = await prisma.superAdmin.findUnique({ where: { email } })
      if (existing && existing.id !== id) {
        return res.status(400).json({ success: false, message: "Email already in use" })
      }
    }

    const updateData = {
      name,
      email,
      role,
      phone,
      isActive: status !== undefined ? (status === "Active") : (isActive !== undefined ? isActive : undefined),
      canManageTenants: canManageTenants !== undefined ? !!canManageTenants : permissions?.includes("tenants"),
      canManageSubs: canManageSubs !== undefined ? !!canManageSubs : permissions?.includes("subs"),
      canManageBanners: canManageBanners !== undefined ? !!canManageBanners : permissions?.includes("banners"),
      canManageAnnouncements: canManageAnnouncements !== undefined ? !!canManageAnnouncements : permissions?.includes("announcements"),
      canManageSupport: canManageSupport !== undefined ? !!canManageSupport : permissions?.includes("support"),
      canManageCms: canManageCms !== undefined ? !!canManageCms : permissions?.includes("cms"),
    }

    if (password) updateData.password = await bcrypt.hash(password, 10)

    const admin = await prisma.superAdmin.update({
      where: { id },
      data: updateData,
    })

    res.json({ success: true, data: mapAdminPermissions(admin) })
  } catch (err) {
    next(err)
  }
}

/**
 * @desc    Delete admin staff
 * @route   DELETE /api/admin/staff/:id
 */
export const deleteAdminStaff = async (req, res, next) => {
  try {
    const { id } = req.params

    // Prevent deleting self? (Optional but recommended)
    if (req.user.id === id) {
      return res.status(400).json({ success: false, message: "Cannot delete yourself" })
    }

    await prisma.superAdmin.delete({ where: { id } })
    res.json({ success: true, message: "Admin staff deleted successfully" })
  } catch (err) {
    next(err)
  }
}

