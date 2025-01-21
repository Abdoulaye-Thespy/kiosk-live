import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"
import { sendPasswordResetEmail } from "@/lib/email"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Return success even if user doesn't exist for security
      return NextResponse.json({ message: "If an account exists, a password reset email has been sent." })
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour
      },
    })

    await sendPasswordResetEmail(user.email, resetToken)

    return NextResponse.json({ message: "Password reset email sent" })
  } catch (error) {
    console.error("Password reset request error:", error)
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}

