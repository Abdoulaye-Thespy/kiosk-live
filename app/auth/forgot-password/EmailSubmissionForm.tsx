import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, ArrowLeft, Loader2 } from "lucide-react"
import type React from "react" // Added import for React

interface EmailSubmissionFormProps {
  email: string
  setEmail: (email: string) => void
  isLoading: boolean
  error: string
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

export function EmailSubmissionForm({
  email,
  setEmail,
  isLoading,
  error,
  onSubmit,
  onClose,
}: EmailSubmissionFormProps) {
  return (
    <Card className="w-full max-w-md p-6 space-y-6">
      <div className="flex justify-between items-center">
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500 flex items-center">
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span className="text-sm">Retour</span>
        </button>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
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
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
          <Mail className="h-8 w-8 text-[#E55210]" />
        </div>

        <h2 className="text-2xl font-semibold text-gray-900">Mot de passe oublié?</h2>

        <p className="text-sm text-gray-500">
          Enter your email address and we'll send you instructions to reset your password.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={isLoading} className="w-full bg-[#E55210] hover:bg-[#D44200] text-white">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Instructions"
            )}
          </Button>
        </form>
      </div>
    </Card>
  )
}

