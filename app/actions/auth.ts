'use server';

import { hash } from 'bcryptjs';
import { PrismaClient, Role, UserStatus } from '@prisma/client';
import { NextResponse } from "next/server"
import { sendVerificationEmail } from "@/lib/email"

const prisma = new PrismaClient();

export async function signUp(
  name: string,
  email: string,
  password: string,
  role: Role,
  status: UserStatus,
  emailVerified: Boolean
  
) {


  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json({ error: "Email already in use" }, { status: 400 })
  }

  const hashedPassword = await hash(password, 10);
  console.log('hashed the password');
  const verificationToken = crypto.randomUUID()
  
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      status,
      emailVerified,
      verificationToken 
      
    },
  });

  await sendVerificationEmail(email, verificationToken)


  return { success: true, user };
}