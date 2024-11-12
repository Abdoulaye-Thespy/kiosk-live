import React from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EnvelopeIcon, BellIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline"

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  return (
      <div>
      <header className="flex justify-between items-center pb-5">
        <h1 className="text-2xl font-bold">{ title }</h1>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <EnvelopeIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <BellIcon className="h-4 w-4" />
          </Button>
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon">
            <EllipsisHorizontalIcon className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <hr />
      </div>

  )
}