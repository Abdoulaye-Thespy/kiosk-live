"use client"

import { useState } from "react"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"
import { Button } from "@/components/ui/button"

export function AuthTabs() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')

  return (
    <div className="w-full max-w-[400px] space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-[#ff6b4a]">
          <span className="font-medium">Kiosk</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">
            {activeTab === 'login' ? 'Bienvenue sur Kiosk' : 'Création de votre compte'}
          </h1>
          <p className="text-sm text-gray-500">
            {activeTab === 'login' 
              ? 'Content de vous revoir ! Connectez-vous à votre compte.'
              : 'Inscrivez vos informations et vos identifiants'}
          </p>
        </div>

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

      {activeTab === 'login' ? <LoginForm /> : <SignupForm />}

      <div className="flex justify-between text-xs text-gray-500">
        <span>© 2024 Kiosk</span>
        <span>FR</span>
      </div>
    </div>
  )
}

