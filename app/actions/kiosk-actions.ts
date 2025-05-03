"use server"

import { sendClientNotification, sendStaffNotification } from "@/lib/email"
import { KioskType, type KioskStatus, PrismaClient, Role, KioskTown } from "@prisma/client"
import { get } from "http"

const prisma = new PrismaClient()

type KioskFormData = {
  kioskName: string
  clientName: string
  kioskAddress: string
  gpsLatitude: string
  gpsLongitude: string
  productTypes: string
  kioskType: KioskType
  managerName: string
  managerContacts: string
  status: KioskStatus
  userId: string
  kioskMatricule: string
  kioskTown: KioskTown

}

export async function addKioskByClient(formData: FormData) {
  const kioskData: KioskFormData = {
    kioskName: formData.get("kioskName") as string,
    clientName: formData.get("clientName") as string,
    kioskAddress: formData.get("kioskAddress") as string,
    gpsLatitude: formData.get("gpsLatitute") as string,
    gpsLongitude: formData.get("gpsLongitude") as string,
    kioskType: formData.get("kioskType") as KioskType,
    productTypes: formData.get("productTypes") as string,
    managerName: formData.get("managerName") as string,
    managerContacts: formData.get("managerContact") as string,
    userId: formData.get("userId") as string,
    status: formData.get("status") as KioskStatus ,
    kioskMatricule: formData.get("kioskMatricule") as KioskStatus ,
  }

  try {
    // Validate the data (you may want to add more thorough validation)
    // console.log(formData)
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
        // gpsLatitude: Number.parseFloat(kioskData.latitude) || 0,
        // gpsLongitude: Number.parseFloat(kioskData.longitude) || 0,
        type: kioskData.kioskType,
        productTypes: kioskData.productTypes,
        managerName: kioskData.managerName,
        managerContacts: kioskData.managerContacts,
        status: "REQUEST",
        kioskMatricule: "K-000-0000-000"
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
    gpsLatitude: formData.get("latitude") as string,
    gpsLongitude: formData.get("longitude") as string,
    kioskType: formData.get("kioskType") as KioskType,
    productTypes: formData.get("productTypes") as string,
    managerName: formData.get("managerName") as string,
    managerContacts: formData.get("managerContacts") as string,
    kioskMatricule: formData.get("kioskMatricule") as string,
    userId: formData.get("userId") as string,
    status: formData.get("status") as KioskStatus,
    kioskTown: formData.get("kioskTown") as KioskTown,
  }

  try {
    // Validate the data (you may want to add more thorough validation)
    if (!kioskData.kioskType || !kioskData.kioskMatricule) {
      return { error: "Veuillez remplir tous les champs obligatoires." }
    }

    if (kioskData.kioskType.length === 0) {
      return { error: "Veuillez sélectionner au moins un type de kiosque." }
    }

    // Determine the status based on conditions
    let kioskStatus: KioskStatus = "AVAILABLE"; // Default status

    // If no user is provided, determine status based on GPS coordinates and matricule
    if (!kioskData.userId) {
      const hasGpsCoordinates = kioskData.gpsLatitude && kioskData.gpsLongitude && 
                               kioskData.gpsLatitude.trim() !== "" && kioskData.gpsLongitude.trim() !== "";
      
      if (hasGpsCoordinates) {
        kioskStatus = "UNACTIVE"; // No user but has GPS coordinates
      } else if (kioskData.kioskMatricule && kioskData.kioskMatricule.trim() !== "") {
        kioskStatus = "IN_STOCK"; // No user but has matricule
      }
    } else if (kioskData.status) {
      // If user provided a specific status, use that
      kioskStatus = kioskData.status;
    }

    // Create the kiosk
    const newKiosk = await prisma.kiosk.create({
      data: {
        kioskName: kioskData.kioskName,
        clientName: kioskData.clientName,
        kioskAddress: kioskData.kioskAddress,
        gpsLatitude: Number.parseFloat(kioskData.gpsLatitude) || 0,
        gpsLongitude: Number.parseFloat(kioskData.gpsLongitude) || 0,
        type: kioskData.kioskType,
        productTypes: kioskData.productTypes,
        managerName: kioskData.managerName,
        managerContacts: kioskData.managerContacts,
        kioskMatricule: kioskData.kioskMatricule,
        status: kioskStatus,
        kioskTown: kioskData.kioskTown,
      },
    })

    // Only create UserKiosk record if userId is provided
    if (kioskData.userId) {
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

    // Updated to include kioskTown instead of relying on address
    const kioskCounts = await prisma.kiosk.groupBy({
      by: ["type", "status", "kioskTown"],
      _count: {
        _all: true,
      },
    })

    // Initialize the counts object with towns and the new statuses
    const counts = {
      totalKiosks,
      kiosksAddedThisMonth,
      percentageAddedThisMonth,
      // Default counts for all kiosks with new statuses
      all: {
        oneCompartment: {
          REQUEST: 0,
          IN_STOCK: 0,
          ACTIVE: 0,
          UNACTIVE: 0,
          ACTIVE_UNDER_MAINTENANCE: 0,
          UNACTIVE_UNDER_MAINTENANCE: 0,
        },
        threeCompartment: {
          REQUEST: 0,
          IN_STOCK: 0,
          ACTIVE: 0,
          UNACTIVE: 0,
          ACTIVE_UNDER_MAINTENANCE: 0,
          UNACTIVE_UNDER_MAINTENANCE: 0,
        },
      },
      // Town-specific counts with new statuses
      towns: {
        DOUALA: {
          oneCompartment: {
            REQUEST: 0,
            IN_STOCK: 0,
            ACTIVE: 0,
            UNACTIVE: 0,
            ACTIVE_UNDER_MAINTENANCE: 0,
            UNACTIVE_UNDER_MAINTENANCE: 0,
          },
          threeCompartment: {
            REQUEST: 0,
            IN_STOCK: 0,
            ACTIVE: 0,
            UNACTIVE: 0,
            ACTIVE_UNDER_MAINTENANCE: 0,
            UNACTIVE_UNDER_MAINTENANCE: 0,
          },
        },
        YAOUNDE: {
          oneCompartment: {
            REQUEST: 0,
            IN_STOCK: 0,
            ACTIVE: 0,
            UNACTIVE: 0,
            ACTIVE_UNDER_MAINTENANCE: 0,
            UNACTIVE_UNDER_MAINTENANCE: 0,
          },
          threeCompartment: {
            REQUEST: 0,
            IN_STOCK: 0,
            ACTIVE: 0,
            UNACTIVE: 0,
            ACTIVE_UNDER_MAINTENANCE: 0,
            UNACTIVE_UNDER_MAINTENANCE: 0,
          },
        },
      },
    }

    kioskCounts.forEach(({ type, status, kioskTown, _count }) => {
      // Use kioskTown directly instead of parsing from address
      const town = kioskTown || null

      // Update the overall counts
      if (type === KioskType.ONE_COMPARTMENT_WITH_BRANDING || type === KioskType.ONE_COMPARTMENT_WITHOUT_BRANDING) {
        // Only update if the status exists in our structure
        if (counts.all.oneCompartment[status] !== undefined) {
          counts.all.oneCompartment[status] += _count._all
        }
      } else {
        if (counts.all.threeCompartment[status] !== undefined) {
          counts.all.threeCompartment[status] += _count._all
        }
      }

      // Update town-specific counts if applicable
      if (town && counts.towns[town]) {
        if (type === KioskType.ONE_COMPARTMENT_WITH_BRANDING || type === KioskType.ONE_COMPARTMENT_WITHOUT_BRANDING) {
          if (counts.towns[town].oneCompartment[status] !== undefined) {
            counts.towns[town].oneCompartment[status] += _count._all
          }
        } else {
          if (counts.towns[town].threeCompartment[status] !== undefined) {
            counts.towns[town].threeCompartment[status] += _count._all
          }
        }
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
  limit = 100,
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
    // First get all kioskIds for this user
    const userKiosks = await prisma.userKiosk.findMany({
      where: {
        userId: userId,
      },
      select: {
        kioskId: true,
      },
    })


    if (!userKiosks.length) {
      return {
        totalKiosks: 0,
        kiosksAddedThisMonth: 0,
        percentageAddedThisMonth: 0,
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
    }

    // Get the kioskIds array
    const kioskIds = userKiosks.map((uk) => uk.kioskId)

    // Then fetch the actual kiosk data using these ids
    const kiosks = await prisma.kiosk.findMany({
      where: {
        id: {
          in: kioskIds,
        },
      },
    })

    const totalKiosks = kiosks.length

    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const kiosksAddedThisMonth = kiosks.filter((kiosk) => kiosk.createdAt >= firstDayOfMonth).length

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

    kiosks.forEach((kiosk) => {
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
    // if (!formData.kioskName || !formData.clientName || !formData.kioskAddress) {
    //   return { error: "Veuillez remplir tous les champs obligatoires." }
    // }

    // Update the kiosk
    // console.log(formData)
    const updatedKiosk = await prisma.kiosk.update({
      where: { id: kioskId },
      data: {
        kioskName: formData.kioskName,
        clientName: formData.clientName,
        kioskAddress: formData.kioskAddress,
        gpsLatitude: formData.gpsLatitude ? parseFloat(formData.gpsLatitude) : 0,
        gpsLongitude: formData.gpsLatitude ? parseFloat(formData.gpsLongitude) : 0,
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

export async function getKiosksWithCoordinates() {
  try {
    const kiosks = await prisma.kiosk.findMany({
      where: {
        gpsLatitude: { not: null },
        gpsLongitude: { not: null },
      },
      select: {
        id: true,
        kioskName: true,
        clientName: true,
        managerName: true,
        productTypes: true,
        kioskAddress: true,
        gpsLatitude: true,
        gpsLongitude: true,
        averageMonthlyRevenue: true,
        type: true,
      },
    })
    
    return kiosks.map(kiosk => ({
      id: kiosk.id.toString(),
      position: {
        lat: kiosk.gpsLatitude!,
        lng: kiosk.gpsLongitude!,
      },
      title: kiosk.kioskName,
      client: kiosk.clientName || 'Non spécifié',
      manager: kiosk.managerName || 'Non spécifié',
      services: kiosk.productTypes || 'Non spécifié',
      location: kiosk.kioskAddress || 'Non spécifié',
      coordinates: `${kiosk.gpsLatitude}, ${kiosk.gpsLongitude}`,
      revenue: kiosk.averageMonthlyRevenue ? 
        `${kiosk.averageMonthlyRevenue.toLocaleString()} CFA` : 
        'Non spécifié',
      type: kiosk.type
    }))
  } catch (error) {
    console.error("Error fetching kiosks with coordinates:", error)
    throw new Error("Failed to fetch kiosks with coordinates")
  }
}

export async function deleteKiosk(kioskId: number) {
  try {
    // First delete related UserKiosk records
    await prisma.userKiosk.deleteMany({
      where: {
        kioskId: kioskId,
      },
    })

    // Then delete the kiosk
    const deletedKiosk = await prisma.kiosk.delete({
      where: {
        id: kioskId,
      },
    })

    return { message: "Kiosque supprimé avec succès!", kiosk: deletedKiosk }
  } catch (error) {
    console.error("Error deleting kiosk:", error)
    return { error: "Une erreur est survenue lors de la suppression du kiosque." }
  }
}


export async function getUserKiosks({
  userId,
  page = 1,
  limit = 100,
  searchTerm = "",
  status,
  date,
}: {
  userId: string
  page?: number
  limit?: number
  searchTerm?: string
  status?: KioskStatus | "all"
  date?: Date
}) {
  try {
    // Base where clause that includes the user relation
    const where: any = {
      users: {
        some: {
          userId: userId,
        },
      },
    }

    // Add search conditions
    if (searchTerm) {
      where.OR = [
        { kioskName: { contains: searchTerm, mode: "insensitive" } },
        { clientName: { contains: searchTerm, mode: "insensitive" } },
        { managerName: { contains: searchTerm, mode: "insensitive" } },
        { kioskAddress: { contains: searchTerm, mode: "insensitive" } },
      ]
    }

    // Add status filter
    if (status && status !== "all") {
      where.status = status
    }

    // Add date filter
    if (date) {
      where.createdAt = {
        gte: date,
        lt: new Date(date.getTime() + 24 * 60 * 60 * 1000), // Next day
      }
    }

    // Fetch kiosks and total count in parallel
    const [kiosks, totalCount] = await Promise.all([
      prisma.kiosk.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          users: {
            where: {
              userId: userId,
            },
            select: {
              userId: true,
            },
          },
        },
      }),
      prisma.kiosk.count({ where }),
    ])

    return {
      kiosks,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    }
  } catch (error) {
    console.error("Error fetching user kiosks:", error)
    throw new Error("Une erreur est survenue lors de la récupération des kiosques de l'utilisateur.")
  }
}

export async function getUserKiosksForTicket(userId: string) {
  try {
    // First get the kioskIds for this user
    const userKiosks = await prisma.userKiosk.findMany({
      where: {
        userId: userId,
      },
      select: {
        kioskId: true,
      },
    })

    // Get the array of kioskIds
    const kioskIds = userKiosks.map((uk) => uk.kioskId)

    // Fetch only the needed fields for the kiosks that belong to the user
    const kiosks = await prisma.kiosk.findMany({
      where: {
        id: {
          in: kioskIds,
        },
      },
      select: {
        id: true,
        kioskName: true,
        clientName: true,
      },
    })

    return kiosks
  } catch (error) {
    console.error("Error fetching kiosks for ticket:", error)
    throw new Error("Une erreur est survenue lors de la récupération des kiosques.")
  }
}