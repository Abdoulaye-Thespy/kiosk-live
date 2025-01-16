'use client'

import React, { ComponentType, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'

interface WithRoleProps {
  children: React.ReactNode
}

export function withRole<P extends WithRoleProps>(
  WrappedComponent: ComponentType<P>,
  requiredRoles: string[]
) {
  return function WithRoleComponent(props: P) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
      if (status === 'loading') return

      if (status === 'unauthenticated') {
        router.push(`/auth/signin?callbackUrl=${pathname}`)
      } else if (status === 'authenticated' && session?.user?.role) {
        if (!requiredRoles.includes(session.user.role)) {
          router.push('/unauthorized')
        }
      }
    }, [status, session, router, pathname])

    if (status === 'loading') {
      return <div>Loading...</div>
    }

    if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role && !requiredRoles.includes(session.user.role))) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}