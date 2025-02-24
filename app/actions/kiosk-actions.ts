"use server"

import { sendClientNotification, sendStaffNotification } from "@/lib/email"
import { KioskType, type KioskStatus, PrismaClient, Role } from "@prisma/client"
import { get } from "http"

const prisma = new PrismaClient()

type KioskFormData = {
  kioskName: string
  clientName: string
  kioskAddress: string
  latitude: string
  longitude: string
  productTypes: string
  kioskType: KioskType
  managerName: string
  managerContacts: string
  status: KioskStatus
  userId: string

}

export async function addKioskByClient(formData: FormData) {
  const kioskData: KioskFormData = {
    kioskName: formData.get("kioskName") as string,
    clientName: formData.get("clientName") as string,
    kioskAddress: formData.get("kioskAddress") as string,
    latitude: formData.get("latitude") as string,
    longitude: formData.get("longitude") as string,
    kioskType: formData.get("kioskType") as KioskType,
    productTypes: formData.get("productTypes") as string,
    managerName: formData.get("managerName") as string,
    managerContacts: formData.get("managerContact") as string,
    userId: formData.get("userId") as string,
    status: formData.get("status") as KioskStatus ,
  }

  try {
    // Validate the data (you may want to add more thorough validation)
    console.log(formData)
    if (!kioskData.kioskName || !kioskData.clientName || !kioskData.kioskAddress || !kioskData.userId) {
      return { error: "Veuillez remplir tous les champs obligatoires." }
    }

    if (kioskData.kioskType.length === 0) {
      return { error: "Veuillez sélectionner au moins un type de kiosque." }
    }

    // Create the kiosk with status set to REQUEST
    const newKiosk = await prisma.kiosk.create({
      data: {
        kioskName: kioskData.kioskName,
        clientName: kioskData.clientName,
        kioskAddress: kioskData.kioskAddress,
        gpsLatitude: Number.parseFloat(kioskData.latitude) || 0,
        gpsLongitude: Number.parseFloat(kioskData.longitude) || 0,
        type: kioskData.kioskType,
        productTypes: kioskData.productsServices,
        managerName: kioskData.managerName,
        managerContacts: kioskData.managerContacts,
        status: "REQUEST",
      },
    })

    // Create the UserKiosk record
    await prisma.userKiosk.create({
      data: {
        userId: kioskData.userId,
        kioskId: newKiosk.id,
      },
    })

    // Fetch all users with RESPONSABLE or ADMIN role
    const staffUsers = await prisma.user.findMany({
      where: {
        role: {
          in: [Role.RESPONSABLE, Role.ADMIN],
        },
      },
    })

    // Prepare kiosk details for email
    const kioskDetails = `
      <p><strong>Nom de l'Entreprise :</strong> ${newKiosk.kioskName}</p>
      <p><strong>Client :</strong> ${newKiosk.clientName}</p>
      <p><strong>Adresse :</strong> ${newKiosk.kioskAddress}</p>
      <p><strong>Type :</strong> ${newKiosk.type}</p>
    `

    // Send email to all staff users
    await sendStaffNotification(
      staffUsers.map((user) => user.email),
      kioskDetails,
    )

    return { message: "Demande de kiosque soumise avec succès!", kiosk: newKiosk }
  } catch (error) {
    console.error("Error adding kiosk by client:", error)
    return { error: "Une erreur est survenue lors de la soumission de la demande de kiosque." }
  }
}

