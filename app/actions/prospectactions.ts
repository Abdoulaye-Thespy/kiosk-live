"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { hash } from "bcrypt"
import { startOfMonth } from "date-fns"

// Types
type ProspectFormData = {
  id?: string
  name: string
  contact?: string // Changed from email/phone to a single contact field
  need?: string
  assignedToId?: string
  createdById?: string
}

// Add this helper function to map between status types
function mapStatusIdToProspectStatus(statusId: string): string {
  switch (statusId) {
    case "ACTIVE":
      return "QUALIFIED"
    case "INACTIVE":
      return "LOST"
    case "PENDING":
    default:
      return "NEW"
  }
}

function mapProspectStatusToStatusId(prospectStatus: string): string {
  switch (prospectStatus) {
    case "QUALIFIED":
    case "PROPOSAL_SENT":
    case "NEGOTIATION":
    case "CONVERTED":
      return "ACTIVE"
    case "LOST":
      return "INACTIVE"
    case "NEW":
    case "CONTACTED":
    default:
      return "PENDING"
  }
}

// Create a new prospect
export async function createProspect(formData: ProspectFormData) {
  try {
    // Validate form data
    if (!formData.name) {
      return { success: false, error: "Name is required" }
    }

    // Create the prospect with the provided ID if available
    // Note: We're not setting a status for new prospects as requested
    const prospect = await prisma.prospect.create({
      data: {
        id: formData.id, // Use the ID from the frontend if provided
        name: formData.name,
        contact: formData.contact,
        need: formData.need,
        assignedToId: formData.createdById,
        createdById: formData.createdById,
        lastContactDate: new Date(),
      },
    })

    revalidatePath("/commercial/prospects")

    return {
      success: true,
      prospect,
    }
  } catch (error) {
    console.error("Error creating prospect:", error)
    return {
      success: false,
      error: "Failed to create prospect",
    }
  }
}

// Convert a prospect to a user
export async function convertProspectToUser(prospectId: string) {
  try {
    // Find the prospect
    const prospect = await prisma.prospect.findUnique({
      where: { id: prospectId },
    })

    if (!prospect) {
      return { success: false, error: "Prospect not found" }
    }

    // Validate prospect data
    if (!prospect.name) {
      return { success: false, error: "Prospect name is required" }
    }

    if (!prospect.email && !prospect.phone) {
      return { success: false, error: "Prospect must have either email or phone" }
    }

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8)
    const hashedPassword = await hash(tempPassword, 10)

    // Create a new user from the prospect
    const user = await prisma.user.create({
      data: {
        name: prospect.name,
        email: prospect.email || `prospect-${prospect.id}@placeholder.com`,
        phone: prospect.phone,
        address: prospect.address,
        role: "CLIENT",
        status: "PENDING",
        password: hashedPassword,
      },
    })

    // Update the prospect to link it to the user and mark as converted
    await prisma.prospect.update({
      where: { id: prospect.id },
      data: {
        convertedUserId: user.id,
        prospectStatus: "CONVERTED",
        conversionDate: new Date(),
      },
    })

    // Create a quote if needed
    if (prospect.need) {
      await prisma.quote.create({
        data: {
          prospectId: prospect.id,
          createdById: user.id,
          services: prospect.need,
        },
      })
    }

    revalidatePath("/commercial/prospects")
    revalidatePath("/admin/utilisateurs")

    return {
      success: true,
      user,
      tempPassword, // In a real app, you'd send this via email
    }
  } catch (error) {
    console.error("Error converting prospect to user:", error)
    return {
      success: false,
      error: "Failed to convert prospect to user",
    }
  }
}

// Fetch prospect statistics
export async function fetchProspectStats() {
  try {
    // Get total prospects count
    const totalProspects = await prisma.prospect.count()

    // Get prospects created this month
    const startOfCurrentMonth = startOfMonth(new Date())
    const prospectsThisMonth = await prisma.prospect.count({
      where: {
        createdAt: {
          gte: startOfCurrentMonth,
        },
      },
    })

    // Get concluded prospects (converted to users)
    const concludedProspects = await prisma.prospect.count({
      where: {
        prospectStatus: "CONVERTED",
      },
    })

    // Calculate percentage growth (simplified)
    // In a real app, you'd compare with previous month
    const percentageGrowth = totalProspects > 0 ? Math.round((prospectsThisMonth / totalProspects) * 100) : 0

    return {
      success: true,
      totalProspects,
      prospectsThisMonth,
      percentageGrowth,
      concludedProspects,
    }
  } catch (error) {
    console.error("Error fetching prospect stats:", error)
    return {
      success: false,
      error: "Failed to fetch prospect statistics",
    }
  }
}

// Update an existing prospect
export async function updateProspect(prospectId: string, data: Partial<ProspectFormData>) {
  try {
    // Validate required fields
    if (data.name === "") {
      return { success: false, error: "Name is required" }
    }

    // Map the statusId to prospectStatus
    let prospectStatus
    if (data.statusId) {
      prospectStatus = mapStatusIdToProspectStatus(data.statusId)
    }

    const prospect = await prisma.prospect.update({
      where: { id: prospectId },
      data: {
        name: data.name,
        email: data.contact?.includes("@") ? data.contact : undefined,
        phone: !data.contact?.includes("@") ? data.contact : undefined,
        need: data.need,
        prospectStatus: prospectStatus, // Use the mapped status
        assignedToId: data.assignedToId,
        lastContactDate: new Date(),
      },
    })

    revalidatePath("/commercial/prospects")

    return {
      success: true,
      prospect,
    }
  } catch (error) {
    console.error("Error updating prospect:", error)
    return {
      success: false,
      error: "Failed to update prospect",
    }
  }
}

// Delete a prospect
export async function deleteProspect(prospectId: string) {
  try {
    await prisma.prospect.delete({
      where: { id: prospectId },
    })

    revalidatePath("/commercial/prospects")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting prospect:", error)
    return {
      success: false,
      error: "Failed to delete prospect",
    }
  }
}

// Get a single prospect by ID
export async function getProspect(prospectId: string) {
  try {
    const prospect = await prisma.prospect.findUnique({
      where: { id: prospectId },
      include: {
        assignedTo: true,
        createdBy: true,
        quotes: true,
        actions: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!prospect) {
      return { success: false, error: "Prospect not found" }
    }

    return {
      success: true,
      prospect,
    }
  } catch (error) {
    console.error("Error fetching prospect:", error)
    return {
      success: false,
      error: "Failed to fetch prospect",
    }
  }
}

// Get all prospects
export async function getAllProspects() {
  try {
    const prospects = await prisma.prospect.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Map the prospects to the format expected by the UI
    const mappedProspects = prospects.map((prospect) => ({
      ...prospect,
      contact: prospect.email || prospect.phone || "",
      statusId: mapProspectStatusToStatusId(prospect.prospectStatus || "NEW"),
    }))

    return {
      success: true,
      prospects: mappedProspects,
    }
  } catch (error) {
    console.error("Error fetching prospects:", error)
    return {
      success: false,
      error: "Failed to fetch prospects",
    }
  }
}

