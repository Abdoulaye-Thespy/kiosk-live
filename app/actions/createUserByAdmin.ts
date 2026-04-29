"use server"

import bcrypt from "bcryptjs"  // Import as default
import { prisma } from "@/lib/prisma"
import { type Role, type UserStatus, type ClientType } from "@prisma/client"
import crypto from "crypto"
import { sendTemporaryPasswordEmail, sendVerificationEmail } from "@/lib/email"

export async function createUserByAdmin(formData: {
  name: string
  email: string
  phone: string
  role: string
  address: string
  status: string
  clientType: ClientType
}) {
  const { name, email, phone, role, address, status, clientType } = formData

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return { success: false, error: "Email already in use" }
    }

     const finalClientType = clientType || "STAFF"

    // Generate a random password
    const temporaryPassword = crypto.randomBytes(16).toString("hex")
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10)  // Use bcrypt.hash

    const verificationToken = crypto.randomUUID()

    console.log(formData)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role: role as Role,
        clientType: finalClientType as ClientType,  // Use the default if empty
        address,
        status: status as UserStatus,
        emailVerified: false,
        verificationToken,
      },
    })

    // Send email with temporary password and verification link
    await sendVerificationEmail(email, verificationToken)
    await sendTemporaryPasswordEmail(email, temporaryPassword)

    return {
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status },
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return { success: false, error: "An error occurred while creating the user" }
  }
}