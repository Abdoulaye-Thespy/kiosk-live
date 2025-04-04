"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, User, Mail, KeyRound, Eye, EyeOff } from "lucide-react"
import CheckEmailPage from "@/app/auth/check-email/page"

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [clientType, setClientType] = useState("PARTICULIER")
  const [error, setError] = useState("")
  const [signupSuccess, setSignupSuccess] = useState(false)
  const router = useRouter()

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, clientType }),
      })

      const data = await response.json()

      if (response.ok) {
        setSignupSuccess(true)
      } else {
        setError(data.error || "Failed to sign up. Please try again.")
      }
    } catch (error) {
      console.error(error)
      setError("An error occurred during signup. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  function handleConfirmation() {
    window.location.reload()
  }

  if (signupSuccess) {
    return (
      <div className="">
        <CheckEmailPage />
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-700 mb-1.5 block">Nom complet</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="John Doe"
              className="h-11 pl-10 border-gray-200"
              disabled={isLoading}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-700 mb-1.5 block">Email</label>
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

        {/* Client Type Selection */}
        <div>
          <label className="text-sm text-gray-700 mb-1.5 block">Type de client</label>
          <div className="flex gap-6 mt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="particulier"
                checked={clientType === "PARTICULIER"}
                onChange={() => setClientType("PARTICULIER")}
                className="h-4 w-4 rounded border-gray-300 text-[#ff6b4a] focus:ring-[#ff6b4a]"
              />
              <label htmlFor="particulier" className="ml-2 text-sm font-medium text-gray-700">
                PARTICULIER
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="entreprise"
                checked={clientType === "ENTREPRISE"}
                onChange={() => setClientType("ENTREPRISE")}
                className="h-4 w-4 rounded border-gray-300 text-[#ff6b4a] focus:ring-[#ff6b4a]"
              />
              <label htmlFor="entreprise" className="ml-2 text-sm font-medium text-gray-700">
                ENTREPRISE
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-700 mb-1.5 block">Mot de passe</label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
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
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <div className="mt-1">
            <span className="text-sm text-gray-500">Minimum 8 caractères</span>
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-700 mb-1.5 block">Confirmer le mot de passe</label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your password"
              className="h-11 pl-10 pr-10 border-gray-200"
              disabled={isLoading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {error && <div className="text-red-500 text-md mt-2">{error}</div>}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-[#ff6b4a] hover:bg-[#ff5a36] text-white font-medium"
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Créer un compte
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-gray-500">Or</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={isLoading}
        className="w-full h-11 border-gray-200 bg-white hover:bg-gray-50"
      >
        <div className="flex items-center justify-center gap-3">
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path
              fill="currentColor"
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            />
          </svg>
          <span>Sign Up with Google</span>
        </div>
      </Button>
    </form>
  )
}

