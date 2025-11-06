"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchInterviews } from "../store/interviewsSlice"
import { fetchReport } from "../store/reportsSlice"
import Navbar from "../components/Navbar"

function Dashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { interviews } = useSelector((state) => state.interviews)
  const { report } = useSelector((state) => state.reports)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchInterviews())
    dispatch(fetchReport())
  }, [dispatch])

  const upcomingInterviews = interviews.filter((i) => i.status === "upcoming")
  const completedTests = 5
  const averageScore = report?.averageScore || 0

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-[var(--color-text-secondary)]">Your placement preparation dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="card">
            <p className="text-[var(--color-text-secondary)] text-sm mb-2">Upcoming Interviews</p>
            <p className="text-3xl font-bold">{upcomingInterviews.length}</p>
          </div>
          <div className="card">
            <p className="text-[var(--color-text-secondary)] text-sm mb-2">Tests Completed</p>
            <p className="text-3xl font-bold">{completedTests}</p>
          </div>
          <div className="card">
            <p className="text-[var(--color-text-secondary)] text-sm mb-2">Average Score</p>
            <p className="text-3xl font-bold text-gradient">{averageScore.toFixed(0)}%</p>
          </div>
          <div className="card">
            <p className="text-[var(--color-text-secondary)] text-sm mb-2">Percentile</p>
            <p className="text-3xl font-bold text-gradient">{report?.percentile || 0}th</p>
          </div>
        </div>

        {/* Recent Interviews */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Interviews</h2>
            <button onClick={() => navigate("/interviews")} className="btn-primary">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingInterviews.slice(0, 3).map((interview) => (
              <div key={interview._id} className="card hover:border-[var(--color-accent-pink)] transition">
                <h3 className="font-bold text-lg mb-2">{interview.company}</h3>
                <p className="text-[var(--color-text-secondary)] text-sm mb-4">{interview.role}</p>
                <p className="text-sm mb-4">
                  <strong>Package:</strong> ${interview.package}K
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                  {new Date(interview.date).toLocaleDateString()}
                </p>
                <button onClick={() => navigate(`/interview/${interview._id}`)} className="btn-primary w-full text-sm">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => navigate("/practice")}
              className="card hover:border-[var(--color-accent-pink)] transition p-8 text-center"
            >
              <h3 className="text-xl font-bold mb-2">Start Practice Round</h3>
              <p className="text-[var(--color-text-secondary)]">Practice aptitude, coding, and HR rounds</p>
            </button>
            <button
              onClick={() => navigate("/resume")}
              className="card hover:border-[var(--color-accent-pink)] transition p-8 text-center"
            >
              <h3 className="text-xl font-bold mb-2">Manage Resume</h3>
              <p className="text-[var(--color-text-secondary)]">Upload and optimize your resume</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
