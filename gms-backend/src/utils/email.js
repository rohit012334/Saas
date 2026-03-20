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
    // Don't throw for emails in dev (optional), but we probably should
    throw new Error("Could not send email")
  }
}

export default sendEmail
