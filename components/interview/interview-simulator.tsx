"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2 } from "lucide-react"

interface Interview {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  duration: number
  score?: number
  completed: boolean
}

interface InterviewSimulatorProps {
  interview: Interview
  onComplete: (score: number) => void
}

export function InterviewSimulator({ interview, onComplete }: InterviewSimulatorProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const questions = [
    {
      id: 1,
      text: "What is your experience with the technologies mentioned in the job description?",
      type: "open",
    },
    {
      id: 2,
      text: "Tell us about a challenging project you've worked on and how you solved it.",
      type: "open",
    },
    {
      id: 3,
      text: "How do you approach debugging and problem-solving?",
      type: "open",
    },
  ]

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value })
  }

  const handleSubmit = () => {
    const score = Math.round((Object.keys(answers).length / questions.length) * 100)
    setSubmitted(true)
    setTimeout(() => onComplete(score), 2000)
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

  if (submitted) {
    return (
      <Card className="border-border bg-card p-8 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Interview Completed!</h2>
        <p className="text-muted-foreground">Your responses have been recorded and analyzed.</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="border-border bg-card p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{interview.title}</h2>
                <div className="flex gap-2">
                  <Badge className={`border ${getDifficultyColor(interview.difficulty)}`}>{interview.difficulty}</Badge>
                  <Badge variant="secondary" className="bg-secondary/50 text-foreground border-border">
                    {interview.category}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="question" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="question">Question</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="question" className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
                <h3 className="text-xl font-semibold text-foreground mb-6">{questions[currentQuestion].text}</h3>
                <textarea
                  value={answers[currentQuestion] || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full h-32 p-3 bg-background border border-border text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex justify-between items-center">
                <Button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  variant="outline"
                >
                  Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                  {currentQuestion + 1}/{questions.length}
                </div>
                {currentQuestion === questions.length - 1 ? (
                  <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Submit
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Next
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-4">
              <div className="bg-secondary/20 border border-border p-4 rounded-lg">
                <p className="font-semibold text-foreground mb-2">Interview Tips:</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Speak clearly and confidently</li>
                  <li>Provide specific examples from your experience</li>
                  <li>Ask clarifying questions if needed</li>
                  <li>Show your problem-solving approach</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Progress Sidebar */}
      <div>
        <Card className="border-border bg-card p-4 sticky top-4">
          <h4 className="font-semibold text-foreground mb-4">Progress</h4>
          <div className="space-y-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  idx === currentQuestion
                    ? "bg-primary text-primary-foreground font-semibold"
                    : answers[idx]
                      ? "bg-green-500/10 text-foreground border border-green-500/20"
                      : "bg-secondary/20 text-muted-foreground hover:bg-secondary/40"
                }`}
              >
                Q{idx + 1}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
