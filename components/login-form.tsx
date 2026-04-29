"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Mail, KeyRound, Eye, EyeOff } from 'lucide-react'

interface LoginFormProps {
  onSwitchToSignUp?: () => void
}

export function LoginForm({ onSwitchToSignUp }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError("Email ou mot de passe incorrect")
      } else {
        // Small delay to ensure session is properly set
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Fetch user data to get the role with retry logic
        let retries = 0
        let session = null
        
        while (retries < 3 && !session) {
          const res = await fetch('/api/auth/session')
          session = await res.json()
          
          if (!session?.user) {
            await new Promise(resolve => setTimeout(resolve, 200))
            retries++
          }
        }
        
        if (session?.user?.role) {
          const userRole = session.user.role.toLowerCase()
          router.push(`/${userRole}`)
        } else {
          setError("Erreur lors de la récupération de votre session")
          setIsLoading(false)
        }
      }
    } catch (error) {
      setError("Une erreur est survenue. Veuillez réessayer.")
      console.error(error)
    } finally {
      // Only set loading false if we're not redirecting
      if (!error) {
        setIsLoading(false)
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-700 mb-1.5 block">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="email"
              placeholder="johndoe@mail.com"
              className="h-11 pl-10 border-gray-200"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-700 mb-1.5 block">
            Mot de passe
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Votre mot de passe"
              className="h-11 pl-10 pr-10 border-gray-200"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="mt-1">
            <button
              type="button"
              onClick={() => window.location.href = '/auth/forgot-password'}
              className="text-sm text-[#ff6b4a] hover:text-[#ff5a36]"
            >
              Mot de passe oublié ?
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}

      <Button 
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-[#ff6b4a] hover:bg-[#ff5a36] text-white font-medium"
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Se connecter
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-gray-500">
            Ou
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-11 border-gray-200 bg-white hover:bg-gray-50"
        onClick={onSwitchToSignUp}
      >
        <div className="flex items-center justify-center gap-3">
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <span>Créer un compte</span>
        </div>
      </Button>
    </form>
  )
}