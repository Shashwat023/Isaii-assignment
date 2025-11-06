import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Login | InterviewMaster",
  description: "Sign in to your InterviewMaster account",
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground mt-2">Sign in to continue your interview journey</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}

