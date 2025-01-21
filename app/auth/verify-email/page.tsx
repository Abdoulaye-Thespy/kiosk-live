import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function VerifyEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">
            We've sent a verification email to your inbox. Please check your email and click on the verification link to
            complete your registration.
          </p>
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

