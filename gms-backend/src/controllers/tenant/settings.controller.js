import prisma from "../../config/prisma.js"
import { getFileUrl } from "../../middleware/upload.middleware.js"

/**
 * Get Platform Settings for the current tenant
 * Returns: garageName + ownerName (read-only) + garageEmail, garageAddress, garageLogoUrl (editable)
 */
export const getPlatformSettings = async (req, res, next) => {
  try {
    const tenantId = req.tenantId
    if (!tenantId) {
      return res.status(403).json({ success: false, message: "Tenant context not found" })
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        garageName: true,   // read-only
        ownerName: true,    // read-only
        garageEmail: true,  // editable
        garageAddress: true, // editable
        garageLogoUrl: true, // editable
      },
    })

    if (!tenant) {
      return res.status(404).json({ success: false, message: "Tenant not found" })
    }

    res.json({ success: true, data: tenant })
  } catch (err) {
    next(err)
  }
}

/**
 * Update Platform Settings
 * Allowed: garageEmail, garageAddress, garageLogoUrl (via logo upload)
 * NOT allowed: garageName, ownerName (these are set at registration and cannot change)
 */
export const updatePlatformSettings = async (req, res, next) => {
  try {
    const tenantId = req.tenantId
    if (!tenantId) {
      return res.status(403).json({ success: false, message: "Tenant context not found" })
    }

    const { garageEmail, garageAddress } = req.body
    const logoFile = req.file

    const updateData = {}

    if (garageEmail !== undefined) updateData.garageEmail = garageEmail
    if (garageAddress !== undefined) updateData.garageAddress = garageAddress
    if (logoFile) updateData.garageLogoUrl = getFileUrl(logoFile)

    const updatedTenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: updateData,
      select: {
        garageName: true,
        ownerName: true,
        garageEmail: true,
        garageAddress: true,
        garageLogoUrl: true,
      },
    })

    res.json({
      success: true,
      message: "Platform settings updated successfully",
      data: updatedTenant,
    })
  } catch (err) {
    next(err)
  }
}
