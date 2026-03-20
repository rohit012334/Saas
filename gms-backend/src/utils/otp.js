export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const isOtpExpired = (expiryDate) => {
  if (!expiryDate) return true
  const now = new Date()
  return now > new Date(expiryDate)
}
