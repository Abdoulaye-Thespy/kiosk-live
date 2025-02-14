"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { EmailSubmissionForm } from "./EmailSubmissionForm"
import { SubmissionConfirmation } from "./SubmissionConfirmation"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //React.FormEvent was missing HTMLFormElement
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Something went wrong")
      }

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return <SubmissionConfirmation email={email} onClose={() => router.push("/auth/signin")} />
  }

  return (
    <EmailSubmissionForm
      email={email}
      setEmail={setEmail}
      isLoading={isLoading}
      error={error}
      onSubmit={handleSubmit}
      onClose={() => router.push("/auth/signin")}
    />
  )
}

