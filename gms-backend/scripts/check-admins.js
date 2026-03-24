import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient()

async function check() {
  const admins = await prisma.superAdmin.findMany()
  console.log("Total Super Admins found:", admins.length)
  admins.forEach(a => console.log(`- ${a.email} (${a.role})`))
  process.exit(0)
}

check()
