"use server"

// app/actions/fetchUserStats.ts
import { prisma } from "@/lib/prisma"
import { Role, ClientType } from "@prisma/client"

export async function fetchUserStats() {
  try {
    // Get all clients
    const clients = await prisma.user.findMany({
      where: { role: "CLIENT" },
      select: { id: true, name: true, email: true, clientType: true, createdAt: true },
    })

    // Get total users
    const totalUsers = await prisma.user.count()
    const totalClients = clients.length
    const staffCount = totalUsers - totalClients

    console.log(totalClients, totalUsers, staffCount);

    // Client type breakdown
    const particulierCount = clients.filter(c => c.clientType === "PARTICULIER").length
    const entrepriseCount = clients.filter(c => c.clientType === "ENTREPRISE").length

    // Last 9 users for recent users list
    const lastNineUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 9,
      select: { id: true, name: true, email: true, createdAt: true },
    })

    // Users added this month
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const usersThisMonth = await prisma.user.count({
      where: { createdAt: { gte: firstDayOfMonth } }
    })

    return {
      success: true,
      totalUsers,
      staffCount,
      clientCount: totalClients,
      particulierCount,
      entrepriseCount,
      usersThisMonth,
      lastNineUsers,
    }
  } catch (error) {
    console.error("Failed to fetch user stats:", error)
    return {
      success: false,
      totalUsers: 0,
      staffCount: 0,
      clientCount: 0,
      particulierCount: 0,
      entrepriseCount: 0,
      usersThisMonth: 0,
      lastNineUsers: [],
    }
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
