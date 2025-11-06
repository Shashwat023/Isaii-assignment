import { SignupForm } from "@/components/auth/signup-form"

export const metadata = {
  title: "Sign Up | InterviewMaster",
  description: "Create a new InterviewMaster account",
}

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Get Started</h1>
          <p className="text-muted-foreground mt-2">Create an account to begin your interview journey</p>
        </div>
        <SignupForm />
      </div>
    </main>
  )
}
