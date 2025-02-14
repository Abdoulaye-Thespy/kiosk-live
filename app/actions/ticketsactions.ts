"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function createMaintenanceEvent(formData: {
    title: string
    kiosk: string
    startDate: string
    endDate: string
    description: string
    technicians: string[]
    attachments: string[]
  }) {
    const newEvent = await prisma.serviceRequest.create({
      data: {
        problemDescription: formData.title,
        kioskId: Number.parseInt(formData.kiosk),
        createdDate: new Date(formData.startDate),
        resolvedDate: new Date(formData.endDate),
        comments: formData.description,
        status: "OPEN",
        priority: "MEDIUM",
        attachments: formData.attachments.join(","),
        technicians: {
          connect: formData.technicians.map((id) => ({ id })),
        },
      },
    })
  
    return newEvent
  }