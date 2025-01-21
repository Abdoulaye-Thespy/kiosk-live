"use server"

import { hash } from "bcrypt"
import { PrismaClient, type Role, type UserStatus } from "@prisma/client"
import { sendVerificationEmail } from "@/lib/email"

const prisma = new PrismaClient()

export async function signUp(
  name: string,
  email: string,
  password: string,
  role: Role,
  status: UserStatus,
  emailVerified: boolean,
) {
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return { success: false, error: "Email already in use" }
  }

  const hashedPassword = await hash(password, 10)
  console.log("hashed the password")
  const verificationToken = crypto.randomUUID()

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      status,
      emailVerified,
      verificationToken,
    },
  })

  await sendVerificationEmail(email, verificationToken)

  return { success: true, user }
}

