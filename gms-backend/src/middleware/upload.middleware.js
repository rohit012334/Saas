import multer from "multer"
import path from "path"
import { S3Client } from "@aws-sdk/client-s3"
import multerS3 from "multer-s3"
import fs from "fs"

const storageProvider = process.env.STORAGE_PROVIDER || "local"
const uploadDir = process.env.UPLOAD_DIR || "uploads"


if (storageProvider === "local" && !fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

let storage

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`)
  },
})

// ─── S3 Storage (For-Future-Handling)
if (storageProvider === "s3") {
  const s3 = new S3Client({
    region: process.env.S3_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  })

  storage = multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
      cb(null, `gms/${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`)
    },
  })
} else {
  storage = localStorage
}

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|pdf/
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase())
  const mimetype = /image\/jpeg|image\/png|application\/pdf/.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  }
  cb(new Error("Error: Images (JPEG, JPG, PNG) and PDFs only!"))
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})

export const getFileUrl = (file) => {
  if (!file) return null

  if (file.location) return file.location

  const backendUrl = process.env.BACKEND_URL || "http://localhost:5001"
  return `${backendUrl}/uploads/${file.filename}`
}
