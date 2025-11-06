"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Clock } from "lucide-react"

interface Interview {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  duration: number
  score?: number
  completed: boolean
}

interface InterviewListProps {
  interviews: Interview[]
  onSelectInterview: (interview: Interview) => void
}

export function InterviewList({ interviews, onSelectInterview }: InterviewListProps) {
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
      {interviews.map((interview) => (
        <Card
          key={interview.id}
          className="border-border bg-card hover:shadow-md transition-all p-4 flex items-center justify-between group"
        >
          <div className="flex items-center gap-4 flex-1">
            {interview.completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
            ) : (
              <Circle className="w-6 h-6 text-muted-foreground flex-shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {interview.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{interview.duration} min</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4 flex-shrink-0">
            {interview.completed && interview.score && (
              <div className="text-right">
                <div className="text-sm font-semibold text-green-500">{interview.score}%</div>
                <p className="text-xs text-muted-foreground">Score</p>
              </div>
            )}
            <Badge className={`border ${getDifficultyColor(interview.difficulty)}`}>{interview.difficulty}</Badge>
            <Badge variant="secondary" className="bg-secondary/50 text-foreground border-border hidden md:inline-block">
              {interview.category}
            </Badge>
            <Button
              size="sm"
              onClick={() => onSelectInterview(interview)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {interview.completed ? "Review" : "Start"}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
