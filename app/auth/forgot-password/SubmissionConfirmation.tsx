import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

interface SubmissionConfirmationProps {
  email: string
  onClose: () => void
}

export function SubmissionConfirmation({ email, onClose }: SubmissionConfirmationProps) {
  return (
    <Card className="w-full max-w-md p-6 space-y-6">
      <div className="flex justify-end">
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

        <h2 className="text-2xl font-semibold text-gray-900">Vérifiez votre e-mail</h2>

        <div className="space-y-2">
          <p className="text-gray-600">Un e-mail de réinitialisation a été envoyé à</p>
          <p className="font-medium text-gray-900">{email}</p>
          <p className="text-sm text-gray-500">Click on the link in the email to reset your password.</p>
        </div>

        <Button onClick={onClose} className="w-full bg-[#E55210] hover:bg-[#D44200] text-white">
          Revenir à la connexion
        </Button>
      </div>
    </Card>
  )
}

