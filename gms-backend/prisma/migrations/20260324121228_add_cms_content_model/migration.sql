-- CreateEnum
CREATE TYPE "CmsType" AS ENUM ('FAQ', 'PRIVACY_POLICY', 'TERMS_CONDITIONS');

-- AlterEnum
ALTER TYPE "BannerTarget" ADD VALUE 'MECHANIC';

-- CreateTable
CREATE TABLE "cms_contents" (
    "id" TEXT NOT NULL,
    "type" "CmsType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "target" "BannerTarget" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cms_contents_pkey" PRIMARY KEY ("id")
);
