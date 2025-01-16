'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { EnvelopeIcon, BellIcon } from "@heroicons/react/24/outline"
import { ProfileDropdown } from './ProfileDropdown'

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  const { data: session } = useSession()

  return (
    <div>
      <header className="flex justify-between items-center pb-5">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <EnvelopeIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <BellIcon className="h-4 w-4" />
          </Button>
          {session?.user && (
            <ProfileDropdown user={session.user} />
          )}
        </div>
      </header>
      <hr />
    </div>
  )
}