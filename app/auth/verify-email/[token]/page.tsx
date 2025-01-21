"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function VerifyEmailPage({ params }: { params: { token: string } }) {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${params.token}`)
        const data = await response.json()

        if (response.ok) {
          setStatus("success")
          setMessage("Votre e-mail a été vérifié avec succès")
        } else {
          setStatus("error")
          setMessage(data.error || "Une erreur est survenue lors de la vérification")
        }
      } catch (error) {
        setStatus("error")
        setMessage("Une erreur est survenue lors de la vérification")
      }
    }

    verifyEmail()
  }, [params.token])

  const getContent = () => {
    switch (status) {
      case "loading":
        return {
          icon: <Loader2 className="h-8 w-8 animate-spin text-[#E55210]" />,
          title: "Vérification en cours",
          subtitle: "Please wait while we verify your email...",
        }
      case "success":
        return {
          icon: (
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-[#E55210]" />
            </div>
          ),
          title: message,
          subtitle: "Awesome. You can now sign in to your account.",
        }
      case "error":
        return {
          icon: (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          ),
          title: message,
          subtitle: "Please try again or contact support if the problem persists.",
        }
    }
  }

  const content = getContent()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="flex justify-end">
          <button className="text-gray-400 hover:text-gray-500">
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

          {status !== "loading" && (
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