export async function addKioskByStaff(formData: FormData) {
  console.log("Here is form data ", formData);
  const kioskData: KioskFormData = {
    clientName: formData.get("clientName") as string,
    kioskName: formData.get("kioskName") as string,
    kioskAddress: formData.get("kioskAddress") as string,
    latitude: formData.get("latitude") as string,
    longitude: formData.get("longitude") as string,
    kioskType: formData.get("kioskType") as KioskType,
    productTypes: formData.get("productTypes") as string,
    managerName: formData.get("managerName") as string,
    managerContacts: formData.get("managerContacts") as string,
    userId: formData.get("userId") as string,
    status: formData.get("status") as KioskStatus,
  }


  try {
    // Validate the data (you may want to add more thorough validation)
    if (!kioskData.kioskName || !kioskData.clientName || !kioskData.kioskAddress || !kioskData.userId) {
      return { error: "Veuillez remplir tous les champs obligatoires." }
    }

    if (kioskData.kioskType.length === 0) {
      return { error: "Veuillez sélectionner au moins un type de kiosque." }
    }

    // Create the kiosk
    const newKiosk = await prisma.kiosk.create({
      data: {
        kioskName: kioskData.kioskName,
        clientName: kioskData.clientName,
        kioskAddress: kioskData.kioskAddress,
        gpsLatitude: Number.parseFloat(kioskData.latitude) || 0,
        gpsLongitude: Number.parseFloat(kioskData.longitude) || 0,
        type: kioskData.kioskType,
        productTypes: kioskData.productTypes,
        managerName: kioskData.managerName,
        managerContacts: kioskData.managerContacts,
        status: "AVAILABLE",
      },
    })

    // Create the UserKiosk record
    await prisma.userKiosk.create({
      data: {
        userId: kioskData.userId,
        kioskId: newKiosk.id,
      },
    })

    // Fetch the user associated with the kiosk
    const user = await prisma.user.findUnique({
      where: { id: kioskData.userId },
    })

    if (user) {
      // Send email to the client
      await sendClientNotification(user.email, newKiosk.kioskName, newKiosk.kioskAddress)
    }

    return { message: "Kiosque ajouté avec succès!", kiosk: newKiosk }
  } catch (error) {
    console.error("Error adding kiosk by staff:", error)
    return { error: "Une erreur est survenue lors de l'ajout du kiosque." }
  }
}

export async function getKioskCounts() {
  try {
    const totalKiosks = await prisma.kiosk.count()

    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const kiosksAddedThisMonth = await prisma.kiosk.count({
      where: {
        createdAt: {
          gte: firstDayOfMonth,
        },
      },
    })

    const percentageAddedThisMonth = totalKiosks > 0 ? (kiosksAddedThisMonth / totalKiosks) * 100 : 0

    const kioskCounts = await prisma.kiosk.groupBy({
      by: ["type", "status"],
      _count: {
        _all: true,
      },
    })

    const counts = {
      totalKiosks,
      kiosksAddedThisMonth,
      percentageAddedThisMonth,
      oneCompartment: {
        AVAILABLE: 0,
        UNDER_MAINTENANCE: 0,
        REQUEST: 0,
        LOCALIZING: 0,
      },
      threeCompartment: {
        AVAILABLE: 0,
        UNDER_MAINTENANCE: 0,
        REQUEST: 0,
        LOCALIZING: 0,
      },
    }

    kioskCounts.forEach(({ type, status, _count }) => {
      if (type === KioskType.ONE_COMPARTMENT_WITH_BRANDING || type === KioskType.ONE_COMPARTMENT_WITHOUT_BRANDING) {
        counts.oneCompartment[status] += _count._all
      } else {
        counts.threeCompartment[status] += _count._all
      }
    })

    return counts
  } catch (error) {
    console.error("Error counting kiosks:", error)
    throw new Error("Une erreur est survenue lors du comptage des kiosques.")
  }
}

export async function getKiosks({
  page = 1,
  limit = 10,
  searchTerm = "",
  status,
  date,
}: {
  page?: number
  limit?: number
  searchTerm?: string
  status?: KioskStatus | "all"
  date?: Date
}) {
  try {
    const where: any = {}

    if (searchTerm) {
      where.OR = [
        { kioskName: { contains: searchTerm, mode: "insensitive" } },
        { clientName: { contains: searchTerm, mode: "insensitive" } },
        { managerName: { contains: searchTerm, mode: "insensitive" } },
        { kioskAddress: { contains: searchTerm, mode: "insensitive" } },
      ]
    }

    if (status && status !== "all") {
      where.status = status
    }

    if (date) {
      where.createdAt = {
        gte: date,
        lt: new Date(date.getTime() + 24 * 60 * 60 * 1000), // Next day
      }
    }

    const [kiosks, totalCount] = await Promise.all([
      prisma.kiosk.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.kiosk.count({ where }),
    ])

    return {
      kiosks,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    }
  } catch (error) {
    console.error("Error fetching kiosks:", error)
    throw new Error("Une erreur est survenue lors de la récupération des kiosques.")
  }
}

