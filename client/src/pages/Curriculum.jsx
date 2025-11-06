"use client"

import { useState } from "react"
import Navbar from "../components/Navbar"

function Curriculum() {
  const [expandedTopics, setExpandedTopics] = useState({})

  const curriculum = [
    {
      title: "Arrays & Hashing",
      progress: 5,
      total: 8,
      subtopics: ["Two Sum", "Valid Anagram", "Group Anagrams"],
    },
    {
      title: "Linked Lists",
      progress: 3,
      total: 7,
      subtopics: ["Reverse List", "Merge Sorted Lists", "Cycle Detection"],
    },
    {
      title: "Trees & Graphs",
      progress: 2,
      total: 10,
      subtopics: ["Binary Search Tree", "BFS/DFS", "Topological Sort"],
    },
    {
      title: "Dynamic Programming",
      progress: 1,
      total: 12,
      subtopics: ["Fibonacci", "Coin Change", "Longest Substring"],
    },
    {
      title: "System Design Basics",
      progress: 0,
      total: 5,
      subtopics: ["Scalability", "Load Balancing", "Caching"],
    },
  ]

  const toggleTopic = (idx) => {
    setExpandedTopics({ ...expandedTopics, [idx]: !expandedTopics[idx] })
  }

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Course Curriculum</h1>
          <p className="text-[var(--color-text-secondary)]">Master DSA topics for placement success</p>
        </div>

        <div className="space-y-4">
          {curriculum.map((topic, idx) => (
            <div key={idx} className="card">
              <button onClick={() => toggleTopic(idx)} className="w-full text-left">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{topic.title}</h3>
                    <div className="w-full bg-[var(--color-bg-tertiary)] rounded-full h-2">
                      <div
                        className="bg-gradient-accent h-2 rounded-full transition-all"
                        style={{ width: `${(topic.progress / topic.total) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                      {topic.progress} of {topic.total} completed
                    </p>
                  </div>
                  <span className="text-2xl ml-4">{expandedTopics[idx] ? "−" : "+"}</span>
                </div>
              </button>

              {expandedTopics[idx] && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="space-y-3">
                    {topic.subtopics.map((subtopic, sidx) => (
                      <div
                        key={sidx}
                        className="flex items-center justify-between bg-[var(--color-bg-tertiary)] p-4 rounded-lg"
                      >
                        <span>{subtopic}</span>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-[var(--color-accent-purple)]/20 text-[var(--color-accent-purple)] text-xs rounded">
                            Medium
                          </span>
                          <button className="btn-primary text-xs">Watch Video</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Curriculum
