"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, Loader2, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react"

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState("")
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
    // Clear confirm password error when password changes
    if (confirmPassword && newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
    } else if (confirmPassword && newPassword === confirmPassword) {
      setError("")
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value
    setConfirmPassword(newConfirmPassword)
    if (password && newConfirmPassword !== password) {
      setError("Les mots de passe ne correspondent pas")
    } else if (password && newConfirmPassword === password) {
      setError("")
    }
  }

  const isPasswordValid = () => {
    return Object.values(passwordValidation).every(v => v === true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isPasswordValid()) {
      setError("Veuillez entrer un mot de passe plus sécurisé")
      return
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    setStatus("loading")
    setError("")

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: params.token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue")
      }

      setStatus("success")
    } catch (err) {
      setStatus("error")
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    }
  }

  const getContent = () => {
    switch (status) {
      case "success":
        return {
          icon: (
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-[#E55210]" />
            </div>
          ),
          title: "Votre mot de passe a été changé avec succès",
          subtitle: "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
          showForm: false,
        }
      case "error":
        return {
          icon: (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          ),
          title: "Une erreur est survenue",
          subtitle: error,
          showForm: true,
        }
      default:
        return {
          icon: (
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Lock className="h-8 w-8 text-[#E55210]" />
            </div>
          ),
          title: "Réinitialiser le mot de passe",
          subtitle: "Entrez votre nouveau mot de passe ci-dessous.",
          showForm: true,
        }
    }
  }

  const content = getContent()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="flex justify-end">
          <button onClick={() => router.push("/auth/signin")} className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Fermer</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="text-center space-y-4">
          <div className="flex justify-center">{content.icon}</div>

          <h2 className="text-2xl font-semibold text-gray-900">{content.title}</h2>

          <p className="text-sm text-gray-500">{content.subtitle}</p>

          {content.showForm ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                {/* New Password Field */}
                <div>
                  <label className="text-sm text-gray-700 mb-1.5 block text-left">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrez votre nouveau mot de passe"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                      className="w-full pr-10"
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
                    <div className="mt-2 space-y-1 text-xs text-left">
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

                {/* Confirm Password Field */}
                <div>
                  <label className="text-sm text-gray-700 mb-1.5 block text-left">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirmez votre nouveau mot de passe"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      required
                      className="w-full pr-10"
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
                    <p className="text-red-500 text-xs mt-1 text-left">Les mots de passe ne correspondent pas</p>
                  )}
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                type="submit"
                disabled={status === "loading" || (password !== "" && !isPasswordValid())}
                className="w-full bg-[#E55210] hover:bg-[#D44200] text-white"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  "Réinitialiser le mot de passe"
                )}
              </Button>
            </form>
          ) : (
            <Button
              onClick={() => router.push("/auth/signin")}
              className="w-full bg-[#E55210] hover:bg-[#D44200] text-white"
            >
              Revenir à la connexion
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}