"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle } from "lucide-react"

interface Problem {
  id: string
  title: string
  description: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  solved: boolean
}

interface ProblemListProps {
  problems: Problem[]
  onSelectProblem: (problem: Problem) => void
}

export function ProblemList({ problems, onSelectProblem }: ProblemListProps) {
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
    <div className="space-y-3">
      {problems.map((problem) => (
        <Card
          key={problem.id}
          className="border-border bg-card hover:shadow-md transition-all p-4 flex items-center justify-between group cursor-pointer"
          onClick={() => onSelectProblem(problem)}
        >
          <div className="flex items-center gap-4 flex-1">
            {problem.solved ? (
              <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
            ) : (
              <Circle className="w-6 h-6 text-muted-foreground flex-shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {problem.title}
              </h3>
              <p className="text-sm text-muted-foreground truncate">{problem.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4 flex-shrink-0">
            <Badge variant="secondary" className="bg-secondary/50 text-foreground border-border">
              {problem.category}
            </Badge>
            <Badge className={`border ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</Badge>
          </div>
        </Card>
      ))}
    </div>
  )
}
