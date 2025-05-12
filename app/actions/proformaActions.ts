"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { ProformaStatus, KioskBrandingType } from "@prisma/client"
import { generatePdf } from "@/lib/pdfGenerator" // Assuming you have a PDF generator

// Types
type ProformaFormData = {
  clientId: string
  clientName: string
  clientEmail?: string
  clientPhone?: string
  clientAddress?: string
  kioskType: KioskBrandingType
  quantity: number
  surfaces: {
    joues: boolean
    oreilles: boolean
    menton: boolean
    fronton: boolean
  }
  basePrice: number
  brandingPrice: number
  totalAmount: number
  createdById: string
}

// Create a new proforma
export async function createProforma(formData: ProformaFormData) {
  try {
    // Validate form data
    if (!formData.clientId) {
      return { success: false, error: "Client ID is required" }
    }

    if (!formData.kioskType) {
      return { success: false, error: "Kiosk type is required" }
    }

    if (!formData.quantity || formData.quantity < 1) {
      return { success: false, error: "Quantity must be at least 1" }
    }

    // Generate a unique proforma number
    const proformaNumber = `PRO-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Calculate expiry date (30 days from now)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30)

    // Create the proforma
    const proforma = await prisma.proforma.create({
      data: {
        proformaNumber,
        clientId: formData.clientId,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        clientAddress: formData.clientAddress,
        kioskType: formData.kioskType,
        quantity: formData.quantity,
        surfaces: formData.surfaces,
        basePrice: formData.basePrice,
        brandingPrice: formData.brandingPrice,
        totalAmount: formData.totalAmount,
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

    // Generate PDF (if you have a PDF generator)
    try {
      const pdfUrl = await generatePdf(proforma)

      // Update proforma with PDF URL
      await prisma.proforma.update({
        where: { id: proforma.id },
        data: { pdfUrl },
      })

      proforma.pdfUrl = pdfUrl
    } catch (pdfError) {
      console.error("Error generating PDF:", pdfError)
      // Continue without PDF if generation fails
    }

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
    const updatedProforma = await prisma.proforma.update({
      where: { id: proformaId },
      data: { status },
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

// Convert proforma to contract
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
