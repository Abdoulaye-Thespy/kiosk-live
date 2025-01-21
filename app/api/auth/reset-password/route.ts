import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    })

    return NextResponse.json({ message: "Password has been reset successfully" })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ error: "An error occurred while resetting your password" }, { status: 500 })
  }
}

