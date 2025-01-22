"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function fetchLastNineUsers() {
  try {
    const users = await prisma.user.findMany({
      take: 9,
      orderBy: {
        createdAt: "desc", // Order by createdAt field in descending order
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })
    return { success: true, users }
  } catch (error) {
    console.error("Failed to fetch recent users:", error)
    return { success: false, error: "Failed to fetch recent users" }
  } finally {
    await prisma.$disconnect()
  }
}