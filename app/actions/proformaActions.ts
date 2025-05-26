"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { ProformaStatus } from "@prisma/client"

// Updated types for multiple kiosk selections matching the new schema
type KioskSelection = {
  type: "MONO" | "GRAND" | "COMPARTIMENT"
  quantity: number
  basePrice: number
  surfaces: {
    joues: { selected: boolean; price: number }
    oreilles: { selected: boolean; price: number }
    menton: { selected: boolean; price: number }
    fronton: { selected: boolean; price: number }
  }
}

type ProformaFormData = {
  clientId: string
  clientName: string
  clientEmail?: string
  clientPhone?: string
  clientAddress?: string
  kioskSelections: KioskSelection[]
  subtotal: number
  dtsp: number
  tva: number
  totalAmount: number
  dtspRate: number
  tvaRate: number
  createdById: string
}

// Surface count mapping for calculations
const SURFACE_COUNTS = {
  MONO: { joues: 2, oreilles: 2, menton: 1, fronton: 1 },
  GRAND: { joues: 2, oreilles: 4, menton: 1, fronton: 1 },
  COMPARTIMENT: { joues: 1, oreilles: 1, menton: 1, fronton: 1 },
} as const

// Create a new proforma with multiple kiosk selections
export async function createProforma(formData: ProformaFormData) {
  try {
    // Validate form data
    if (!formData.clientId) {
      return { success: false, error: "Client ID is required" }
    }

    if (!formData.kioskSelections || formData.kioskSelections.length === 0) {
      return { success: false, error: "At least one kiosk selection is required" }
    }

    // Validate each kiosk selection
    for (const selection of formData.kioskSelections) {
      if (!selection.type) {
        return { success: false, error: "Kiosk type is required for all selections" }
      }
      if (!selection.quantity || selection.quantity < 1) {
        return { success: false, error: "Quantity must be at least 1 for all kiosk selections" }
      }
      if (selection.basePrice < 0) {
        return { success: false, error: "Base price must be a positive number" }
      }
    }

    // Generate a unique proforma number
    const proformaNumber = `PRO-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Calculate expiry date (30 days from now)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30)

    // Prepare kiosk selections data for storage with calculated subtotals
    const kioskSelectionsData = formData.kioskSelections.map((selection) => {
      const kioskSubtotal = selection.basePrice * selection.quantity
      const surfacesSubtotal = Object.entries(selection.surfaces).reduce((total, [surfaceKey, surface]) => {
        if (surface.selected) {
          const count = SURFACE_COUNTS[selection.type][surfaceKey as keyof typeof SURFACE_COUNTS.MONO] || 0
          return total + surface.price * count * selection.quantity
        }
        return total
      }, 0)

      return {
        type: selection.type,
        quantity: selection.quantity,
        basePrice: selection.basePrice,
        surfaces: selection.surfaces,
        kioskSubtotal,
        surfacesSubtotal,
        selectionTotal: kioskSubtotal + surfacesSubtotal,
      }
    })

    // Create the proforma using the new schema structure
    const proforma = await prisma.proforma.create({
      data: {
        proformaNumber,
        clientId: formData.clientId,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        clientAddress: formData.clientAddress,
        // New schema fields
        kioskSelections: kioskSelectionsData,
        subtotal: formData.subtotal,
        dtsp: formData.dtsp,
        tva: formData.tva,
        dtspRate: formData.dtspRate,
        tvaRate: formData.tvaRate,
        totalAmount: formData.totalAmount,
        // Legacy fields (set to null for new proformas)
        kioskType: null,
        quantity: null,
        surfaces: null,
        basePrice: null,
        brandingPrice: null,
        // Other fields
        createdById: formData.createdById,
        expiryDate,
        status: "DRAFT",
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    revalidatePath("/admin/proforma")

    return {
      success: true,
      proforma,
    }
  } catch (error) {
    console.error("Error creating proforma:", error)
    return {
      success: false,
      error: "Failed to create proforma",
    }
  }
}

// Get all proformas
export async function getAllProformas(filters?: { status?: ProformaStatus; userId?: string }) {
  try {
    const where: any = {}

    if (filters?.status) {
      where.status = filters.status
    }

    if (filters?.userId) {
      where.createdById = filters.userId
    }

    const proformas = await prisma.proforma.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        contract: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return {
      success: true,
      proformas,
    }
  } catch (error) {
    console.error("Error fetching proformas:", error)
    return {
      success: false,
      error: "Failed to fetch proformas",
    }
  }
}

// Get a single proforma by ID
export async function getProforma(proformaId: string) {
  try {
    const proforma = await prisma.proforma.findUnique({
      where: { id: proformaId },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        contract: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!proforma) {
      return { success: false, error: "Proforma not found" }
    }

    return {
      success: true,
      proforma,
    }
  } catch (error) {
    console.error("Error fetching proforma:", error)
    return {
      success: false,
      error: "Failed to fetch proforma",
    }
  }
}

// Update proforma status
export async function updateProformaStatus(proformaId: string, status: ProformaStatus) {
  try {
    const updateData: any = { status }

    // Set timestamp based on status
    switch (status) {
      case "SENT":
        updateData.sentDate = new Date()
        break
      case "ACCEPTED":
        updateData.acceptedDate = new Date()
        break
      case "REJECTED":
        updateData.rejectedDate = new Date()
        break
      case "CONVERTED":
        updateData.convertedDate = new Date()
        break
    }

    const updatedProforma = await prisma.proforma.update({
      where: { id: proformaId },
      data: updateData,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    revalidatePath("/admin/proforma")
    revalidatePath(`/admin/proforma/${proformaId}`)

    return {
      success: true,
      proforma: updatedProforma,
    }
  } catch (error) {
    console.error("Error updating proforma status:", error)
    return {
      success: false,
      error: "Failed to update proforma status",
    }
  }
}

// Update proforma data (for editing existing proformas)
export async function updateProforma(proformaId: string, formData: Partial<ProformaFormData>) {
  try {
    const existingProforma = await prisma.proforma.findUnique({
      where: { id: proformaId },
    })

    if (!existingProforma) {
      return { success: false, error: "Proforma not found" }
    }

    // Only allow updates to draft proformas
    if (existingProforma.status !== "DRAFT") {
      return { success: false, error: "Only draft proformas can be edited" }
    }

    // Prepare update data
    const updateData: any = {}

    if (formData.kioskSelections) {
      // Validate kiosk selections
      for (const selection of formData.kioskSelections) {
        if (!selection.type || !selection.quantity || selection.quantity < 1) {
          return { success: false, error: "Invalid kiosk selection data" }
        }
      }

      // Prepare kiosk selections data
      const kioskSelectionsData = formData.kioskSelections.map((selection) => {
        const kioskSubtotal = selection.basePrice * selection.quantity
        const surfacesSubtotal = Object.entries(selection.surfaces).reduce((total, [surfaceKey, surface]) => {
          if (surface.selected) {
            const count = SURFACE_COUNTS[selection.type][surfaceKey as keyof typeof SURFACE_COUNTS.MONO] || 0
            return total + surface.price * count * selection.quantity
          }
          return total
        }, 0)

        return {
          type: selection.type,
          quantity: selection.quantity,
          basePrice: selection.basePrice,
          surfaces: selection.surfaces,
          kioskSubtotal,
          surfacesSubtotal,
          selectionTotal: kioskSubtotal + surfacesSubtotal,
        }
      })

      updateData.kioskSelections = kioskSelectionsData
    }

    // Update other fields if provided
    if (formData.subtotal !== undefined) updateData.subtotal = formData.subtotal
    if (formData.dtsp !== undefined) updateData.dtsp = formData.dtsp
    if (formData.tva !== undefined) updateData.tva = formData.tva
    if (formData.dtspRate !== undefined) updateData.dtspRate = formData.dtspRate
    if (formData.tvaRate !== undefined) updateData.tvaRate = formData.tvaRate
    if (formData.totalAmount !== undefined) updateData.totalAmount = formData.totalAmount

    const updatedProforma = await prisma.proforma.update({
      where: { id: proformaId },
      data: updateData,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    revalidatePath("/admin/proforma")
    revalidatePath(`/admin/proforma/${proformaId}`)

    return {
      success: true,
      proforma: updatedProforma,
    }
  } catch (error) {
    console.error("Error updating proforma:", error)
    return {
      success: false,
      error: "Failed to update proforma",
    }
  }
}

// Convert proforma to contract (updated for multiple kiosk selections)
export async function convertProformaToContract(proformaId: string, userId: string) {
  try {
    // Get the proforma details
    const proforma = await prisma.proforma.findUnique({
      where: { id: proformaId },
    })

    if (!proforma) {
      return { success: false, error: "Proforma not found" }
    }

    if (proforma.status !== "ACCEPTED") {
      return { success: false, error: "Only accepted proformas can be converted to contracts" }
    }

    // Generate a unique contract number
    const contractNumber = `CONT-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Create contract description based on kiosk selections
    const kioskSelections = proforma.kioskSelections as any[]
    const kioskSummary =
      kioskSelections?.map((selection) => `${selection.quantity}x ${selection.type}`).join(", ") || "N/A"

    // Create the contract based on the proforma
    const contract = await prisma.contract.create({
      data: {
        contractNumber,
        title: `Contrat de location de kiosque - ${proforma.clientName}`,
        status: "DRAFT",
        clientName: proforma.clientName,
        clientPhone: proforma.clientPhone,
        clientAddress: proforma.clientAddress,
        contractDuration: 12, // Default to 12 months
        paymentFrequency: "Mensuel", // Default to monthly
        paymentAmount: proforma.totalAmount / 12, // Divide total by 12 for monthly payment
        totalAmount: proforma.totalAmount,
        description: `Contrat basé sur la proforma ${proforma.proformaNumber}. Kiosques: ${kioskSummary}`,
        createdById: userId,
        contractActions: {
          create: {
            action: "CONTRACT_CREATED_FROM_PROFORMA",
            description: `Contract created from proforma ${proforma.proformaNumber}`,
          },
        },
      },
    })

    // Update the proforma status to CONVERTED and link to the contract
    await prisma.proforma.update({
      where: { id: proformaId },
      data: {
        status: "CONVERTED",
        contractId: contract.id,
        convertedDate: new Date(),
      },
    })

    revalidatePath("/admin/proforma")
    revalidatePath(`/admin/proforma/${proformaId}`)
    revalidatePath("/admin/contrat")

    return {
      success: true,
      contractId: contract.id,
    }
  } catch (error) {
    console.error("Error converting proforma to contract:", error)
    return {
      success: false,
      error: "Failed to convert proforma to contract",
    }
  }
}

