import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // 1. CLEAR EXISTING DATA
  console.log("   - Clearing old plans...")
  await prisma.subscriptionPlan.deleteMany()

  // 2. CREATE PLANS
  const plans = [
    {
      name:          "BASIC",
      type:          "BASIC",
      monthlyPrice:  999.00,
      yearlyPrice:   9990.00,
      maxStaffUsers:  2,
      maxVehicles:    100,
      maxJobCards:    100,
      hasRepairOrders: true,
      hasHrManagement: true,
      hasCrm:          true,
      hasReports:      true,
      hasDiagnostics:  false,
      hasFleetManagement: false,
      hasSms:          false,
      hasWhatsapp:     false,
      hasEmail:        true,
    },
    {
      name:          "PRO",
      type:          "PRO",
      monthlyPrice:  2999.00,
      yearlyPrice:   29990.00,
      maxStaffUsers:  10,
      maxVehicles:    1000,
      maxJobCards:    null, // Unlimited
      hasRepairOrders: true,
      hasHrManagement: true,
      hasCrm:          true,
      hasReports:      true,
      hasDiagnostics:  false,
      hasFleetManagement: true,
      hasSms:          false,
      hasWhatsapp:     true,
      hasEmail:        true,
    },
    {
      name:          "ENTERPRISE",
      type:          "ENTERPRISE",
      monthlyPrice:  7999.00,
      yearlyPrice:   79990.00,
      maxStaffUsers:  1000, // Unlimited
      maxVehicles:    10000, // Unlimited
      maxJobCards:    null, // Unlimited
      hasRepairOrders: true,
      hasHrManagement: true,
      hasCrm:          true,
      hasReports:      true,
      hasDiagnostics:  true,
      hasFleetManagement: true,
      hasSms:          true,
      hasWhatsapp:     true,
      hasEmail:        true,
    },
  ]

  for (const p of plans) {
    await prisma.subscriptionPlan.create({
      data: p,
    })
  }
  console.log(`✅ ${plans.length} Plans seeded`)

  // 3. CREATE SUPER ADMIN
  const hashedPassword = await bcrypt.hash("password123", 10)
  const sa = await prisma.superAdmin.upsert({
    where: { email: "admin@gms.com" },
    update: {},
    create: {
      name:     "GMS Admin",
      email:    "admin@gms.com",
      password: hashedPassword, 
      role:     "SUPER_ADMIN",
    },
  })
  console.log(`✅ Super Admin created: ${sa.email}`)

  console.log("🏁 Seeding complete")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
