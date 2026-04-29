import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"  // Import singleton, not new PrismaClient()
import bcrypt from "bcryptjs"  // Changed from 'bcrypt' to 'bcryptjs'
import crypto from "crypto"  // You were missing this import!
import { sendVerificationEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, clientType } = await req.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "Cet e-mail est déjà utilisé" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate verification token
    const verificationToken = crypto.randomUUID()

    // Send verification email
    await sendVerificationEmail(email, verificationToken)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CLIENT",
        status: "PENDING",
        emailVerified: false,
        verificationToken,
        clientType,
      },
    })

    // Don't return the password in the response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ 
      success: true, 
      message: "User created successfully",
      user: userWithoutPassword 
    }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "An error occurred during signup" }, { status: 500 })
  }
}