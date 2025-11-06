"use client"

import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { checkAuth } from "./store/authSlice"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import PracticeRounds from "./pages/PracticeRounds"
import TestInterface from "./pages/TestInterface"
import Interviews from "./pages/Interviews"
import InterviewDetail from "./pages/InterviewDetail"
import ResumeManagement from "./pages/ResumeManagement"
import ResumeDetail from "./pages/ResumeDetail"
import Reports from "./pages/Reports"
import Curriculum from "./pages/Curriculum"
import Profile from "./pages/Profile"
import PrivateRoute from "./components/PrivateRoute"

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(checkAuth())
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--color-bg-primary)]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-accent-purple)] border-t-[var(--color-accent-pink)]"></div>
          <p className="mt-4 text-[var(--color-text-secondary)]">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/practice" element={<PracticeRounds />} />
          <Route path="/test/:id" element={<TestInterface />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/interview/:id" element={<InterviewDetail />} />
          <Route path="/resume" element={<ResumeManagement />} />
          <Route path="/resume/:id" element={<ResumeDetail />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/curriculum" element={<Curriculum />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App
