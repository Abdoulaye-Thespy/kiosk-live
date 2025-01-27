"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, Loader2, CheckCircle, XCircle } from "lucide-react"

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
        throw new Error(data.error || "Something went wrong")
      }

      setStatus("success")
    } catch (err) {
      setStatus("error")
      setError(err instanceof Error ? err.message : "An error occurred")
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
          subtitle: "You can now sign in with your new password.",
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
          subtitle: "Enter your new password below.",
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
            <span className="sr-only">Close</span>
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
                <Input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[#E55210] hover:bg-[#D44200] text-white"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Reset Password"
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

