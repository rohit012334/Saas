/*
  Warnings:

  - The values [MECHANIC] on the enum `BannerTarget` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BannerTarget_new" AS ENUM ('TENANT', 'USER');
ALTER TABLE "banners" ALTER COLUMN "target" DROP DEFAULT;
ALTER TABLE "cms_contents" ALTER COLUMN "target" DROP DEFAULT;
ALTER TABLE "banners" ALTER COLUMN "target" TYPE "BannerTarget_new" USING ("target"::text::"BannerTarget_new");
ALTER TABLE "cms_contents" ALTER COLUMN "target" TYPE "BannerTarget_new" USING ("target"::text::"BannerTarget_new");
ALTER TYPE "BannerTarget" RENAME TO "BannerTarget_old";
ALTER TYPE "BannerTarget_new" RENAME TO "BannerTarget";
DROP TYPE "BannerTarget_old";
ALTER TABLE "banners" ALTER COLUMN "target" SET DEFAULT 'TENANT';
ALTER TABLE "cms_contents" ALTER COLUMN "target" SET DEFAULT 'USER';
COMMIT;

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "garageLogoUrl" TEXT;
