"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProblemList } from "@/components/practice/problem-list"
import { ProblemDetail } from "@/components/practice/problem-detail"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Problem {
  id: string
  title: string
  description: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  examples: Array<{ input: string; output: string }>
  solved: boolean
}

export default function PracticePage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)
  const [problems, setProblems] = useState<Problem[]>([
    {
      id: "1",
      title: "Two Sum",
      description:
        "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.",
      difficulty: "Easy",
      category: "Array",
      examples: [
        { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
        { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
      ],
      solved: false,
    },
    {
      id: "2",
      title: "Longest Substring Without Repeating Characters",
      description: "Given a string s, find the length of the longest substring without repeating characters.",
      difficulty: "Medium",
      category: "String",
      examples: [
        { input: 's = "abcabcbb"', output: "3" },
        { input: 's = "bbbbb"', output: "1" },
      ],
      solved: false,
    },
    {
      id: "3",
      title: "Binary Tree Level Order Traversal",
      description: "Given the root of a binary tree, return the level order traversal of its nodes' values.",
      difficulty: "Medium",
      category: "Tree",
      examples: [{ input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" }],
      solved: false,
    },
    {
      id: "4",
      title: "Regular Expression Matching",
      description:
        "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*'.",
      difficulty: "Hard",
      category: "Dynamic Programming",
      examples: [
        { input: 's = "aa", p = "a"', output: "false" },
        { input: 's = "aa", p = "a*"', output: "true" },
      ],
      solved: false,
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

  const handleSolveProblem = (problemId: string) => {
    setProblems(problems.map((p) => (p.id === problemId ? { ...p, solved: true } : p)))
    setSelectedProblem(null)
  }

  if (loading) return null

  const stats = {
    total: problems.length,
    solved: problems.filter((p) => p.solved).length,
    easy: problems.filter((p) => p.difficulty === "Easy").length,
    medium: problems.filter((p) => p.difficulty === "Medium").length,
    hard: problems.filter((p) => p.difficulty === "Hard").length,
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Practice Rounds</h1>
          <p className="text-muted-foreground">Master DSA fundamentals with coding challenges</p>
        </div>

        {selectedProblem ? (
          <div className="mb-6">
            <Button variant="ghost" onClick={() => setSelectedProblem(null)} className="mb-4">
              ← Back to Problems
            </Button>
            <ProblemDetail problem={selectedProblem} onSolve={() => handleSolveProblem(selectedProblem.id)} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <Card className="bg-card border-border p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {stats.solved}/{stats.total}
                </div>
                <p className="text-xs text-muted-foreground">Solved</p>
              </Card>
              <Card className="bg-card border-border p-4 text-center">
                <div className="text-2xl font-bold text-blue-500">{stats.easy}</div>
                <p className="text-xs text-muted-foreground">Easy</p>
              </Card>
              <Card className="bg-card border-border p-4 text-center">
                <div className="text-2xl font-bold text-yellow-500">{stats.medium}</div>
                <p className="text-xs text-muted-foreground">Medium</p>
              </Card>
              <Card className="bg-card border-border p-4 text-center">
                <div className="text-2xl font-bold text-red-500">{stats.hard}</div>
                <p className="text-xs text-muted-foreground">Hard</p>
              </Card>
              <Card className="bg-card border-border p-4 text-center">
                <div className="text-2xl font-bold text-green-500">
                  {stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">Success</p>
              </Card>
            </div>

            <ProblemList problems={problems} onSelectProblem={setSelectedProblem} />
          </>
        )}
      </main>
    </div>
  )
}
