"use server"

import { PrismaClient, RequestStatus, type RequestPriority } from "@prisma/client"

const prisma = new PrismaClient()

export async function createServiceRequest(formData: {
  kioskId: number
  technicians: string[]
  problemDescription: string
  comments?: string
  priority: RequestPriority
  resolvedDate?: string
  attachments?: string[]
}) {

  console.log(formData);
  try {
    const newServiceRequest = await prisma.serviceRequest.create({
      data: {
        kiosk: { connect: { id: formData.kioskId } },
        technicians: {
          connect: formData.technicians.map((id) => ({ id })),
        },
        problemDescription: formData.problemDescription,
        comments: formData.comments,
        priority: formData.priority,
        resolvedDate: formData.resolvedDate ? new Date(formData.resolvedDate) : null,
        attachments: formData.attachments ? formData.attachments.join(",") : null,
        status: RequestStatus.OPEN,
      },
    })

    // Update kiosk status to UNDER_MAINTENANCE
    await prisma.kiosk.update({
      where: { id: formData.kioskId },
      data: { status: "UNDER_MAINTENANCE" },
    })

    return newServiceRequest
  } catch (error) {
    console.error("Error creating service request:", error)
    throw new Error("Failed to create service request")
  }
}

export async function getServiceRequests() {
  try {
    const serviceRequests = await prisma.serviceRequest.findMany({
      include: {
        kiosk: true,
        technicians: true,
      },
    })
    return serviceRequests
  } catch (error) {
    console.error("Error fetching service requests:", error)
    throw new Error("Failed to fetch service requests")
  }
}

