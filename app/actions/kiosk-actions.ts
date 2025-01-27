"use server"

import { KioskType, KioskStatus, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

type KioskFormData = {
  kioskName: string
  clientName: string
  kioskAddress: string
  latitude: string
  longitude: string
  kioskType: KioskType
  productsServices: string
  managerName: string
  managerContact: string
}

export async function addKiosk(formData: FormData) {
  const kioskData: KioskFormData = {
    kioskName: formData.get("kioskName") as string,
    clientName: formData.get("clientName") as string,
    kioskAddress: formData.get("kioskAddress") as string,
    latitude: formData.get("latitude") as string,
    longitude: formData.get("longitude") as string,
    kioskType: formData.get("kioskType") as KioskType,
    productsServices: formData.get("productsServices") as string,
    managerName: formData.get("managerName") as string,
    managerContact: formData.get("managerContact") as string,
  }

  try {
    // Validate the data (you may want to add more thorough validation)
    if (!kioskData.kioskName || !kioskData.clientName || !kioskData.kioskAddress) {
      return { error: "Veuillez remplir tous les champs obligatoires." }
    }

    if (kioskData.kioskType.length === 0) {
      return { error: "Veuillez sélectionner au moins un type de kiosque." }
    }

    // Create the kiosk in the database
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
        managerContacts: kioskData.managerContact,
      },
    })

    return { message: "Kiosque ajouté avec succès!", kiosk: newKiosk }
  } catch (error) {
    console.error("Error adding kiosk:", error)
    return { error: "Une erreur est survenue lors de l'ajout du kiosque." }
  }
}

export async function getKioskCounts() {
  try {
    const totalKiosks = await prisma.kiosk.count()

    const kioskCounts = await prisma.kiosk.groupBy({
      by: ["type", "status"],
      _count: {
        _all: true,
      },
    })

    const counts = {
      totalKiosks,
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
  status?: KioskStatus
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

    if (status) {
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
    }
  } catch (error) {
    console.error("Error fetching kiosks:", error)
    throw new Error("Une erreur est survenue lors de la récupération des kiosques.")
  }
}