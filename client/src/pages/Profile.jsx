"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout } from "../store/authSlice"
import Navbar from "../components/Navbar"

function Profile() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [theme, setTheme] = useState("dark")

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-12">Profile & Settings</h1>

        {/* Personal Information */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={user?.name || ""}
                className="w-full bg-[var(--color-bg-tertiary)] border border-white/10 rounded-lg px-4 py-2 text-white"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                className="w-full bg-[var(--color-bg-tertiary)] border border-white/10 rounded-lg px-4 py-2 text-white"
                disabled
              />
            </div>
            <button className="btn-primary">Update Profile</button>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-6">Preferences</h2>
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-[var(--color-bg-tertiary)] border border-white/10 rounded-lg px-4 py-2 text-white"
            >
              <option value="dark">Dark Mode</option>
              <option value="light">Light Mode</option>
            </select>
          </div>
        </div>

        {/* Logout */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Account</h2>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>
      </main>
    </div>
  )
}

export default Profile
