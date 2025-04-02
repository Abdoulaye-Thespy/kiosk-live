"use server"

import { hash } from "bcrypt"
import { PrismaClient, type Role, type UserStatus, type ClientType } from "@prisma/client"
import crypto from "crypto"
import { sendTemporaryPasswordEmail, sendVerificationEmail } from "@/lib/email"

const prisma = new PrismaClient()

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

    // Generate a random password
    const password = crypto.randomBytes(16).toString("hex")
    const hashedPassword = await hash(password, 10)

    const verificationToken = crypto.randomUUID()

    console.log(formData)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role: role as Role,
        clientType,
        address,
        status: status as UserStatus,
        emailVerified: false,
        verificationToken,
      },
    })


    // Send email with temporary password and verification link
    await sendVerificationEmail(email, verificationToken);
    await sendTemporaryPasswordEmail(email, password);

    return {
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status },
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return { success: false, error: "An error occurred while creating the user" }
  }
}

