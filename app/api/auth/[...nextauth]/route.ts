import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import prisma from '@/lib/prisma';

// Declare MyRole outside of authOptions to make it accessible across scopes
let MyRole: string | undefined;

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            throw new Error('Invalid email or password');
          }

          const isValidPassword = await compare(credentials.password, user.password);

          if (!isValidPassword) {
            throw new Error('Invalid email or password');
          }

          // Set MyRole during authorization
          MyRole = user.role;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('Authorize error:', error);
          throw new Error('Invalid email or password');
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        // Update MyRole in jwt callback as well
        MyRole = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        // Update MyRole in session callback
        MyRole = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
  },
};


export { authOptions };
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };