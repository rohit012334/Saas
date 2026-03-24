-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('BASIC', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "PlanInterval" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('PENDING_VERIFICATION', 'ACTIVE', 'REJECTED', 'RESUBMITTED', 'SUSPENDED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'CAPTURED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('REPAIR', 'PAINT', 'ELECTRICAL', 'FULL_SERVICE', 'TYRE_WHEEL', 'AC_SERVICE', 'BODY_WORK', 'INSPECTION', 'PERIODIC_MAINTENANCE');

-- CreateEnum
CREATE TYPE "SuperAdminRole" AS ENUM ('SUPER_ADMIN', 'SUPPORT_MANAGER', 'BILLING_ADMIN', 'TECHNICAL_ADMIN');

-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('TENANT_ADMIN', 'MANAGER', 'RECEPTIONIST', 'MECHANIC', 'STAFF');

-- CreateEnum
CREATE TYPE "BannerTarget" AS ENUM ('TENANT', 'SUPER_ADMIN');

-- CreateTable
CREATE TABLE "super_admins" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "SuperAdminRole" NOT NULL DEFAULT 'SUPPORT_MANAGER',
    "canManageTenants" BOOLEAN NOT NULL DEFAULT false,
    "canManageSubs" BOOLEAN NOT NULL DEFAULT false,
    "canManageBanners" BOOLEAN NOT NULL DEFAULT false,
    "canManageAnnouncements" BOOLEAN NOT NULL DEFAULT false,
    "canManageSupport" BOOLEAN NOT NULL DEFAULT false,
    "canManageCms" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT,
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "super_admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PlanType" NOT NULL,
    "monthlyPrice" DECIMAL(10,2) NOT NULL,
    "yearlyPrice" DECIMAL(10,2) NOT NULL,
    "maxStaffUsers" INTEGER NOT NULL,
    "maxVehicles" INTEGER NOT NULL,
    "maxJobCards" INTEGER,
    "hasRepairOrders" BOOLEAN NOT NULL DEFAULT true,
    "hasDiagnostics" BOOLEAN NOT NULL DEFAULT false,
    "hasFleetManagement" BOOLEAN NOT NULL DEFAULT false,
    "hasHrManagement" BOOLEAN NOT NULL DEFAULT true,
    "hasCrm" BOOLEAN NOT NULL DEFAULT true,
    "hasPartsSourcing" BOOLEAN NOT NULL DEFAULT false,
    "hasReports" BOOLEAN NOT NULL DEFAULT true,
    "hasSms" BOOLEAN NOT NULL DEFAULT false,
    "hasWhatsapp" BOOLEAN NOT NULL DEFAULT false,
    "hasEmail" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "status" "TenantStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "ownerName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailOtp" TEXT,
    "emailOtpExpiry" TIMESTAMP(3),
    "garageName" TEXT,
    "garageAddress" TEXT,
    "city" TEXT,
    "country" TEXT DEFAULT 'UAE',
    "numberOfBranches" INTEGER DEFAULT 1,
    "serviceTypes" "ServiceType"[],
    "garagePhone" TEXT,
    "garageEmail" TEXT,
    "trnNumber" TEXT,
    "companyBillingName" TEXT,
    "billingAddress" TEXT,
    "tradeLicenseFrontUrl" TEXT,
    "tradeLicenseBackUrl" TEXT,
    "ownerIdFrontUrl" TEXT,
    "ownerIdBackUrl" TEXT,
    "vatCertificateUrl" TEXT,
    "rejectionReason" TEXT,
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_staff" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "StaffRole" NOT NULL DEFAULT 'STAFF',
    "phone" TEXT,
    "address" TEXT,
    "skills" TEXT[],
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "canAccessDashboard" BOOLEAN NOT NULL DEFAULT false,
    "canAccessRepairOrders" BOOLEAN NOT NULL DEFAULT false,
    "canAccessDiagnostics" BOOLEAN NOT NULL DEFAULT false,
    "canAccessInventory" BOOLEAN NOT NULL DEFAULT false,
    "canAccessPartsSourcing" BOOLEAN NOT NULL DEFAULT false,
    "canAccessFleet" BOOLEAN NOT NULL DEFAULT false,
    "canAccessHr" BOOLEAN NOT NULL DEFAULT false,
    "canAccessCustomers" BOOLEAN NOT NULL DEFAULT false,
    "canAccessServices" BOOLEAN NOT NULL DEFAULT false,
    "canAccessReports" BOOLEAN NOT NULL DEFAULT false,
    "canAccessBilling" BOOLEAN NOT NULL DEFAULT false,
    "canAccessSettings" BOOLEAN NOT NULL DEFAULT false,
    "idCardFrontUrl" TEXT,
    "idCardBackUrl" TEXT,
    "contractUrl" TEXT,
    "otherDocUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_subscriptions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "interval" "PlanInterval" NOT NULL DEFAULT 'MONTHLY',
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "refundAmount" DECIMAL(10,2),
    "refundReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "imageUrl" TEXT NOT NULL,
    "linkUrl" TEXT,
    "target" "BannerTarget" NOT NULL DEFAULT 'TENANT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "super_admins_email_key" ON "super_admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_type_key" ON "subscription_plans"("type");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_email_key" ON "tenants"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_staff_email_key" ON "tenant_staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_subscriptions_razorpayOrderId_key" ON "tenant_subscriptions"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_subscriptions_razorpayPaymentId_key" ON "tenant_subscriptions"("razorpayPaymentId");

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "super_admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_staff" ADD CONSTRAINT "tenant_staff_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_subscriptions" ADD CONSTRAINT "tenant_subscriptions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_subscriptions" ADD CONSTRAINT "tenant_subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
