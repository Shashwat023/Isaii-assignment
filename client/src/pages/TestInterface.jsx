"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { updateTest } from "../store/testsSlice"
import Navbar from "../components/Navbar"

function TestInterface() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { tests } = useSelector((state) => state.tests)
  const test = tests.find((t) => t._id === id)

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(3600)
  const [answers, setAnswers] = useState({})

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const mockQuestions = [
    { id: "1", question: "What is 15% of 200?", options: ["20", "25", "30", "35"], correctAnswer: "30" },
    {
      id: "2",
      question: "Find the missing number: 2, 4, 8, 16, ?",
      options: ["24", "32", "40", "48"],
      correctAnswer: "32",
    },
    {
      id: "3",
      question: "If A speaks truth 70% of the time...",
      options: ["0.3", "0.5", "0.7", "0.9"],
      correctAnswer: "0.7",
    },
  ]

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer })
  }

  const handleSubmit = async () => {
    const correctCount = mockQuestions.filter((q) => answers[q.id] === q.correctAnswer).length
    const score = (correctCount / mockQuestions.length) * 100

    await dispatch(
      updateTest({
        id,
        data: {
          status: "completed",
          score,
          answers: Object.entries(answers).map(([qId, ans]) => ({ questionId: qId, selectedAnswer: ans })),
        },
      }),
    )

    navigate("/dashboard")
  }

  if (!test)
    return (
      <div className="bg-[var(--color-bg-primary)] min-h-screen flex items-center justify-center">
        <p>Loading test...</p>
      </div>
    )

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const question = mockQuestions[currentQuestion]

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Questions List */}
          <div className="lg:w-1/4">
            <div className="card sticky top-20">
              <h3 className="font-bold text-lg mb-4">Questions</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {mockQuestions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`w-full p-2 text-left rounded-lg transition ${
                      currentQuestion === idx
                        ? "bg-[var(--color-accent-purple)] text-white"
                        : answers[q.id]
                          ? "bg-[var(--color-success)] text-white"
                          : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]"
                    }`}
                  >
                    Q{idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question Panel */}
          <div className="lg:w-3/4">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  Question {currentQuestion + 1} of {mockQuestions.length}
                </h2>
                <div className="text-2xl font-mono text-gradient">{formatTime(timeLeft)}</div>
              </div>

              <h3 className="text-xl mb-6">{question.question}</h3>

              <div className="space-y-3 mb-8">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(question.id, option)}
                    className={`w-full p-4 text-left rounded-lg border transition ${
                      answers[question.id] === option
                        ? "border-[var(--color-accent-pink)] bg-[var(--color-accent-pink)] bg-opacity-20"
                        : "border-white/10 bg-[var(--color-bg-tertiary)] hover:border-white/20"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  className="btn-secondary"
                  disabled={currentQuestion === 0}
                >
                  Previous
                </button>
                {currentQuestion < mockQuestions.length - 1 ? (
                  <button onClick={() => setCurrentQuestion(currentQuestion + 1)} className="btn-primary">
                    Next
                  </button>
                ) : (
                  <button onClick={handleSubmit} className="btn-primary">
                    Submit Test
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TestInterface
