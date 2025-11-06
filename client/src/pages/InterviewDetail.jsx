"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import Navbar from "../components/Navbar"

function InterviewDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { interviews } = useSelector((state) => state.interviews)
  const interview = interviews.find((i) => i._id === id)
  const [activeTab, setActiveTab] = useState("topics")

  if (!interview)
    return (
      <div className="bg-[var(--color-bg-primary)] min-h-screen flex items-center justify-center">
        <p>Interview not found</p>
      </div>
    )

  const mockTopics = ["Arrays", "Linked Lists", "Trees", "Dynamic Programming", "System Design"]
  const mockQuestions = [
    { q: "Reverse a linked list", difficulty: "Medium" },
    { q: "LRU Cache implementation", difficulty: "Hard" },
    { q: "Merge K sorted lists", difficulty: "Hard" },
  ]

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate("/interviews")}
          className="text-[var(--color-accent-pink)] mb-6 hover:text-[var(--color-accent-purple)]"
        >
          ← Back to Interviews
        </button>

        <div className="card mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{interview.company}</h1>
              <p className="text-xl text-[var(--color-text-secondary)]">{interview.role}</p>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <p className="text-2xl font-bold text-gradient">{interview.package} LPA</p>
              <p className="text-[var(--color-text-secondary)]">{new Date(interview.date).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            <button className="btn-primary">Start Full Mock</button>
            <button onClick={() => navigate("/practice")} className="btn-primary">
              Practice Rounds
            </button>
            <button className="btn-secondary">Add Note</button>
          </div>
        </div>

        <div className="card">
          <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
            <button
              onClick={() => setActiveTab("topics")}
              className={`px-4 py-2 font-medium ${activeTab === "topics" ? "text-[var(--color-accent-pink)] border-b-2 border-[var(--color-accent-pink)]" : "text-[var(--color-text-secondary)]"}`}
            >
              Topics Required
            </button>
            <button
              onClick={() => setActiveTab("questions")}
              className={`px-4 py-2 font-medium ${activeTab === "questions" ? "text-[var(--color-accent-pink)] border-b-2 border-[var(--color-accent-pink)]" : "text-[var(--color-text-secondary)]"}`}
            >
              Past Questions
            </button>
            <button
              onClick={() => setActiveTab("tips")}
              className={`px-4 py-2 font-medium ${activeTab === "tips" ? "text-[var(--color-accent-pink)] border-b-2 border-[var(--color-accent-pink)]" : "text-[var(--color-text-secondary)]"}`}
            >
              Tips
            </button>
          </div>

          {activeTab === "topics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockTopics.map((topic, idx) => (
                <div
                  key={idx}
                  className="bg-[var(--color-bg-tertiary)] p-4 rounded-lg flex justify-between items-center"
                >
                  <span>{topic}</span>
                  <span className="px-2 py-1 bg-[var(--color-accent-purple)]/20 text-[var(--color-accent-purple)] text-xs rounded">
                    Core
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "questions" && (
            <div className="space-y-4">
              {mockQuestions.map((q, idx) => (
                <div key={idx} className="bg-[var(--color-bg-tertiary)] p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <p>{q.q}</p>
                    <span
                      className={`px-2 py-1 text-xs rounded font-bold ${q.difficulty === "Hard" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}`}
                    >
                      {q.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "tips" && (
            <div className="space-y-4">
              <p>Focus on data structures and algorithms fundamentals.</p>
              <p>Practice mock interviews to build confidence.</p>
              <p>Review past interview questions and prepare clear explanations.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default InterviewDetail
