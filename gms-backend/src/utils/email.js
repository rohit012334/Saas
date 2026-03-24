import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // If mock otp is enabled and credentials are empty, skip sending
    if (process.env.USE_MOCK_OTP === "true" && (!process.env.SMTP_USER || process.env.SMTP_USER === "your_mailtrap_user")) {
      console.log(`📡 [MOCK MODE] Email skipped for ${to} | Subject: ${subject}`)
      return { messageId: "mock-id" }
    }

    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      text,
      html,
    })
    console.log(`📧 Email sent to ${to}: ${info.messageId}`)
    return info
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err)
    
    // In development/mock mode, we don't want to crash the whole onboarding flow just because SMTP is set up wrong
    if (process.env.USE_MOCK_OTP === "true") {
      console.log("⚠️ Continuing flow despite email failure (Mock Mode Active)")
      return { messageId: "failed-but-continued" }
    }

    throw new Error("Could not send email")
  }
}

export default sendEmail
