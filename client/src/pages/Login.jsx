"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { login } from "../store/authSlice"
import { useNavigate, Link } from "react-router-dom"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(login({ email, password }))
    if (result.payload?.token) {
      navigate("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] px-4">
      <div className="w-full max-w-md card">
        <h1 className="text-3xl font-bold mb-2 text-gradient">PlacementPrep</h1>
        <p className="text-[var(--color-text-secondary)] mb-8">Master your placement preparation</p>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-[var(--color-text-secondary)] mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[var(--color-accent-pink)] hover:text-[var(--color-accent-purple)]">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
