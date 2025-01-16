import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  console.log(token);

  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Add role to the request headers for use in protected routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-role', token.role as string)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ['/admin/:path*', '/client/:path*', '/responsable/:path*' , '/juridique/:path',  '/comptable/:path*', '/commercial/:path*', '/technicien/:path*', ],
}