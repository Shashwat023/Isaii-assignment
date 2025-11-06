"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchInterviews, createInterview } from "../store/interviewsSlice"
import Navbar from "../components/Navbar"

function Interviews() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { interviews, loading } = useSelector((state) => state.interviews)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    package: "",
    date: "",
    topicsRequired: [],
  })

  useEffect(() => {
    dispatch(fetchInterviews())
  }, [dispatch])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await dispatch(createInterview(formData))
    setShowForm(false)
    setFormData({ company: "", role: "", package: "", date: "", topicsRequired: [] })
  }

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Interviews</h1>
            <p className="text-[var(--color-text-secondary)]">Track and prepare for your interviews</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            Add Interview
          </button>
        </div>

        {showForm && (
          <div className="card mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company"
                  className="bg-[var(--color-bg-tertiary)] border border-white/10 rounded-lg px-4 py-2 text-white"
                  required
                />
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="Role"
                  className="bg-[var(--color-bg-tertiary)] border border-white/10 rounded-lg px-4 py-2 text-white"
                  required
                />
                <input
                  type="number"
                  name="package"
                  value={formData.package}
                  onChange={handleInputChange}
                  placeholder="Package (in LPA)"
                  className="bg-[var(--color-bg-tertiary)] border border-white/10 rounded-lg px-4 py-2 text-white"
                  required
                />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="bg-[var(--color-bg-tertiary)] border border-white/10 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">
                  Add
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p>Loading interviews...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviews.map((interview) => (
              <div
                key={interview._id}
                className="card hover:border-[var(--color-accent-pink)] transition cursor-pointer"
                onClick={() => navigate(`/interview/${interview._id}`)}
              >
                <h3 className="text-xl font-bold mb-2">{interview.company}</h3>
                <p className="text-[var(--color-text-secondary)] mb-4">{interview.role}</p>
                <div className="space-y-2 mb-4 text-sm">
                  <p>
                    <strong>Package:</strong> {interview.package} LPA
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(interview.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${interview.status === "completed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}
                    >
                      {interview.status}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Interviews
