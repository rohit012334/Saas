import prisma from "../../config/prisma.js"

export const getPlans = async (req, res, next) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { monthlyPrice: "asc" },
    })

    res.json({ success: true, data: plans })
  } catch (err) {
    next(err)
  }
}
