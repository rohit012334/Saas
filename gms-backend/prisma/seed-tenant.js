import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding Test Tenant and Staff...")

  // 1. Ensure a Plan exists (BASIC)
  let plan = await prisma.subscriptionPlan.findFirst({
    where: { type: "BASIC" }
  })

  if (!plan) {
    plan = await prisma.subscriptionPlan.create({
      data: {
        name: "BASIC",
        type: "BASIC",
        monthlyPrice: 99.00,
        yearlyPrice: 990.00,
        maxStaffUsers: 5,
        maxVehicles: 100,
        maxJobCards: 100,
        hasRepairOrders: true,
        hasHrManagement: true,
        hasCrm: true,
        hasReports: true,
        hasEmail: true,
      }
    })
    console.log("   - Created BASIC plan")
  }

  // 2. Create Tenant
  const tenantEmail = "garage@gms.com"
  let tenant = await prisma.tenant.findUnique({
    where: { email: tenantEmail }
  })

  const hashedPassword = await bcrypt.hash("password123", 10)

  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        email: tenantEmail,
        phone: "919876543210",
        password: hashedPassword,
        ownerName: "Rajesh Sharma",
        garageName: "Al Noor Auto Delhi",
        garageAddress: "Okhla Phase 3, New Delhi",
        city: "Delhi",
        country: "India",
        status: "ACTIVE",
        isEmailVerified: true,
      }
    })
    console.log("   - Created Tenant Store")
  }

  // 3. Create Tenant Subscription (active)
  await prisma.tenantSubscription.upsert({
    where: { id: "test-sub-1" },
    update: {},
    create: {
      id: "test-sub-1",
      tenantId: tenant.id,
      planId: plan.id,
      isActive: true,
      status: "CAPTURED",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      amount: 99.00
    }
  })
  console.log("   - Activated BASIC Subscription")

  // 4. Create Staff (Tenant Admin)
  const staffEmail = "admin@gms.com"
  await prisma.staff.upsert({
    where: { email: staffEmail },
    update: {
      password: hashedPassword,
      role: "TENANT_ADMIN",
      isActive: true,
    },
    create: {
      tenantId: tenant.id,
      name: "Rajesh Sharma",
      email: staffEmail,
      password: hashedPassword,
      role: "TENANT_ADMIN",
      isActive: true,
      canAccessDashboard: true,
      canAccessHr: true,
    }
  })
  console.log(`✅ Admin Staff created: ${staffEmail} / password123`)

  // 5. Create some test employees (Mechanics)
  const mechanics = [
    { name: "Suresh Mechanic", email: "suresh@gms.com" },
    { name: "Rahul Fixer", email: "rahul@gms.com" },
  ]

  for (const m of mechanics) {
    await prisma.staff.upsert({
      where: { email: m.email },
      update: {},
      create: {
        tenantId: tenant.id,
        name: m.name,
        email: m.email,
        password: hashedPassword,
        role: "MECHANIC",
        isActive: true,
        skills: ["Engine Repair", "Electricals"],
      }
    })
  }
  console.log(`✅ ${mechanics.length} Mechanics seeded`)

  console.log("🏁 Tenant Seeding complete")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
