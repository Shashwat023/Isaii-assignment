"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchReport } from "../store/reportsSlice"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Navbar from "../components/Navbar"

function Reports() {
  const dispatch = useDispatch()
  const { report, loading } = useSelector((state) => state.reports)

  useEffect(() => {
    dispatch(fetchReport())
  }, [dispatch])

  if (loading)
    return (
      <div className="bg-[var(--color-bg-primary)] min-h-screen flex items-center justify-center">
        <p>Loading report...</p>
      </div>
    )

  if (!report)
    return (
      <div className="bg-[var(--color-bg-primary)] min-h-screen flex items-center justify-center">
        <p>No report available</p>
      </div>
    )

  const categoryData = Object.entries(report.categoryScores || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))
  const COLORS = ["#ec4899", "#a855f7", "#06b6d4"]

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Performance Report</h1>
          <p className="text-[var(--color-text-secondary)]">Your placement preparation analytics</p>
        </div>

        {/* Score Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="card">
            <p className="text-[var(--color-text-secondary)] text-sm mb-2">Overall Score</p>
            <p className="text-4xl font-bold text-gradient">{report.overallScore?.toFixed(0) || 0}</p>
          </div>
          <div className="card">
            <p className="text-[var(--color-text-secondary)] text-sm mb-2">Percentile</p>
            <p className="text-4xl font-bold text-gradient">{report.percentile}th</p>
          </div>
          <div className="card">
            <p className="text-[var(--color-text-secondary)] text-sm mb-2">Tests Taken</p>
            <p className="text-4xl font-bold">{report.testsTaken}</p>
          </div>
          <div className="card">
            <p className="text-[var(--color-text-secondary)] text-sm mb-2">Average Score</p>
            <p className="text-4xl font-bold">{report.averageScore?.toFixed(0)}%</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Category Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#b0b8cc" />
                <YAxis stroke="#b0b8cc" />
                <Tooltip contentStyle={{ backgroundColor: "#1a1f3a", border: "1px solid #ec4899" }} />
                <Bar dataKey="value" fill="#a855f7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Category Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={{ fill: "#ffffff", fontSize: 12 }}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1a1f3a", border: "1px solid #ec4899" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-2xl font-bold mb-6 text-gradient">Strengths</h2>
            <div className="space-y-3">
              {report.strengths?.map((strength, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-[var(--color-success)] font-bold mt-1">✓</span>
                  <p>{strength}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-6 text-gradient">Areas to Improve</h2>
            <div className="space-y-3">
              {report.weaknesses?.map((weakness, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-[var(--color-error)] font-bold mt-1">!</span>
                  <p>{weakness}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="card mt-8">
          <h2 className="text-2xl font-bold mb-6">Recommendations</h2>
          <div className="space-y-4">
            {report.recommendations?.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-4 pb-4 border-b border-white/10 last:border-b-0">
                <span className="text-[var(--color-accent-purple)] font-bold">{idx + 1}</span>
                <div>
                  <p>{rec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Reports
