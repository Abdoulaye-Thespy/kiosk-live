'use server';

import { hash } from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function signUp(
  name: string,
  email: string,
  password: string,
  role: 'USER' | 'CLIENT' | 'ADMIN',
  status: string
) {
  const hashedPassword = await hash(password, 10);

  console.log('hashed the password');
  
  const user = await prisma.user.create({
    data: {
      name,
      email,
      status,
      password: hashedPassword,
      role,
    },
  });

  return { success: true, user };
}