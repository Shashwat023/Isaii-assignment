"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ResumeList } from "@/components/resume/resume-list"
import { ResumeBuilder } from "@/components/resume/resume-builder"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"

interface Resume {
  id: string
  title: string
  headline: string
  createdAt: string
  updatedAt: string
}

export default function ResumePage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBuilder, setShowBuilder] = useState(false)
  const [resumes, setResumes] = useState<Resume[]>([
    {
      id: "1",
      title: "Software Engineer Resume",
      headline: "Senior Full Stack Developer | React & Node.js Expert",
      createdAt: "2024-01-15",
      updatedAt: "2024-11-01",
    },
    {
      id: "2",
      title: "Frontend Developer Resume",
      headline: "Frontend Specialist | React, TypeScript, Tailwind CSS",
      createdAt: "2024-02-10",
      updatedAt: "2024-10-28",
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

  const handleCreateResume = (resumeData: Omit<Resume, "id" | "createdAt" | "updatedAt">) => {
    const newResume: Resume = {
      ...resumeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setResumes([...resumes, newResume])
    setShowBuilder(false)
  }

  const handleDeleteResume = (id: string) => {
    setResumes(resumes.filter((r) => r.id !== id))
  }

  if (loading) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Resume Management</h1>
            <p className="text-muted-foreground">Create and manage your professional resumes</p>
          </div>
          <Button
            onClick={() => setShowBuilder(!showBuilder)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Resume
          </Button>
        </div>

        {showBuilder && <ResumeBuilder onSave={handleCreateResume} onCancel={() => setShowBuilder(false)} />}

        <ResumeList resumes={resumes} onDelete={handleDeleteResume} />
      </main>
    </div>
  )
}
