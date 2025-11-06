"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">InterviewMaster</h1>
          <p className="text-muted-foreground text-lg">Master technical interviews with confidence</p>
        </div>

        <div className="space-y-4 pt-8">
          <Button
            size="lg"
            onClick={() => router.push("/login")}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Log In
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.push("/signup")} className="w-full">
            Sign Up
          </Button>
        </div>

        <p className="text-sm text-muted-foreground pt-8">
          Join thousands of job seekers preparing for their dream roles
        </p>
      </div>
    </main>
  )
}