export async function getUserKioskCounts(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        kiosks: {
          include: {
            kiosk: true,
          },
        },
      },
    })

    if (!user) {
      throw new Error("Utilisateur non trouvé.")
    }

    const userKiosks = user.kiosks.map((uk) => uk.kiosk)

    const totalKiosks = userKiosks.length

    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const kiosksAddedThisMonth = userKiosks.filter((kiosk) => kiosk.createdAt >= firstDayOfMonth).length

    const percentageAddedThisMonth = totalKiosks > 0 ? (kiosksAddedThisMonth / totalKiosks) * 100 : 0

    const counts = {
      totalKiosks,
      kiosksAddedThisMonth,
      percentageAddedThisMonth,
      oneCompartment: {
        AVAILABLE: 0,
        UNDER_MAINTENANCE: 0,
        REQUEST: 0,
        LOCALIZING: 0,
      },
      threeCompartment: {
        AVAILABLE: 0,
        UNDER_MAINTENANCE: 0,
        REQUEST: 0,
        LOCALIZING: 0,
      },
    }

    userKiosks.forEach((kiosk) => {
      if (
        kiosk.type === KioskType.ONE_COMPARTMENT_WITH_BRANDING ||
        kiosk.type === KioskType.ONE_COMPARTMENT_WITHOUT_BRANDING
      ) {
        counts.oneCompartment[kiosk.status]++
      } else {
        counts.threeCompartment[kiosk.status]++
      }
    })

    return counts
  } catch (error) {
    console.error("Error counting user kiosks:", error)
    throw new Error("Une erreur est survenue lors du comptage des kiosques de l'utilisateur.")
  }
}

export async function updateKiosk(kioskId: number, formData: KioskFormData) {

  try {
    // Validate the data
    if (!formData.kioskName || !formData.clientName || !formData.kioskAddress) {
      return { error: "Veuillez remplir tous les champs obligatoires." }
    }

    // Update the kiosk
    const updatedKiosk = await prisma.kiosk.update({
      where: { id: kioskId },
      data: {
        kioskName: formData.kioskName,
        clientName: formData.clientName,
        kioskAddress: formData.kioskAddress,
        gpsLatitude: formData.latitude ? Number.parseFloat(formData.latitude) : undefined,
        gpsLongitude: formData.longitude ? Number.parseFloat(formData.longitude) : undefined,
        type: formData.kioskType,
        productTypes: formData.productTypes,
        managerName: formData.managerName,
        managerContacts: formData.managerContacts,
        status: formData.status as KioskStatus,
      },
    })

    return { message: "Kiosque modifié avec succès!", kiosk: updatedKiosk }
  } catch (error) {
    console.error("Error updating kiosk:", error)
    return { error: "Une erreur est survenue lors de la modification du kiosque." }
  }
}


export async function getKiosksForTicket() {
  const kiosks = await prisma.kiosk.findMany({
    select: {
      id: true,
      kioskName: true,
      clientName: true,
    },
  })
  return kiosks
}

export async function getUserServiceRequests(userId: string) {
  try {
    const serviceRequests = await prisma.serviceRequest.findMany({
      where: {
        OR: [
          {
            technicians: {
              some: {
                id: userId,
              },
            },
          },
          {
            kiosk: {
              users: {
                some: {
                  userId: userId,
                },
              },
            },
          },
        ],
      },
      include: {
        kiosk: true,
        technicians: true,
      },
      orderBy: {
        createdDate: "desc",
      },
    })
    return serviceRequests
  } catch (error) {
    console.error("Error fetching user service requests:", error)
    throw new Error("Failed to fetch user service requests")
  }
}


export async function getClientServiceRequests({
  userId,
  page = 1,
  limit = 10,
  searchTerm = "",
  status,
  startDate,
  endDate,
}: {
  userId: string
  page?: number
  limit?: number
  searchTerm?: string
  status?: RequestStatus
  startDate?: Date
  endDate?: Date
}) {
  try {
    // First, get the kiosk IDs associated with the user
    const userKiosks = await prisma.userKiosk.findMany({
      where: { userId: userId },
      select: { kioskId: true },
    })

    const kioskIds = userKiosks.map((uk) => uk.kioskId)

    // Prepare the where clause for the service requests query
    const where: any = {
      kioskId: { in: kioskIds },
    }

    if (searchTerm) {
      where.OR = [
        { id: { contains: searchTerm } },
        { problemDescription: { contains: searchTerm } },
        { kiosk: { kioskName: { contains: searchTerm } } },
        { technicians: { some: { name: { contains: searchTerm } } } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (startDate) {
      where.createdDate = { gte: startDate }
    }

    if (endDate) {
      where.createdDate = endDate ? { ...where.createdDate, lte: endDate } : where.createdDate
    }

    // Fetch service requests
    const [serviceRequests, totalCount] = await Promise.all([
      prisma.serviceRequest.findMany({
        where,
        include: {
          technicians: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          kiosk: true,
        },
        orderBy: {
          createdDate: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.serviceRequest.count({ where }),
    ])

    return {
      serviceRequests,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    }
  } catch (error) {
    console.error("Error fetching user's service requests:", error)
    throw new Error("Failed to fetch user's service requests")
  }
}