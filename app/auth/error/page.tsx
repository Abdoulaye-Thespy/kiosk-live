import ErrorContent from "./error-content"
import { Suspense } from "react"

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  )
}

