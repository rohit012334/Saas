// src/app.js
import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"

// Routes
import authRoutes from "./routes/auth.routes.js"
import tenantRoutes from "./routes/tenant.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import plansRoutes from "./routes/plans.routes.js"
import tenantStaffRoutes from "./routes/tenant-staff.routes.js"
import tenantSettingsRoutes from "./routes/settings.routes.js"
import commonRoutes from "./routes/common.routes.js"

import { errorHandler, notFound } from "./middleware/error.middleware.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()


app.use(helmet({
  crossOriginResourcePolicy: false,
}))
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_2,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"))


app.use("/uploads", express.static(path.join(__dirname, "../uploads")))


app.get("/health", (req, res) => res.json({ status: "ok" }))


app.use("/api/auth", authRoutes)
app.use("/api/tenant", tenantRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/plans", plansRoutes)
app.use("/api/tenant-staff", tenantStaffRoutes)
app.use("/api/tenant-settings", tenantSettingsRoutes)
app.use("/api/common", commonRoutes)


app.use(notFound)
app.use(errorHandler)

export default app
