"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { signup } from "../store/authSlice"
import { useNavigate, Link } from "react-router-dom"

function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)
  const [validationError, setValidationError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidationError("")

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match")
      return
    }

    const result = await dispatch(signup({ name, email, password }))
    if (result.payload?.token) {
      navigate("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] px-4">
      <div className="w-full max-w-md card">
        <h1 className="text-3xl font-bold mb-2 text-gradient">Join PlacementPrep</h1>
        <p className="text-[var(--color-text-secondary)] mb-8">Start your placement journey today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-[var(--color-bg-tertiary)] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent-pink)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-[var(--color-bg-tertiary)] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent-pink)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[var(--color-bg-tertiary)] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent-pink)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[var(--color-bg-tertiary)] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent-pink)]"
              required
            />
          </div>

          {(error || validationError) && <p className="text-red-400 text-sm">{error || validationError}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-[var(--color-text-secondary)] mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--color-accent-pink)] hover:text-[var(--color-accent-purple)]">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
