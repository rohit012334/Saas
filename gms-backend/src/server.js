// src/server.js

import "dotenv/config"
import app from "./app.js"
import prisma from "./config/prisma.js"

const PORT = process.env.PORT || 5000

async function main() {
  try {
    await prisma.$connect()
    console.log(" Database connected")

    app.listen(PORT, () => {
      console.log("─────────────────────────────────────────")
      console.log(` GMS Server running on port ${PORT}`)
      console.log(` Environment: ${process.env.NODE_ENV}`)
      console.log(` Storage: ${process.env.STORAGE_PROVIDER || "local"}`)
      console.log("─────────────────────────────────────────")
    })
  } catch (err) {
    console.error("Failed to start server:", err)
    await prisma.$disconnect()
    process.exit(1)
  }
}

main()
