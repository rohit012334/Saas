/**
 * Generate a 6-digit random OTP
 */
export const generateOtp = () => {
  if (process.env.USE_MOCK_OTP === "true") {
    return "123456"
  }
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const isOtpExpired = (expiryDate) => {
  if (!expiryDate) return true
  const now = new Date()
  return now > new Date(expiryDate)
}
