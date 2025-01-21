"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Mail, KeyRound, Eye, EyeOff } from 'lucide-react'

export function LoginForm() {
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
        console.log(error);
        setError(error)
      } else {
        // Fetch user data to get the role
        const res = await fetch('/api/auth/session')
        const session = await res.json()
        const userRole = session.user.role.toLowerCase()
        router.push(`/${userRole}`)
      }
    } catch (error) {
      setError(error)
      console.error(Error)
    } finally {
      setIsLoading(false)
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
            <Link
              href="/auth/forgot-password"
              className="text-sm text-[#ff6b4a] hover:text-[#ff5a36]"
            >
              Mot de passe oublié ?
            </Link>
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
        disabled={isLoading}
        className="w-full h-11 border-gray-200 bg-white hover:bg-gray-50"
        onClick={() => signIn("google")}
      >
        <div className="flex items-center justify-center gap-3">
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path
              fill="currentColor"
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            />
          </svg>
          <span>Connexion avec Google</span>
        </div>
      </Button>
    </form>
  )
}