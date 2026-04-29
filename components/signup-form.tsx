"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, User, Mail, KeyRound, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"
import CheckEmailPage from "@/app/auth/check-email/page"

interface SignupFormProps {
  onSwitchToLogin?: () => void
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [clientType, setClientType] = useState("PARTICULIER")
  const [error, setError] = useState("")
  const [signupSuccess, setSignupSuccess] = useState(false)
  const router = useRouter()

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  })

  // Validate password on change
  const validatePassword = (pwd: string) => {
    setPasswordValidation({
      minLength: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    validatePassword(newPassword)
  }

  const isPasswordValid = () => {
    return Object.values(passwordValidation).every(v => v === true)
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate password strength
    if (!isPasswordValid()) {
      setError("Veuillez entrer un mot de passe plus sécurisé")
      setIsLoading(false)
      return
    }

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
        setError(data.error || "Échec de l'inscription. Veuillez réessayer.")
      }
    } catch (error) {
      console.error(error)
      setError("Une erreur est survenue lors de l'inscription. Veuillez réessayer.")
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
              placeholder="Jean Dupont"
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
              placeholder="jean@mail.com"
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
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="clientType"
                checked={clientType === "PARTICULIER"}
                onChange={() => setClientType("PARTICULIER")}
                className="h-4 w-4 rounded-full border-gray-300 text-[#ff6b4a] focus:ring-[#ff6b4a]"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                PARTICULIER
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="clientType"
                checked={clientType === "ENTREPRISE"}
                onChange={() => setClientType("ENTREPRISE")}
                className="h-4 w-4 rounded-full border-gray-300 text-[#ff6b4a] focus:ring-[#ff6b4a]"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                ENTREPRISE
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-700 mb-1.5 block">Mot de passe</label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Votre mot de passe"
              className="h-11 pl-10 pr-10 border-gray-200"
              disabled={isLoading}
              value={password}
              onChange={handlePasswordChange}
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
          
          {/* Password validation requirements */}
          {password && (
            <div className="mt-2 space-y-1 text-xs">
              <div className={`flex items-center gap-1 ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                {passwordValidation.minLength ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                <span>Au moins 8 caractères</span>
              </div>
              <div className={`flex items-center gap-1 ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                {passwordValidation.hasUpperCase ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                <span>Au moins une lettre majuscule</span>
              </div>
              <div className={`flex items-center gap-1 ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                {passwordValidation.hasLowerCase ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                <span>Au moins une lettre minuscule</span>
              </div>
              <div className={`flex items-center gap-1 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                {passwordValidation.hasNumber ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                <span>Au moins un chiffre</span>
              </div>
              <div className={`flex items-center gap-1 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                {passwordValidation.hasSpecialChar ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                <span>Au moins un caractère spécial (!@#$%^&*)</span>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <label className="text-sm text-gray-700 mb-1.5 block">Confirmer le mot de passe</label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmez votre mot de passe"
              className="h-11 pl-10 pr-10 border-gray-200"
              disabled={isLoading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-red-500 text-xs mt-1">Les mots de passe ne correspondent pas</p>
          )}
        </div>
      </div>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      <Button
        type="submit"
        disabled={isLoading || (password !== "" && !isPasswordValid())}
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
          <span className="bg-white px-2 text-gray-500">Ou</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={isLoading}
        className="w-full h-11 border-gray-200 bg-white hover:bg-gray-50"
        onClick={onSwitchToLogin}
      >
        <div className="flex items-center justify-center gap-3">
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          <span>Déjà inscrit ? Se connecter</span>
        </div>
      </Button>
    </form>
  )
}