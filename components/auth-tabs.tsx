"use client"

import { useState } from "react"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"
import { Button } from "@/components/ui/button"
import AcmeLogo from "@/app/ui/acme-logo"
import Link from "next/link"

export function AuthTabs() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')

  return (
    <div className="w-full max-w-[400px] space-y-8">
      {/* Logo Section */}
      <Link className="mb-2 flex h-20 items-end justify-start rounded-md p-4" href="/">
        <div className="w-32 text-white md:w-50">
          <AcmeLogo />
        </div>
      </Link>
      
      {/* Header Text */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">
            {activeTab === 'login' ? 'Bienvenue sur KioskOnline' : 'Création de votre compte'}
          </h1>
          <p className="text-sm text-gray-500">
            {activeTab === 'login' 
              ? 'Content de vous revoir ! Connectez-vous à votre compte.'
              : 'Inscrivez vos informations et vos identifiants'}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 mb-6">
          <Button
            variant="outline"
            className={`flex-1 ${
              activeTab === 'login' 
                ? 'bg-white border-gray-200' 
                : 'bg-transparent border-transparent'
            } hover:bg-gray-50`}
            onClick={() => setActiveTab('login')}
          >
            Se connecter
          </Button>
          <Button
            variant="outline"
            className={`flex-1 ${
              activeTab === 'signup' 
                ? 'bg-white border-gray-200' 
                : 'bg-transparent border-transparent'
            } hover:bg-gray-50`}
            onClick={() => setActiveTab('signup')}
          >
            S'inscrire
          </Button>
        </div>
      </div>

      {/* Forms */}
      {activeTab === 'login' ? <LoginForm onSwitchToSignUp={() => setActiveTab('signup')} /> : <SignupForm onSwitchToLogin={() => setActiveTab('login')} />}

      {/* Footer */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>© 2024 Kiosk</span>
        <span>FR</span>
      </div>
    </div>
  )
}