"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { createTest } from "../store/testsSlice"
import Navbar from "../components/Navbar"

function PracticeRounds() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [selectedDifficulty, setSelectedDifficulty] = useState({})

  const rounds = [
    { id: "aptitude", name: "Aptitude Round", description: "Test your quantitative and reasoning skills" },
    { id: "coding", name: "Coding Round", description: "Solve programming challenges" },
    { id: "hr", name: "HR & Behavioral Round", description: "Prepare for HR and behavioral interviews" },
  ]

  const handleStartPractice = async (roundId) => {
    const difficulty = selectedDifficulty[roundId] || "medium"
    const result = await dispatch(
      createTest({
        type: roundId,
        difficulty,
        title: `${roundId} - ${difficulty}`,
        totalQuestions: 20,
        status: "in-progress",
      }),
    )
    if (result.payload?._id) {
      navigate(`/test/${result.payload._id}`)
    }
  }

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Practice Rounds</h1>
          <p className="text-[var(--color-text-secondary)]">Choose a round and difficulty level to start practicing</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rounds.map((round) => (
            <div key={round.id} className="card">
              <h3 className="text-2xl font-bold mb-2">{round.name}</h3>
              <p className="text-[var(--color-text-secondary)] mb-6">{round.description}</p>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select Difficulty</label>
                <select
                  value={selectedDifficulty[round.id] || "medium"}
                  onChange={(e) => setSelectedDifficulty({ ...selectedDifficulty, [round.id]: e.target.value })}
                  className="w-full bg-[var(--color-bg-tertiary)] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-accent-pink)]"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <button onClick={() => handleStartPractice(round.id)} className="btn-primary w-full">
                Start Practice
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default PracticeRounds
