"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

const ErrorContent = () => {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  let errorMessage = "An unknown error occurred."
  if (error === "CredentialsSignin") {
    errorMessage = "Invalid email or password."
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertCircle className="mr-2" />
            Authentication Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{errorMessage}</p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <a href="/auth/signin">Back to Sign In</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ErrorContent

