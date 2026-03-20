import prisma from "../../config/prisma.js"
import { generateOtp, isOtpExpired } from "../../utils/otp.js"
import sendEmail from "../../utils/email.js"
import razorpay from "../../config/razorpay.js"
import { getFileUrl } from "../../middleware/upload.middleware.js"
import crypto from "crypto"


export const startOnboarding = async (req, res, next) => {
  try {
    const { ownerName, email, phone } = req.body

    const otp = generateOtp()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    const tenant = await prisma.tenant.upsert({
      where: { email },
      update: {
        ownerName,
        phone,
        emailOtp: otp,
        emailOtpExpiry: otpExpiry,
        isEmailVerified: false,
      },
      create: {
        ownerName,
        email,
        phone,
        emailOtp: otp,
        emailOtpExpiry: otpExpiry,
        password: "temp-pwd-wait-approve",
      },
    })

    await sendEmail({
      to: email,
      subject: "Verify your email — GMS Onboarding",
      html: `<h2>OTP: ${otp}</h2>`,
    })

    res.json({ success: true, message: "OTP sent to email", data: { tenantId: tenant.id } })
  } catch (err) {
    next(err)
  }
}

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body
    const tenant = await prisma.tenant.findUnique({ where: { email } })

    if (!tenant || tenant.emailOtp !== otp || isOtpExpired(tenant.emailOtpExpiry)) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" })
    }

    await prisma.tenant.update({
      where: { email },
      data: { isEmailVerified: true, emailOtp: null, emailOtpExpiry: null },
    })

    res.json({ success: true, message: "Email verified", data: { tenantId: tenant.id } })
  } catch (err) {
    next(err)
  }
}

/**
 * STEP 3: Create Order (Razorpay)
 */
export const createOrder = async (req, res, next) => {
  try {
    const { tenantId, planId, interval } = req.body
    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } })
    if (!plan) return res.status(404).json({ success: false, message: "Plan not found" })

    const amount = interval === "YEARLY" ? plan.yearlyPrice : plan.monthlyPrice
    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `receipt_${tenantId}`,
    })

    await prisma.tenantSubscription.create({
      data: {
        tenantId,
        planId,
        interval: interval || "MONTHLY",
        amount,
        razorpayOrderId: order.id,
        status: "PENDING",
      },
    })

    res.json({ success: true, data: { orderId: order.id, amount: order.amount } })
  } catch (err) {
    next(err)
  }
}

/**
 * STEP 4: Submit Documents
 */
export const submitDocuments = async (req, res, next) => {
  try {
    const { tenantId, ...details } = req.body
    const files = req.files || {}

    const updateData = {
      ...details,
      numberOfBranches: Number(details.numberOfBranches) || 1,
      serviceTypes: Array.isArray(details.serviceTypes) ? details.serviceTypes : [details.serviceTypes],
      tradeLicenseFrontUrl: getFileUrl(files.tradeLicenseFront?.[0]),
      tradeLicenseBackUrl: getFileUrl(files.tradeLicenseBack?.[0]),
      ownerIdFrontUrl: getFileUrl(files.ownerIdFront?.[0]),
      ownerIdBackUrl: getFileUrl(files.ownerIdBack?.[0]),
      vatCertificateUrl: getFileUrl(files.vatCertificate?.[0]),
    }

    delete updateData.tenantId

    await prisma.tenant.update({
      where: { id: tenantId },
      data: updateData,
    })

    res.json({ success: true, message: "Documents uploaded" })
  } catch (err) {
    next(err)
  }
}

/**
 * STEP 5: Verify Payment
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, tenantId } = req.body
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" })
    }

    await prisma.tenantSubscription.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: { razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature, status: "CAPTURED" },
    })

    const updatedTenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: { status: "PENDING_VERIFICATION" },
    })

    res.json({ success: true, message: "Payment successful. Application under review.", data: { applicationId: updatedTenant.id } })
  } catch (err) {
    next(err)
  }
}

/**
 * Get Status
 */
export const getStatus = async (req, res, next) => {
  try {
    const { tenantId } = req.params
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } })
    if (!tenant) return res.status(404).json({ success: false, message: "Tenant not found" })
    res.json({ success: true, data: tenant })
  } catch (err) {
    next(err)
  }
}

/**
 * Resubmit
 */
export const resubmitDocuments = async (req, res, next) => {
  try {
    const { tenantId } = req.params
    const files = req.files || {}
    const updateData = { ...req.body, status: "RESUBMITTED", rejectionReason: null }

    // URL logic simplified for brevity but kept functional
    if (files.tradeLicenseFront?.[0]) updateData.tradeLicenseFrontUrl = getFileUrl(files.tradeLicenseFront[0])
    if (files.tradeLicenseBack?.[0]) updateData.tradeLicenseBackUrl = getFileUrl(files.tradeLicenseBack[0])
    if (files.ownerIdFront?.[0]) updateData.ownerIdFrontUrl = getFileUrl(files.ownerIdFront[0])
    if (files.ownerIdBack?.[0]) updateData.ownerIdBackUrl = getFileUrl(files.ownerIdBack[0])
    if (files.vatCertificate?.[0]) updateData.vatCertificateUrl = getFileUrl(files.vatCertificate[0])

    await prisma.tenant.update({ where: { id: tenantId }, data: updateData })
    res.json({ success: true, message: "Resubmitted successfully" })
  } catch (err) {
    next(err)
  }
}
