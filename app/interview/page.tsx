"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { InterviewList } from "@/components/interview/interview-list"
import { InterviewSimulator } from "@/components/interview/interview-simulator"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Interview {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  duration: number
  score?: number
  completed: boolean
}

export default function InterviewPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: "1",
      title: "Frontend Fundamentals",
      difficulty: "Easy",
      category: "React",
      duration: 30,
      completed: false,
    },
    {
      id: "2",
      title: "Backend API Design",
      difficulty: "Medium",
      category: "System Design",
      duration: 45,
      completed: false,
    },
    {
      id: "3",
      title: "Full Stack Challenge",
      difficulty: "Hard",
      category: "Full Stack",
      duration: 60,
      completed: false,
    },
    {
      id: "4",
      title: "Database Optimization",
      difficulty: "Hard",
      category: "Databases",
      duration: 45,
      score: 85,
      completed: true,
    },
  ])

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

  const handleCompleteInterview = (interviewId: string, score: number) => {
    setInterviews(interviews.map((i) => (i.id === interviewId ? { ...i, completed: true, score } : i)))
    setSelectedInterview(null)
  }

  if (loading) return null

  const stats = {
    total: interviews.length,
    completed: interviews.filter((i) => i.completed).length,
    avgScore:
      interviews.filter((i) => i.completed).length > 0
        ? Math.round(
            interviews.filter((i) => i.completed && i.score).reduce((sum, i) => sum + (i.score || 0), 0) /
              interviews.filter((i) => i.completed).length,
          )
        : 0,
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Interview Simulator</h1>
          <p className="text-muted-foreground">Practice with AI-powered mock interviews</p>
        </div>

        {selectedInterview ? (
          <div className="mb-6">
            <Button variant="ghost" onClick={() => setSelectedInterview(null)} className="mb-4">
              ← Back to Interviews
            </Button>
            <InterviewSimulator
              interview={selectedInterview}
              onComplete={(score) => handleCompleteInterview(selectedInterview.id, score)}
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-card border-border p-4">
                <div className="text-2xl font-bold text-primary mb-1">
                  {stats.completed}/{stats.total}
                </div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </Card>
              <Card className="bg-card border-border p-4">
                <div className="text-2xl font-bold text-green-500 mb-1">{stats.avgScore}%</div>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </Card>
              <Card className="bg-card border-border p-4">
                <div className="text-2xl font-bold text-blue-500 mb-1">
                  {interviews.filter((i) => !i.completed).length}
                </div>
                <p className="text-sm text-muted-foreground">Pending</p>
              </Card>
            </div>

            <InterviewList interviews={interviews} onSelectInterview={setSelectedInterview} />
          </>
        )}
      </main>
    </div>
  )
}
