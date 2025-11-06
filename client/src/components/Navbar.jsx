"use client"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../store/authSlice"

function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <nav className="bg-[var(--color-bg-secondary)] border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">PP</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">PlacementPrep</span>
          </Link>

          <div className="flex items-center space-x-1 sm:space-x-4">
            <Link
              to="/dashboard"
              className="px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition"
            >
              Dashboard
            </Link>
            <Link
              to="/practice"
              className="px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition"
            >
              Practice
            </Link>
            <Link
              to="/interviews"
              className="px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition"
            >
              Interviews
            </Link>
            <Link
              to="/resume"
              className="px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition"
            >
              Resume
            </Link>
            <Link
              to="/reports"
              className="px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition"
            >
              Reports
            </Link>
            <Link
              to="/curriculum"
              className="px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition"
            >
              Learn
            </Link>
            <Link
              to="/profile"
              className="px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
