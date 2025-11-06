"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { BookOpen, FileText, Mic, BarChart3 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { FeatureCard } from "@/components/dashboard/feature-card"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(storedUser))
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  if (loading) return null

  const features = [
    {
      title: "Practice Rounds",
      description: "Solve coding challenges and brush up on DSA fundamentals",
      icon: BookOpen,
      href: "/practice",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Resume Builder",
      description: "Create and manage your professional resume",
      icon: FileText,
      href: "/resume",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Interview Simulator",
      description: "Practice with AI-powered mock interviews",
      icon: Mic,
      href: "/interview",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Performance Reports",
      description: "Track your progress and analyze performance",
      icon: BarChart3,
      href: "/reports",
      color: "from-orange-500 to-orange-600",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome, {user?.name}!</h1>
          <p className="text-muted-foreground text-lg">
            Choose a feature to continue your interview preparation journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature) => (
            <FeatureCard key={feature.href} {...feature} />
          ))}
        </div>

        <Card className="bg-card border-border p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Quick Stats</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">0</div>
              <p className="text-sm text-muted-foreground">Problems Solved</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">0</div>
              <p className="text-sm text-muted-foreground">Interviews Done</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">0%</div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
