"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2 } from "lucide-react"

interface Problem {
  id: string
  title: string
  description: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  examples: Array<{ input: string; output: string }>
  solved: boolean
}

interface ProblemDetailProps {
  problem: Problem
  onSolve: () => void
}

export function ProblemDetail({ problem, onSolve }: ProblemDetailProps) {
  const [code, setCode] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (code.trim()) {
      setSubmitted(true)
      onSolve()
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "Medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "Hard":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Problem Description */}
      <Card className="border-border bg-card p-6">
        <div className="mb-4">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h2 className="text-2xl font-bold text-foreground">{problem.title}</h2>
            {problem.solved && <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />}
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge className={`border ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</Badge>
            <Badge variant="secondary" className="bg-secondary/50 text-foreground border-border">
              {problem.category}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
            <div className="bg-secondary/20 border border-border p-4 rounded-lg">
              <p className="text-sm font-semibold text-foreground mb-2">Constraints:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>
                  1 {"<="} n {"<="} 10^5
                </li>
                <li>
                  -10^9 {"<="} nums[i] {"<="} 10^9
                </li>
                <li>Each input has exactly one solution</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="space-y-4">
            {problem.examples.map((example, idx) => (
              <div key={idx} className="bg-secondary/20 border border-border p-4 rounded-lg space-y-2">
                <p className="text-sm font-semibold text-foreground">Example {idx + 1}:</p>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Input:</p>
                  <p className="font-mono text-sm bg-background p-2 rounded border border-border text-foreground">
                    {example.input}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Output:</p>
                  <p className="font-mono text-sm bg-background p-2 rounded border border-border text-foreground">
                    {example.output}
                  </p>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </Card>

      {/* Code Editor */}
      <Card className="border-border bg-card p-6 flex flex-col">
        <h3 className="text-lg font-semibold text-foreground mb-4">Solution</h3>

        <div className="flex-1 flex flex-col">
          <Textarea
            placeholder="// Write your solution here
// Example: function twoSum(nums, target) { ... }"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 font-mono text-sm bg-background border-border text-foreground resize-none rounded-lg mb-4 p-3"
            rows={15}
          />

          <div className="space-y-2">
            <Button
              onClick={handleSubmit}
              disabled={!code.trim()}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {submitted ? "✓ Submitted!" : "Submit Solution"}
            </Button>
            <Button
              variant="outline"
              className="w-full border-border text-foreground hover:bg-secondary bg-transparent"
            >
              Run Code
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
