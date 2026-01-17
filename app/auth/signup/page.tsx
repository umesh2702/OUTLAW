import { Suspense } from "react"
import AuthLayout from "@/components/auth/auth-layout"
import SignupForm from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthLayout>
        <SignupForm />
      </AuthLayout>
    </Suspense>
  )
}
