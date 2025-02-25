"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function fetchUserStats() {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [totalUsers, usersThisMonth, usersBeforeThisMonth, lastNineUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            lt: startOfMonth,
          },
        },
      }),
      prisma.user.findMany({
        take: 9,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      }),
    ])

    let percentageGrowth = 0
    if (usersBeforeThisMonth > 0) {
      percentageGrowth = (usersThisMonth / usersBeforeThisMonth) * 100
    } else if (usersThisMonth > 0) {
      percentageGrowth = 100 // If there were no users before this month, growth is 100%
    }

    return {
      success: true,
      totalUsers,
      usersThisMonth,
      percentageGrowth: Number.parseFloat(percentageGrowth.toFixed(2)),
      lastNineUsers,
    }
  } catch (error) {
    console.error("Failed to fetch user stats:", error)
    return { success: false, error: "Failed to fetch user stats" }
  } finally {
    await prisma.$disconnect()
  }
}

export async function fetchClients() {
  try {
    const clients = await prisma.user.findMany({
      where: {
        role: "CLIENT",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return {
      success: true,
      clients,
    }
  } catch (error) {
    console.error("Failed to fetch clients:", error)
    return { success: false, error: "Failed to fetch clients" }
  } finally {
    await prisma.$disconnect()
  }
}

export async function getTechnicians() {
  const technicians = await prisma.user.findMany({
    where: {
      role: "TECHNICIEN",
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  })
  return technicians
}

export async function getUserDetails(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error("User not found")
    }

    return user
  } catch (error) {
    console.error("Error fetching user details:", error)
    throw new Error("Failed to fetch user details")
  }
}