// Get users with search capability
export async function getUsers(searchTerm?: string, role = "CLIENT") {
  try {
    const where: any = {
      role, // Use the passed role, defaulting to 'CLIENT'
    }

    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { email: { contains: searchTerm, mode: "insensitive" } },
        { phone: { contains: searchTerm, mode: "insensitive" } },
      ]
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { name: "asc" },
      take: 50, // Limit results to prevent performance issues
    })

    return {
      success: true,
      users,
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    return {
      success: false,
      error: "Failed to fetch users",
    }
  }
}

// Delete a proforma
export async function deleteProforma(proformaId: string) {
  try {
    // Check if the proforma exists
    const proforma = await prisma.proforma.findUnique({
      where: { id: proformaId },
    })

    if (!proforma) {
      return { success: false, error: "Proforma not found" }
    }

    // Only allow deletion of draft proformas
    if (proforma.status !== "DRAFT") {
      return { success: false, error: "Only draft proformas can be deleted" }
    }

    // Delete the proforma
    await prisma.proforma.delete({
      where: { id: proformaId },
    })

    revalidatePath("/admin/proforma")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting proforma:", error)
    return {
      success: false,
      error: "Failed to delete proforma",
    }
  }
}

// Migration helper function to convert legacy proformas
export async function migrateLegacyProformas() {
  try {
    const legacyProformas = await prisma.proforma.findMany({
      where: {
        kioskSelections: null, // Find proformas without the new structure
        kioskType: { not: null }, // But with legacy data
      },
    })

    for (const proforma of legacyProformas) {
      if (!proforma.kioskType || !proforma.quantity) continue

      // Convert legacy data to new structure
      const kioskSelection = {
        type: proforma.kioskType,
        quantity: proforma.quantity,
        basePrice: proforma.basePrice || 0,
        surfaces: proforma.surfaces || {},
        kioskSubtotal: (proforma.basePrice || 0) * (proforma.quantity || 1),
        surfacesSubtotal: proforma.brandingPrice || 0,
        selectionTotal: proforma.totalAmount || 0,
      }

      await prisma.proforma.update({
        where: { id: proforma.id },
        data: {
          kioskSelections: [kioskSelection],
          subtotal: proforma.totalAmount || 0,
          dtsp: 0, // Legacy proformas didn't have DTSP
          tva: 0, // Legacy proformas didn't have TVA
          dtspRate: 3.0,
          tvaRate: 19.25,
        },
      })
    }

    return {
      success: true,
      migratedCount: legacyProformas.length,
    }
  } catch (error) {
    console.error("Error migrating legacy proformas:", error)
    return {
      success: false,
      error: "Failed to migrate legacy proformas",
    }
  }
}
