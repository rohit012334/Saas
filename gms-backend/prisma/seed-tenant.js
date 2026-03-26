import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🧹 Cleaning up all existing tenants, staff, and subscriptions...")

  // 1. Delete in order (child tables first)
  await prisma.tenantSubscription.deleteMany({})
  await prisma.staff.deleteMany({})
  await prisma.tenant.deleteMany({})

  console.log("   ✅ All tenants, staff, and subscriptions deleted.\n")

  // 2. Ensure BASIC plan exists
  let plan = await prisma.subscriptionPlan.findFirst({ where: { type: "BASIC" } })
  if (!plan) {
    plan = await prisma.subscriptionPlan.create({
      data: {
        name: "Basic Plan",
        type: "BASIC",
        monthlyPrice: 99.00,
        yearlyPrice: 990.00,
        maxStaffUsers: 10,
        maxVehicles: 200,
        maxJobCards: 500,
        hasRepairOrders: true,
        hasDiagnostics: false,
        hasFleetManagement: false,
        hasHrManagement: true,
        hasCrm: true,
        hasPartsSourcing: false,
        hasReports: true,
        hasSms: false,
        hasWhatsapp: false,
        hasEmail: true,
      }
    })
    console.log("   📦 Created BASIC plan")
  } else {
    console.log("   📦 BASIC plan already exists")
  }

  const hashedPassword = await bcrypt.hash("password123", 10)

  // 3. Create fresh tenant with ALL fields
  const tenant = await prisma.tenant.create({
    data: {
      email: "garage@gms.com",
      phone: "+91-9876543210",
      password: hashedPassword,
      ownerName: "Rohit Joshi",
      garageName: "AutoCare Pro Garage",
      garageAddress: "Shop No. 12, Industrial Area Phase 2, Okhla, New Delhi - 110020",
      garageEmail: "contact@autocarpro.com",
      garagePhone: "+91-9988776655",
      garageLogoUrl: null,       // Will be set from Settings page
      city: "New Delhi",
      country: "India",
      numberOfBranches: 2,
      serviceTypes: [
        "REPAIR",
        "ELECTRICAL",
        "TYRE_WHEEL",
        "PERIODIC_MAINTENANCE",
        "INSPECTION"
      ],
      trnNumber: "TRN-100234567890123",
      companyBillingName: "AutoCare Pro Pvt Ltd",
      billingAddress: "A-45, Sector 63, Noida, UP - 201301",
      status: "ACTIVE",
      isEmailVerified: true,
    }
  })
  console.log(`\n   🏢 Tenant created: ${tenant.garageName}`)
  console.log(`      Email:    ${tenant.email}`)
  console.log(`      City:     ${tenant.city}, ${tenant.country}`)

  // 4. Create active subscription
  await prisma.tenantSubscription.create({
    data: {
      tenantId: tenant.id,
      planId: plan.id,
      interval: "MONTHLY",
      amount: 99.00,
      isActive: true,
      status: "CAPTURED",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    }
  })
  console.log("   💳 Active BASIC subscription created (30 days)")

  // 5. Create Tenant Admin staff (full permissions)
  const admin = await prisma.staff.create({
    data: {
      tenantId: tenant.id,
      name: "Rohit Joshi",
      email: "admin@gms.com",
      password: hashedPassword,
      role: "TENANT_ADMIN",
      phone: "+91-9876543210",
      address: "A-45, Sector 63, Noida, UP",
      skills: ["Management", "Operations"],
      isActive: true,
      canAccessDashboard: true,
      canAccessRepairOrders: true,
      canAccessDiagnostics: true,
      canAccessInventory: true,
      canAccessPartsSourcing: true,
      canAccessFleet: true,
      canAccessHr: true,
      canAccessCustomers: true,
      canAccessServices: true,
      canAccessReports: true,
      canAccessBilling: true,
      canAccessSettings: true,
    }
  })
  console.log(`\n   👤 Tenant Admin: ${admin.email} / password123`)

  // 6. Create Manager
  const manager = await prisma.staff.create({
    data: {
      tenantId: tenant.id,
      name: "Amit Gupta",
      email: "manager@gms.com",
      password: hashedPassword,
      role: "MANAGER",
      phone: "+91-9123456780",
      address: "B-12, Dwarka, New Delhi",
      skills: ["Team Lead", "Scheduling"],
      isActive: true,
      canAccessDashboard: true,
      canAccessRepairOrders: true,
      canAccessInventory: true,
      canAccessHr: true,
      canAccessCustomers: true,
      canAccessServices: true,
      canAccessReports: true,
      canAccessSettings: false,
    }
  })
  console.log(`   👤 Manager:       ${manager.email} / password123`)

  // 7. Create Receptionist
  const receptionist = await prisma.staff.create({
    data: {
      tenantId: tenant.id,
      name: "Priya Sharma",
      email: "reception@gms.com",
      password: hashedPassword,
      role: "RECEPTIONIST",
      phone: "+91-9012345678",
      address: "C-5, Vasant Kunj, New Delhi",
      skills: ["Customer Service", "Billing"],
      isActive: true,
      canAccessDashboard: true,
      canAccessRepairOrders: true,
      canAccessCustomers: true,
      canAccessBilling: true,
    }
  })
  console.log(`   👤 Receptionist:  ${receptionist.email} / password123`)

  // 8. Create Mechanics
  const mechanics = [
    {
      name: "Suresh Kumar",
      email: "suresh.mech@gms.com",
      phone: "+91-9876501234",
      skills: ["Engine Repair", "Electrical Systems", "Diagnostics"],
    },
    {
      name: "Rahul Bind",
      email: "rahul.mech@gms.com",
      phone: "+91-9800123456",
      skills: ["Tyre & Wheel", "Brake Systems", "AC Service"],
    },
    {
      name: "Deepak Yadav",
      email: "deepak.mech@gms.com",
      phone: "+91-9876001234",
      skills: ["Body Work", "Paint", "Denting"],
    },
  ]

  for (const m of mechanics) {
    const mech = await prisma.staff.create({
      data: {
        tenantId: tenant.id,
        name: m.name,
        email: m.email,
        password: hashedPassword,
        role: "MECHANIC",
        phone: m.phone,
        skills: m.skills,
        isActive: true,
        canAccessRepairOrders: true,
      }
    })
    console.log(`   🔧 Mechanic:      ${mech.email} / password123`)
  }

  console.log(`
╔══════════════════════════════════════════════════════════╗
║              ✅ SEED COMPLETE — SUMMARY                  ║
╠══════════════════════════════════════════════════════════╣
║  Tenant:   AutoCare Pro Garage                           ║
║  Login:    admin@gms.com / password123                   ║
║  Plan:     BASIC (Active, 30 days)                       ║
║  Staff:    1 Admin + 1 Manager + 1 Receptionist          ║
║            + 3 Mechanics = 6 total                       ║
╚══════════════════════════════════════════════════════════╝
  `)
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
